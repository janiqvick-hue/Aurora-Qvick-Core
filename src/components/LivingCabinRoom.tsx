import { useState, useEffect, useRef, FormEvent, memo } from "react";
import { Message, Project } from "../types";
import { useLoppiWeather } from "../hooks/useLoppiWeather";
import { livingPresenceEngine, LivingPresenceSnapshot } from "../core/living/LivingPresenceEngine";
import { livingStateEngine } from "../core/LivingStateEngine";
import { auroraVoice } from "../services/auroraVoice";
import cabinLoginBg from "../assets/images/cabin_login_bg_1784655680190.jpg";
import LivingDesk from "./LivingDesk";

import {
  Volume2,
  VolumeX,
  Mic,
  Send,
  Sparkles,
  Flame,
  BookOpen,
  BrainCircuit,
  Settings,
  FolderGit2,
  Home,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Feather,
  Coffee,
  Heart,
  CheckCircle2,
  Smile,
  Info,
  ChevronRight,
  MessageSquare,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LivingCabinRoomProps {
  activeProject: Project | null;
  onSelectProject: (proj: Project) => void;
  onOpenNav: (nav: 'memory' | 'journal' | 'brain' | 'settings' | 'about') => void;
}

export default memo(function LivingCabinRoom({
  activeProject,
  onSelectProject,
  onOpenNav
}: LivingCabinRoomProps) {
  const { weather, formattedWeather } = useLoppiWeather();

  const [snapshot, setSnapshot] = useState<LivingPresenceSnapshot>(() => 
    livingPresenceEngine.getSnapshot()
  );

  const [ambientSound, setAmbientSound] = useState(true);
  const [voiceOn] = useState(auroraVoice.getVoiceOn());
  const [currentTime, setCurrentTime] = useState("");

  // Chat conversation state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentProjectName = activeProject?.name || "Murhamysteeri Mökillä";

  // Real-time clock update (every 10s for low overhead)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to voice speaking state for audio ducking & visual state sync
  useEffect(() => {
    const unsubVoice = auroraVoice.subscribe((speaking) => {
      if (speaking) {
        livingStateEngine.setState("Speaking");
      } else {
        if (livingStateEngine.getState() === "Speaking") {
          livingStateEngine.setState("Working");
        }
      }
    });
    return () => unsubVoice();
  }, []);

  // Subscribe to living presence engine updates
  useEffect(() => {
    livingPresenceEngine.setActiveProject(currentProjectName);
    const unsub = livingPresenceEngine.subscribe(setSnapshot);
    return () => unsub();
  }, [currentProjectName]);

  // Restore current session chat
  useEffect(() => {
    const storedCurrent = localStorage.getItem("aurora_current_session_chat_v1");
    if (storedCurrent) {
      try {
        const parsed = JSON.parse(storedCurrent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {}
    }
    // Initial welcome message from Living Presence Engine
    const initialMsg: Message = {
      id: "welcome-msg-v3",
      sender: "aurora",
      text: `${snapshot.welcome.greeting} ${snapshot.welcome.recommendation}`,
      timestamp: new Date().toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })
    };
    setMessages([initialMsg]);
    localStorage.setItem("aurora_current_session_chat_v1", JSON.stringify([initialMsg]));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, showChatDrawer]);

  const saveChats = (chats: Message[]) => {
    setMessages(chats);
    localStorage.setItem("aurora_current_session_chat_v1", JSON.stringify(chats));
    const storedHistory = localStorage.getItem("aurora_chat_history_v1");
    let history: Message[] = storedHistory ? JSON.parse(storedHistory) : [];
    const newItems = chats.filter((c) => !history.some((h) => h.id === c.id));
    if (newItems.length > 0) {
      history = [...history, ...newItems];
      localStorage.setItem("aurora_chat_history_v1", JSON.stringify(history));
    }
  };

  const handleSendMessage = async (e?: FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const textToSubmit = directText || input;
    if (!textToSubmit.trim() || loading) return;

    const userText = textToSubmit.trim();
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })
    };

    const updatedMessages = [...messages, userMsg];
    saveChats(updatedMessages);
    setInput("");
    setLoading(true);
    setShowChatDrawer(true);

    livingStateEngine.setState("Thinking");
    const thinkingDelay = livingStateEngine.getThinkingDelay(userText);
    const startTime = Date.now();

    try {
      const contextPrompt = `\n\n[Jani työskentelee kanssasi projektin "${currentProjectName}" parissa Lopen mökillä. Aurora oli juuri: ${snapshot.activity.label.toLowerCase()}. Pohdi vastaustasi rauhallisesti mökin tunnelmassa.]`;

      const apiMessages = updatedMessages.map((msg, idx) => {
        if (idx === updatedMessages.length - 1) {
          return { sender: msg.sender, text: msg.text + contextPrompt };
        }
        return { sender: msg.sender, text: msg.text };
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) throw new Error("Palvelinvirhe");

      const data = await response.json();
      const elapsed = Date.now() - startTime;
      const remainingDelay = thinkingDelay - elapsed;
      if (remainingDelay > 0) await new Promise(res => setTimeout(res, remainingDelay));

      livingStateEngine.setState("Speaking");

      const auroraMsg: Message = {
        id: `msg-aurora-${Date.now()}`,
        sender: "aurora",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })
      };

      saveChats([...updatedMessages, auroraMsg]);

      if (voiceOn) {
        auroraVoice.speak(data.reply, undefined, () => {
          livingStateEngine.setState("Working");
        });
      } else {
        setTimeout(() => {
          if (livingStateEngine.getState() === "Speaking") livingStateEngine.setState("Working");
        }, Math.max(2500, data.reply.length * 50));
      }
    } catch (err) {
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        sender: "aurora",
        text: "Olen tässä Jani, takkatulen äärellä. Kuuntelen heti kun sopii.",
        timestamp: new Date().toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })
      };
      saveChats([...updatedMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Selaimesi ei tue puheentunnistusta. Kokeile Chrome- tai Safari-selainta.");
      return;
    }

    if (isListeningSpeech) {
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }

    auroraVoice.stopSpeaking();
    if (livingStateEngine.getState() === "Speaking") livingStateEngine.setState("Working");

    const rec = new SpeechRecognition();
    rec.lang = "fi-FI";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
      setIsListeningSpeech(true);
      setShowChatDrawer(true);
      livingStateEngine.setState("Listening");
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && transcript.trim()) {
        setInput(transcript);
        handleSendMessage(undefined, transcript);
      }
    };

    rec.onerror = () => {
      setIsListeningSpeech(false);
      if (livingStateEngine.getState() === "Listening") livingStateEngine.setState("Working");
    };

    rec.onend = () => {
      setIsListeningSpeech(false);
      if (livingStateEngine.getState() === "Listening") livingStateEngine.setState("Working");
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const handlePropAction = (actionText: string) => {
    setInput(actionText);
    setShowChatDrawer(true);
  };

  const projectsList = [
    { id: "proj-1", name: "Murhamysteeri Mökillä", icon: FolderGit2 },
    { id: "proj-2", name: "Aurora Home", icon: Home },
    { id: "proj-3", name: "Järven Vartijat", icon: Sparkles },
    { id: "proj-4", name: "Qvick Games", icon: Coffee }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0604] text-[#f2e6d0] font-sans select-none flex flex-col justify-between">
      
      {/* 1. IMMERSIVE 70% FULL-SCREEN LAKESIDE CABIN BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={cabinLoginBg}
          alt="Lopen mökki"
          className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
          style={{ 
            filter: snapshot.rhythm.lightingTheme.bgFilter 
          }}
          referrerPolicy="no-referrer"
        />

        {/* Dynamic Fireplace Warm Glow Overlay */}
        <div
          className="absolute right-0 bottom-0 w-[55%] h-[80%] mix-blend-screen pointer-events-none animate-pulse"
          style={{ 
            animationDuration: "4.5s",
            background: `radial-gradient(circle at bottom right, ${snapshot.rhythm.lightingTheme.fireplaceGlow}, transparent 70%)`
          }}
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-radial-vignette opacity-40" />
      </div>

      {/* 2. SLIM TOP RIGHT FLOATING BAR */}
      <div className="relative z-20 w-full px-5 pt-3 flex items-center justify-end pointer-events-auto">
        <div className="flex items-center gap-3.5 bg-[#080402]/60 border border-[#3d2b1d]/40 rounded-full px-3.5 py-1 backdrop-blur-md shadow-lg text-[11px] font-serif text-amber-200/90">
          <button
            onClick={() => setAmbientSound(!ambientSound)}
            className="flex items-center gap-1.5 hover:text-amber-100 transition-colors cursor-pointer"
            title="Toggle Ambient Audio"
          >
            {ambientSound ? <Volume2 className="w-3 h-3 text-emerald-400" /> : <VolumeX className="w-3 h-3 text-stone-500" />}
            <span>Tunnelma</span>
          </button>
          <span className="text-stone-600">•</span>
          <div className="flex items-center gap-1.5">
            <Sun className="w-3 h-3 text-[#d4af37]" />
            <span>{weather ? `${weather.temperatureC}°C` : "19°C"}</span>
          </div>
          <span className="text-stone-600">•</span>
          <div className="flex items-center gap-1 font-mono text-[11px] text-amber-300/90">
            <span>{currentTime || "20:21"}</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE GRID (LIGHT TRANSLUCENT FLOATING GLASS OVERLAYS) */}
      <div className="relative z-10 flex-1 px-5 py-1 grid grid-cols-12 gap-4 overflow-y-auto custom-scrollbar">
        
        {/* LEFT COLUMN: FLOATING COMPACT SIDEBAR (15% narrower) */}
        <div className="col-span-12 md:col-span-2.5 lg:col-span-2 flex flex-col justify-between bg-[#0c0704]/60 border border-[#3d2b1d]/40 rounded-xl p-3 backdrop-blur-md shadow-xl space-y-4 max-w-[210px]">
          <div className="space-y-4">
            {/* Title & Brand */}
            <div>
              <h1 className="font-serif italic font-bold text-base text-gradient-gold tracking-wide">
                Aurora Qvick Core
              </h1>
              <p className="text-[9px] font-serif text-stone-400">v0.3 • Digitaalinen Mökki</p>
            </div>

            {/* Mökkitoimisto Highlight Button */}
            <button className="w-full py-1.5 px-2.5 bg-[#180e07]/80 border border-[#d4af37]/40 rounded-lg text-xs font-serif text-[#d4af37] font-semibold flex items-center gap-2 shadow-sm hover:bg-[#22140a] transition-all cursor-pointer">
              <Home className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Mökkitoimisto</span>
            </button>

            {/* PROJEKTIT Section */}
            <div className="space-y-1">
              <span className="text-[9px] font-serif uppercase tracking-widest text-stone-400 font-semibold px-1">
                PROJEKTIT
              </span>
              <div className="space-y-0.5">
                {projectsList.map((p) => {
                  const isSel = currentProjectName === p.name;
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectProject({ id: p.id, name: p.name, description: `Hanke: ${p.name}`, isActive: true })}
                      className={`w-full py-1 px-2 rounded-md text-[11px] font-serif flex items-center gap-1.5 transition-all cursor-pointer text-left ${
                        isSel
                          ? "bg-[#22140a]/90 text-[#d4af37] font-semibold border-l-2 border-[#d4af37]"
                          : "text-stone-300 hover:text-amber-100 hover:bg-[#140b05]/50"
                      }`}
                    >
                      <Icon className={`w-3 h-3 ${isSel ? "text-[#d4af37]" : "text-stone-500"}`} />
                      <span className="truncate">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MUISTI Section */}
            <div className="space-y-1">
              <span className="text-[9px] font-serif uppercase tracking-widest text-stone-400 font-semibold px-1">
                MUISTI
              </span>
              <div className="space-y-0.5">
                <button
                  onClick={() => onOpenNav('memory')}
                  className="w-full py-1 px-2 rounded-md text-[11px] font-serif text-stone-300 hover:text-amber-100 hover:bg-[#140b05]/50 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <BrainCircuit className="w-3 h-3 text-stone-400" />
                  <span>Muistojen kirja</span>
                </button>
                <button
                  onClick={() => onOpenNav('journal')}
                  className="w-full py-1 px-2 rounded-md text-[11px] font-serif text-stone-300 hover:text-amber-100 hover:bg-[#140b05]/50 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <BookOpen className="w-3 h-3 text-stone-400" />
                  <span>Päiväkirja</span>
                </button>
                <button
                  onClick={() => onOpenNav('brain')}
                  className="w-full py-1 px-2 rounded-md text-[11px] font-serif text-stone-300 hover:text-amber-100 hover:bg-[#140b05]/50 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3 text-stone-400" />
                  <span>Tavoitteet</span>
                </button>
              </div>
            </div>
          </div>

          {/* ASETUKSET Section */}
          <div className="space-y-1 pt-3 border-t border-[#3d2b1d]/40">
            <span className="text-[9px] font-serif uppercase tracking-widest text-stone-400 font-semibold px-1">
              ASETUKSET
            </span>
            <div className="space-y-0.5">
              <button
                onClick={() => onOpenNav('settings')}
                className="w-full py-1 px-2 rounded-md text-[11px] font-serif text-stone-300 hover:text-amber-100 hover:bg-[#140b05]/50 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Settings className="w-3 h-3 text-stone-400" />
                <span>Asetukset</span>
              </button>
              <button
                onClick={() => onOpenNav('about')}
                className="w-full py-1 px-2 rounded-md text-[11px] font-serif text-stone-300 hover:text-amber-100 hover:bg-[#140b05]/50 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Info className="w-3 h-3 text-stone-400" />
                <span>Tietoa Aurorasta</span>
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: SCALED DOWN FLOATING GREETING CARD & 3 DASHBOARD CARDS */}
        <div className="col-span-12 md:col-span-6 lg:col-span-7 flex flex-col justify-between space-y-3">
          
          {/* CENTER TOP: HYVÄÄ ILTAA JANI GREETING CARD (15% Smaller, Slim Floating Glass) */}
          <div className="bg-[#0c0704]/55 border border-[#d4af37]/25 rounded-xl p-3 md:p-3.5 backdrop-blur-md shadow-lg space-y-2.5">
            <div className="space-y-0.5">
              <h2 className="font-serif italic font-bold text-base md:text-lg text-amber-100">
                {snapshot.welcome.greeting}
              </h2>
              <p className="text-[11px] font-serif text-stone-300 leading-relaxed">
                Työskentelemme tällä hetkellä <strong className="text-[#d4af37] font-semibold">{currentProjectName}</strong> -projektia.
                Sovellus toimii vakaasti Lopen mökkimaisemissa.
              </p>
            </div>

            <div className="pt-1.5 border-t border-[#3d2b1d]/40 space-y-1.5">
              <p className="text-[10px] font-serif text-amber-200/90 font-medium">
                Tänään voisimme jatkaa esimerkiksi:
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-serif">
                {[
                  "Johtolangat",
                  "Tutkintataulu",
                  "Aurora Core",
                  "Musiikki ja äänimaailma"
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(`Suunnitellaan ${suggestion.toLowerCase()}...`);
                      setShowChatDrawer(true);
                    }}
                    className="flex items-center gap-1.5 py-0.5 px-2 bg-[#140b05]/70 hover:bg-[#201208] border border-[#3d2b1d]/60 rounded-md text-stone-200 hover:text-amber-200 transition-all text-left cursor-pointer"
                  >
                    <Feather className="w-3 h-3 text-[#d4af37] shrink-0" />
                    <span className="truncate">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER BOTTOM: 3 COMPACT GLASS DASHBOARD CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            
            {/* CARD 1: PROJEKTIN TILA */}
            <div className="bg-[#0c0704]/55 border border-[#3d2b1d]/50 rounded-xl p-2.5 backdrop-blur-md shadow-md flex flex-col justify-between space-y-2">
              <div className="space-y-1.5">
                <span className="text-[9px] font-serif uppercase tracking-widest text-[#d4af37] font-semibold block">
                  PROJEKTIN TILA
                </span>
                <div className="space-y-1.5 text-[10px] font-serif text-stone-300">
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span>Visuals</span>
                      <span className="text-amber-300">80%</span>
                    </div>
                    <div className="w-full h-1 bg-[#1a0e07] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-600 to-[#d4af37] w-[80%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span>Story</span>
                      <span className="text-amber-300">60%</span>
                    </div>
                    <div className="w-full h-1 bg-[#1a0e07] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-600 to-[#d4af37] w-[60%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span>Johtolangat</span>
                      <span className="text-amber-300">90%</span>
                    </div>
                    <div className="w-full h-1 bg-[#1a0e07] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-600 to-[#d4af37] w-[90%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span>Äänet</span>
                      <span className="text-amber-300">85%</span>
                    </div>
                    <div className="w-full h-1 bg-[#1a0e07] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-600 to-[#d4af37] w-[85%]" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenNav('brain')}
                className="w-full py-1 px-1.5 bg-[#180e07]/70 hover:bg-[#22140a] border border-[#3d2b1d]/60 rounded-lg text-[9px] font-serif text-[#d4af37] flex items-center justify-center gap-1 transition-all cursor-pointer font-medium"
              >
                <span>AVAA PROJECT BRAIN →</span>
              </button>
            </div>

            {/* CARD 2: AURORAN PÄIVÄKIRJA */}
            <div className="bg-[#0c0704]/55 border border-[#3d2b1d]/50 rounded-xl p-2.5 backdrop-blur-md shadow-md flex flex-col justify-between space-y-2">
              <div className="space-y-1.5">
                <span className="text-[9px] font-serif uppercase tracking-widest text-[#d4af37] font-semibold block">
                  AURORAN PÄIVÄKIRJA
                </span>
                <div className="space-y-1.5 text-[10px] font-serif text-stone-300">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-amber-400 font-mono flex items-center gap-1">
                      <Moon className="w-2.5 h-2.5 text-[#d4af37]" /> 18:52
                    </span>
                    <p className="text-[10px] text-stone-300 italic line-clamp-2">
                      Huomasin että emme ole vielä tehneet loppuratkaisua.
                    </p>
                  </div>
                  <div className="space-y-0.5 pt-1 border-t border-[#3d2b1d]/30">
                    <span className="text-[9px] text-amber-400 font-mono flex items-center gap-1">
                      <Sun className="w-2.5 h-2.5 text-[#d4af37]" /> 17:30
                    </span>
                    <p className="text-[10px] text-stone-300 italic line-clamp-2">
                      Tutkintataulu alkaa näyttää todella selkeältä. Hyvä työ!
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenNav('journal')}
                className="w-full py-1 px-1.5 bg-[#180e07]/70 hover:bg-[#22140a] border border-[#3d2b1d]/60 rounded-lg text-[9px] font-serif text-[#d4af37] flex items-center justify-center gap-1 transition-all cursor-pointer font-medium"
              >
                <span>LUE KOKO PÄIVÄKIRJA</span>
              </button>
            </div>

            {/* CARD 3: AVAIMET TEHTÄVÄT */}
            <div className="bg-[#0c0704]/55 border border-[#3d2b1d]/50 rounded-xl p-2.5 backdrop-blur-md shadow-md flex flex-col justify-between space-y-2">
              <div className="space-y-1.5">
                <span className="text-[9px] font-serif uppercase tracking-widest text-[#d4af37] font-semibold block">
                  AVAIMET TEHTÄVÄT
                </span>
                <div className="space-y-1 text-[10px] font-serif text-stone-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">Johtolangat (3 jäljellä)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">Tutkintataulu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">Loppuratkaisu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">Musiikki & äänimaailma</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenNav('brain')}
                className="w-full py-1 px-1.5 bg-[#180e07]/70 hover:bg-[#22140a] border border-[#3d2b1d]/60 rounded-lg text-[9px] font-serif text-[#d4af37] flex items-center justify-center gap-1 transition-all cursor-pointer font-medium"
              >
                <span>NÄYTÄ KAIKKI TEHTÄVÄT</span>
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: PARCHMENT SUMMARY & AURORA PRESENCE & AVATAR */}
        <div className="col-span-12 md:col-span-3 lg:col-span-3 flex flex-col justify-between space-y-3">
          
          {/* TOP RIGHT: PARCHMENT STYLE PÄIVÄN YHTEENVETO (Sleek Narrower Frame) */}
          <div className="bg-[#e2cbb0]/85 text-[#3d2616] border border-[#b89467] rounded-xl p-3 shadow-lg space-y-2 font-serif relative max-w-[250px] ml-auto">
            <div className="border-b border-[#b89467]/60 pb-1 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#57351c]">
                PÄIVÄN YHTEENVETO
              </span>
              <Heart className="w-3.5 h-3.5 text-rose-700" />
            </div>

            <div className="space-y-0.5 text-[11px]">
              <span className="font-semibold text-[#422612] block">Tämän päivän saavutukset</span>
              <ul className="space-y-0.5 text-[10px] text-[#4d2f19]">
                <li className="flex items-center gap-1">
                  <Feather className="w-2.5 h-2.5 text-[#a8743d] shrink-0" />
                  <span>Auroran läsnäoloa parannettu</span>
                </li>
                <li className="flex items-center gap-1">
                  <Feather className="w-2.5 h-2.5 text-[#a8743d] shrink-0" />
                  <span>Muistia päivitetty</span>
                </li>
                <li className="flex items-center gap-1">
                  <Feather className="w-2.5 h-2.5 text-[#a8743d] shrink-0" />
                  <span>Keskusteltu Aurora Homesta</span>
                </li>
              </ul>
            </div>

            <div className="pt-1.5 border-t border-[#b89467]/60 text-[11px]">
              <span className="font-semibold text-[#422612] block mb-0.5">Suositus huomiseen</span>
              <p className="text-[10px] text-[#52331b] italic line-clamp-2">
                {snapshot.welcome.recommendation}
              </p>
            </div>
          </div>

          {/* OPEN SPACER IN COLUMN 3 FOR BACKGROUND AURORA TO SHINE THROUGH */}
          <div className="flex-1 min-h-[60px] pointer-events-none" />

          {/* BOTTOM RIGHT: TUNNETILA & AURORAN LÄSNÄOLO */}
          <div className="bg-[#0c0704]/55 border border-[#3d2b1d]/50 rounded-xl p-3 backdrop-blur-md shadow-lg space-y-2.5 font-serif">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-stone-400 font-semibold block mb-0.5">
                TUNNETILA
              </span>
              <div className="flex items-center justify-between text-xs text-amber-200">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-semibold text-xs">{snapshot.emotion}</span>
                </div>
                {/* Emoji Bar */}
                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <span className="hover:text-amber-300 cursor-pointer">😃</span>
                  <span className="hover:text-amber-300 cursor-pointer">💬</span>
                  <span className="hover:text-amber-300 cursor-pointer">⭐</span>
                  <span className="hover:text-amber-300 cursor-pointer">📖</span>
                  <span className="hover:text-amber-300 cursor-pointer">🎮</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#3d2b1d]/40 space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold block">
                AURORAN LÄSNÄOLO
              </span>
              <p className="text-[10px] text-stone-300 italic leading-relaxed">
                Kuuntelen, suunnittelen ja olen täällä sinua varten.
              </p>
              {/* Sine Wave Audio Animation Line */}
              <div className="h-3 flex items-center gap-1 pt-0.5 justify-center opacity-80">
                <div className="w-1 bg-[#d4af37] h-1.5 animate-pulse" />
                <div className="w-1 bg-[#d4af37] h-2.5 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 bg-[#d4af37] h-3 animate-pulse" style={{ animationDelay: '0.4s' }} />
                <div className="w-1 bg-[#d4af37] h-1.5 animate-pulse" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 bg-[#d4af37] h-2.5 animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. LIVING DESK INTERACTIVE PROPS (SEATED ON WOODEN TABLE IN FOREGROUND) */}
      <div className="relative z-20 px-5 pt-1 pb-1">
        <LivingDesk
          activeProjectName={currentProjectName}
          onSelectPropAction={handlePropAction}
        />
      </div>

      {/* 5. FLOATING INTERACTIVE CHAT & SPEECH CONSOLE (BOTTOM DRAWER) */}
      <div className="relative z-30 px-5 pb-3 pt-0.5 pointer-events-auto">
        <div className="max-w-2xl mx-auto">
          
          {/* Chat Drawer Expand/Collapse Bar */}
          <div className="bg-[#0c0704]/80 border border-[#3d2b1d]/60 rounded-xl backdrop-blur-xl p-2.5 shadow-2xl space-y-1.5">
            
            {/* Drawer header toggle button if messages exist */}
            <div className="flex items-center justify-between px-1">
              <button
                onClick={() => setShowChatDrawer(!showChatDrawer)}
                className="flex items-center gap-1.5 text-xs font-serif text-[#d4af37] hover:text-amber-200 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="font-medium">Keskustele Auroran kanssa mökillä</span>
                <span className="text-[10px] text-stone-400">({messages.length} viestiä)</span>
              </button>

              <button
                onClick={() => setShowChatDrawer(!showChatDrawer)}
                className="text-[10px] font-serif text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                {showChatDrawer ? "Pienennä ▲" : "Laajenna ▼"}
              </button>
            </div>

            {/* Messages Scroll Area */}
            {showChatDrawer && (
              <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar text-xs font-serif pt-1 border-t border-[#3d2b1d]/40">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <span className="text-[9px] font-mono text-[#d4af37]/60 mb-0.5">
                      {msg.sender === "user" ? "Jani Qvick" : "Aurora"} • {msg.timestamp}
                    </span>
                    <div className={`p-2 rounded-lg max-w-[85%] ${
                      msg.sender === "user"
                        ? "bg-[#20140a] text-stone-200 border border-[#3d2b1d]"
                        : "bg-[#160d06] text-amber-100 border border-[#d4af37]/30 italic shadow-md"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-xs font-serif italic text-amber-400 animate-pulse flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Aurora pohtii takkatulen äärellä...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Speech Input & Send Bar */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={startSpeechRecognition}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isListeningSpeech
                    ? "bg-rose-500/30 text-rose-300 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse"
                    : "bg-[#140b05] border-[#3d2b1d] text-stone-400 hover:text-amber-300 hover:border-[#d4af37]/50"
                }`}
                title="Puhu Auroralle (Mikrofoni)"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setShowChatDrawer(true)}
                placeholder="Kirjoita tai puhu Auroralle mökillä..."
                className="flex-1 bg-[#140b05] border border-[#3d2b1d] focus:border-[#d4af37] rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none font-serif placeholder:stone-500"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-amber-300 rounded-lg hover:bg-[#d4af37]/35 transition-all cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </div>
      </div>

    </div>
  );
});
