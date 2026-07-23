import { useState, useEffect, useRef, FormEvent, memo, useMemo } from "react";
import { Message, Project } from "../types";
import { useLoppiWeather } from "../hooks/useLoppiWeather";
import { livingPresenceEngine, LivingPresenceSnapshot } from "../core/living/LivingPresenceEngine";
import { livingStateEngine } from "../core/LivingStateEngine";
import { auroraVoice } from "../services/auroraVoice";
import { auroraMemoryEngine } from "../core/AuroraMemoryEngine";
import cabinLoginBg from "../assets/images/cabin_login_bg_1784655680190.jpg";
import { DEFAULT_BRAIN_DATA } from "./ProjectBrain";
import WorkspaceAwareness from "./WorkspaceAwareness";
import MultimodalComposer, { ChatAttachment } from "./MultimodalComposer";

import {
  Volume2,
  VolumeX,
  Mic,
  Send,
  Sparkles,
  BookOpen,
  BrainCircuit,
  Settings,
  FolderGit2,
  Home,
  Sun,
  Moon,
  Feather,
  Coffee,
  Heart,
  CheckCircle2,
  Info,
  MessageSquare,
  Music,
  Gamepad2,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Target,
  X
} from "lucide-react";

interface LivingCabinRoomProps {
  activeProject: Project | null;
  onSelectProject: (proj: Project) => void;
  onOpenNav: (nav: 'memory' | 'journal' | 'brain' | 'settings' | 'about' | 'ecosystem') => void;
}

type LayoutMode = "focus" | "balanced" | "information";

export default memo(function LivingCabinRoom({
  activeProject,
  onSelectProject,
  onOpenNav
}: LivingCabinRoomProps) {
  const { weather } = useLoppiWeather();

  const [snapshot, setSnapshot] = useState<LivingPresenceSnapshot>(() => 
    livingPresenceEngine.getSnapshot()
  );

  const [auroraState, setAuroraState] = useState(livingStateEngine.getState());
  const [ambientSound, setAmbientSound] = useState(true);
  const [voiceOn] = useState(auroraVoice.getVoiceOn());
  const [currentTime, setCurrentTime] = useState("");

  // Layout mode & panel collapse states (localStorage persisted)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    const saved = localStorage.getItem("aurora_layout_mode_v1");
    return (saved === "focus" || saved === "balanced" || saved === "information") ? saved : "balanced";
  });

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [showCenterCard, setShowCenterCard] = useState(true);

  useEffect(() => {
    localStorage.setItem("aurora_layout_mode_v1", layoutMode);
  }, [layoutMode]);

  // Subscribe to livingStateEngine for real-time presence state (Working, Thinking, Speaking, etc.)
  useEffect(() => {
    const unsubState = livingStateEngine.subscribe((st) => setAuroraState(st));
    return () => unsubState();
  }, []);

  // Chat conversation state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentProjectName = activeProject?.name || "Murhamysteeri Mökillä";

  // Real-time clock update (every 10s)
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

  const handleSendMessage = async (e?: FormEvent, directText?: string, attachmentsParam?: ChatAttachment[]) => {
    if (e) e.preventDefault();
    const textToSubmit = directText || input;
    const hasAttachments = attachmentsParam && attachmentsParam.length > 0;
    if ((!textToSubmit.trim() && !hasAttachments) || loading) return;

    let userText = textToSubmit.trim();

    if (hasAttachments) {
      let attSummary = "\n\n--- JANIN LIITETIEDOSTOT JA KANSIOT ---";
      attachmentsParam.forEach(att => {
        if (att.type === 'folder') {
          attSummary += `\n[KANSIO: "${att.name}" (${att.fileCount} tiedostoa)]`;
          if (att.filesSummary && att.filesSummary.length > 0) {
            attSummary += "\nSisältöesimerkki:\n";
            attSummary += att.filesSummary.slice(0, 10).map(f => `- ${f.path} (${f.size} B)`).join("\n");
            attSummary += "\n";
          }
        } else if (att.type === 'code' || att.type === 'document') {
          attSummary += `\n[DOKUMENTTI/KOODI: "${att.name}"]\n\`\`\`\n${(att.content || "").substring(0, 2500)}\n\`\`\`\n`;
        } else if (att.type === 'image') {
          attSummary += `\n[KUVA/KUVAKAAPPAUS: "${att.name}" (${att.mimeType})]\n`;
        } else {
          attSummary += `\n[TIEDOSTO: "${att.name}" (${att.mimeType}, ${att.size} B)]\n`;
        }
      });
      userText = userText ? `${userText}${attSummary}` : `Tässä liitteet Aurora:${attSummary}`;
    }

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
      const memoryContext = auroraMemoryEngine.retrieveRelevantContext(userText);
      const contextPrompt = `\n\n[Jani työskentelee kanssasi projektin "${currentProjectName}" parissa Lopen mökillä. Aurora oli juuri: ${snapshot.activity.label.toLowerCase()}.${memoryContext ? ` ${memoryContext}` : ""} Pohdi vastaustasi rauhallisesti mökin tunnelmassa.]`;

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

  const projectsList = [
    { id: "proj-1", name: "Murhamysteeri Mökillä", icon: FolderGit2 },
    { id: "proj-2", name: "Aurora Qvick", icon: BrainCircuit },
    { id: "proj-3", name: "Aurora Home", icon: Home },
    { id: "proj-4", name: "Järven Vartijat", icon: Gamepad2 },
    { id: "proj-5", name: "Qvick Games", icon: Sparkles }
  ];

  const activeBrainData = useMemo(() => {
    try {
      const saved = localStorage.getItem("aurora_project_brain_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[currentProjectName]) return parsed[currentProjectName];
      }
    } catch (e) {}
    return (
      DEFAULT_BRAIN_DATA[currentProjectName] ||
      DEFAULT_BRAIN_DATA["Murhamysteeri Mökillä"]
    );
  }, [currentProjectName, snapshot]);

  const recentJournalEntries = useMemo(() => {
    try {
      const saved = localStorage.getItem("aurora_journal_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 2);
      }
    } catch (e) {}
    return [
      { timestamp: "18:52", text: "Tarkastelin opintomerkintöjä (21 op Xamk) ja Qvick Games -portfolioita. Kaikki on järjestyksessä." },
      { timestamp: "17:30", text: "Tutkintataulu ja koodiarkisto näyttävät erittäin selkeiltä ja heijastavat mökin rauhaa." }
    ];
  }, [snapshot]);


  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0604] text-[#f2e6d0] font-sans select-none flex flex-col justify-between">
      
      {/* 1. IMMERSIVE LAKESIDE CABIN BACKGROUND WITH SEATED AURORA & FIREPLACE */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={cabinLoginBg}
          alt="Lopen mökki ja Aurora"
          className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.02]"
          referrerPolicy="no-referrer"
        />

        {/* Dynamic Fireplace Warm Glow Overlay */}
        <div
          className="absolute right-0 bottom-0 w-[50%] h-[75%] mix-blend-screen pointer-events-none animate-pulse"
          style={{ 
            animationDuration: "4s",
            background: "radial-gradient(circle at bottom right, rgba(245, 158, 11, 0.2), transparent 70%)"
          }}
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-radial-vignette opacity-25" />
      </div>

      {/* 2. TOP RIGHT FLOATING STATUS BAR & WORKSPACE AWARENESS BANNER */}
      <div className="relative z-20 w-full px-6 pt-2 flex flex-col gap-1.5 pointer-events-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 max-w-4xl">
            <WorkspaceAwareness activeProject={activeProject} onOpenNav={onOpenNav} />
          </div>

          <div className="flex items-center gap-3.5 bg-[#0b0603]/70 border border-[#3d2b1d]/60 rounded-full px-4 py-1.5 backdrop-blur-md shadow-xl text-xs font-serif text-amber-200/90 shrink-0">
            <button
              onClick={() => setAmbientSound(!ambientSound)}
              className="flex items-center gap-1.5 hover:text-amber-100 transition-colors cursor-pointer"
              title="Kytke taustaäänet"
            >
              <Music className={`w-3.5 h-3.5 ${ambientSound ? "text-amber-400" : "text-stone-500"}`} />
              <span className="font-medium">Tunnelma</span>
            </button>
            <span className="text-stone-600">•</span>
            <div className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{weather ? `${weather.temperatureC}°C` : "19°C"}</span>
            </div>
            <span className="text-stone-600">•</span>
            <div className="flex items-center gap-1.5 font-mono text-xs text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentTime || "20:21"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN COMPOSITION WORKSPACE LAYOUT MATCHING REFERENCE IMAGE */}
      <div className="relative z-10 flex-1 px-6 py-2 grid grid-cols-12 gap-5 overflow-y-auto custom-scrollbar">
        
        {/* LEFT COLUMN: NAVIGATION PANEL */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2.5 flex flex-col justify-between bg-[#0b0603]/75 border border-[#3d2b1d]/60 rounded-xl p-4 backdrop-blur-md shadow-2xl space-y-4 max-w-[220px]">
          <div className="space-y-4">
            {/* Title & Brand */}
            <div>
              <h1 className="font-serif italic font-bold text-lg text-amber-200 tracking-wide">
                Aurora Qvick Core
              </h1>
              <p className="text-[10px] font-mono text-amber-400 font-semibold mt-0.5">Alpha 0.4</p>
            </div>

            {/* Mökkitoimisto Highlight Button */}
            <button className="w-full py-2 px-3 bg-[#1e1107]/90 border border-[#d4af37]/60 rounded-lg text-xs font-serif text-[#d4af37] font-semibold flex items-center gap-2 shadow-md hover:bg-[#28170a] transition-all cursor-pointer">
              <Home className="w-4 h-4 text-[#d4af37]" />
              <span>Mökkitoimisto</span>
            </button>

            {/* PROJEKTIT Section */}
            <div className="space-y-1 pt-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#a88242] font-semibold px-1">
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
                      className={`w-full py-1.5 px-2.5 rounded-md text-xs font-serif flex items-center gap-2 transition-all cursor-pointer text-left ${
                        isSel
                          ? "bg-[#251509]/90 text-[#d4af37] font-semibold border-l-2 border-[#d4af37]"
                          : "text-stone-300 hover:text-amber-100 hover:bg-[#140b05]/60"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSel ? "text-[#d4af37]" : "text-stone-500"}`} />
                      <span className="truncate">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MUISTI Section */}
            <div className="space-y-1 pt-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#a88242] font-semibold px-1">
                STUDIO OS & MUISTI
              </span>
              <div className="space-y-0.5">
                <button
                  onClick={() => onOpenNav('ecosystem')}
                  className="w-full py-1.5 px-2.5 rounded-md text-xs font-serif text-amber-300 font-semibold bg-[#251509]/80 hover:bg-[#351e0d] border border-[#d4af37]/40 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Qvick Games OS</span>
                </button>
                <button
                  onClick={() => onOpenNav('memory')}
                  className="w-full py-1.5 px-2.5 rounded-md text-xs font-serif text-stone-300 hover:text-amber-100 hover:bg-[#140b05]/60 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-stone-400" />
                  <span>Muistojen kirja</span>
                </button>
                <button
                  onClick={() => onOpenNav('journal')}
                  className="w-full py-1.5 px-2.5 rounded-md text-xs font-serif text-stone-300 hover:text-amber-100 hover:bg-[#140b05]/60 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                  <span>Päiväkirja</span>
                </button>
                <button
                  onClick={() => onOpenNav('brain')}
                  className="w-full py-1.5 px-2.5 rounded-md text-xs font-serif text-stone-300 hover:text-amber-100 hover:bg-[#140b05]/60 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>Tavoitteet</span>
                </button>
              </div>
            </div>

            {/* ASETUKSET Section */}
            <div className="space-y-1 pt-2 border-t border-[#3d2b1d]/40">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#a88242] font-semibold px-1">
                ASETUKSET
              </span>
              <div className="space-y-0.5">
                <button
                  onClick={() => onOpenNav('settings')}
                  className="w-full py-1.5 px-2.5 rounded-md text-xs font-serif text-stone-300 hover:text-amber-100 hover:bg-[#140b05]/60 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-stone-400" />
                  <span>Asetukset</span>
                </button>
                <button
                  onClick={() => onOpenNav('about')}
                  className="w-full py-1.5 px-2.5 rounded-md text-xs font-serif text-stone-300 hover:text-amber-100 hover:bg-[#140b05]/60 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-stone-400" />
                  <span>Tietoa Aurorasta</span>
                </button>
              </div>
            </div>
          </div>

          {/* Wooden Plaque / Quote Note at Bottom Left */}
          <div className="mt-4 pt-3 border-t border-[#3d2b1d]/40 text-center">
            <p className="text-[10px] font-serif italic text-amber-200/80 leading-relaxed">
              "Rauha ei ole paikka, se on mielentila."
            </p>
          </div>
        </div>

        {/* CENTER COLUMN: GREETING PANEL & 3 DASHBOARD CARDS */}
        <div className="col-span-12 md:col-span-6 lg:col-span-6 flex flex-col justify-between space-y-4">
          
          {/* CENTER TOP: HYVÄÄ ILTAA JANI GREETING PANEL */}
          <div className="bg-[#0b0603]/65 border border-[#d4af37]/30 rounded-xl p-5 backdrop-blur-md shadow-2xl space-y-4">
            <div className="space-y-1.5">
              <h2 className="font-serif italic font-normal text-xl md:text-2xl text-[#f5e6d0]">
                {snapshot.welcome.greeting}
              </h2>
              <p className="text-xs md:text-sm font-serif text-stone-300 leading-relaxed">
                Työstämme tällä hetkellä <strong className="text-amber-200 font-semibold">{currentProjectName}</strong> -projektia.<br />
                Sovellus toimii vakaasti ja opintomuisti on turvassa.
              </p>
            </div>

            <div className="pt-2 border-t border-[#3d2b1d]/40 space-y-2">
              <p className="text-xs font-serif text-amber-200/90 font-medium">
                Tänään voisimme jatkaa esimerkiksi:
              </p>
              <div className="space-y-1.5 text-xs font-serif">
                {(activeBrainData.activeTasks && activeBrainData.activeTasks.length > 0 
                  ? activeBrainData.activeTasks.slice(0, 4)
                  : ["Projektisuunnittelu", "Muistin päivittäminen", "Musiikki ja äänimaailma", "Koodiarkkitehtuuri"]
                ).map((suggestion: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(`Suunnitellaan ${suggestion.toLowerCase()}...`);
                      setShowChatDrawer(true);
                    }}
                    className="flex items-center gap-2 text-stone-200 hover:text-amber-200 transition-colors cursor-pointer group text-left"
                  >
                    <Feather className="w-3.5 h-3.5 text-[#d4af37] shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER BOTTOM: 3 COMPACT DASHBOARD CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* CARD 1: PROJEKTIN TILA */}
            <div className="bg-[#0b0603]/65 border border-[#3d2b1d]/60 rounded-xl p-3 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-semibold block">
                  PROJEKTIN TILA
                </span>
                <div className="space-y-2 text-xs font-serif text-stone-300">
                  {Object.entries(activeBrainData.subProgress || { visual: 80, story: 85, audio: 70, testing: 50, code: 90 }).map(([k, v]: [string, any]) => {
                    const labelMap: Record<string, string> = { visual: "Visuaalit", story: "Tarina", audio: "Äänet", testing: "Testaus", code: "Koodi" };
                    return (
                      <div key={k}>
                        <div className="flex justify-between mb-1 text-[11px]">
                          <span>{labelMap[k] || k}</span>
                          <span className="text-amber-300 font-mono">{v}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#180e07] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-600 to-[#d4af37]" style={{ width: `${v}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => onOpenNav('brain')}
                className="w-full py-1.5 px-2 bg-[#1a1007]/80 hover:bg-[#28180b] border border-[#3d2b1d] rounded-lg text-[10px] font-serif text-[#d4af37] tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer font-semibold"
              >
                <span>AVAA PROJECT BRAIN →</span>
              </button>
            </div>

            {/* CARD 2: AURORAN PÄIVÄKIRJA */}
            <div className="bg-[#0b0603]/65 border border-[#3d2b1d]/60 rounded-xl p-3 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-semibold block">
                  AURORAN PÄIVÄKIRJA
                </span>
                <div className="space-y-2 text-xs font-serif text-stone-300">
                  {recentJournalEntries.map((entry: any, idx: number) => (
                    <div key={idx} className={`space-y-1 ${idx > 0 ? "pt-1.5 border-t border-[#3d2b1d]/30" : ""}`}>
                      <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                        {idx === 0 ? <Moon className="w-3 h-3 text-[#d4af37]" /> : <Sun className="w-3 h-3 text-[#d4af37]" />}
                        {entry.timestamp || "18:52"}
                      </span>
                      <p className="text-[11px] text-stone-300 leading-relaxed font-light line-clamp-2">
                        {entry.text || entry.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenNav('journal')}
                className="w-full py-1.5 px-2 bg-[#1a1007]/80 hover:bg-[#28180b] border border-[#3d2b1d] rounded-lg text-[10px] font-serif text-[#d4af37] tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer font-semibold"
              >
                <span>LUE KOKO PÄIVÄKIRJA</span>
              </button>
            </div>

            {/* CARD 3: AVAIMET TEHTÄVÄT */}
            <div className="bg-[#0b0603]/65 border border-[#3d2b1d]/60 rounded-xl p-3 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-semibold block">
                  AVAIMET TEHTÄVÄT
                </span>
                <div className="space-y-1.5 text-xs font-serif text-stone-300">
                  {activeBrainData.activeTasks && activeBrainData.activeTasks.length > 0 ? (
                    activeBrainData.activeTasks.slice(0, 5).map((t: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{t}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-stone-500 italic">Kaikki aktiiviset tehtävät tehty!</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onOpenNav('brain')}
                className="w-full py-1.5 px-2 bg-[#1a1007]/80 hover:bg-[#28180b] border border-[#3d2b1d] rounded-lg text-[10px] font-serif text-[#d4af37] tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer font-semibold"
              >
                <span>NÄYTÄ KAIKKI TEHTÄVÄT</span>
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: PARCHMENT SUMMARY & EMOTION PANEL */}
        <div className="col-span-12 md:col-span-3 lg:col-span-3.5 flex flex-col justify-between space-y-4">
          
          {/* TOP RIGHT: PARCHMENT STYLE PÄIVÄN YHTEENVETO NOTE */}
          <div className="bg-[#dfc2a2]/90 text-[#301a0d] border border-[#a68257] rounded-lg p-4 shadow-2xl space-y-3 font-serif relative max-w-[260px] ml-auto">
            <div className="border-b border-[#a68257]/60 pb-1.5 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-[#4a2810]">
                PÄIVÄN YHTEENVETO
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-semibold text-[#301a0d] block">Tämän päivän saavutukset</span>
              <ul className="space-y-1 text-[11px] text-[#422413] font-serif">
                {(activeBrainData.completedMilestones && activeBrainData.completedMilestones.length > 0
                  ? activeBrainData.completedMilestones.slice(0, 3)
                  : [
                      "Auroran läsnäoloa parannettu",
                      "Xamk 21 op suoritusote vahvistettu",
                      "Project Brain päivitetty"
                    ]
                ).map((m: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Feather className="w-3 h-3 text-[#94612e] shrink-0" />
                    <span className="truncate">{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-[#a68257]/60 text-xs">
              <span className="font-semibold text-[#301a0d] block mb-1">Suositus huomiseen</span>
              <p className="text-[11px] text-[#422413] leading-relaxed font-serif">
                {activeBrainData.auroraRecommendation || "Jatka Project Brainia ja peliemme kehitystä Lopen mökillä."}
              </p>
            </div>

            {/* Heart Icon at Bottom Right of Parchment */}
            <div className="flex justify-end pt-1">
              <Heart className="w-4 h-4 text-[#732a1e] fill-none stroke-[1.5]" />
            </div>
          </div>

          {/* BOTTOM RIGHT: TUNNETILA & AURORAN LÄSNÄOLO PANEL */}
          <div className="bg-[#0b0603]/80 border border-[#3d2b1d]/80 rounded-xl p-4 backdrop-blur-md shadow-2xl space-y-3 font-serif max-w-[280px] ml-auto">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-semibold block">
                  TUNNETILA & KOKOONPANO
                </span>
                <span className="text-[9px] font-mono text-amber-400 bg-[#1e1107] px-1.5 py-0.5 rounded border border-[#3d2b1d]">
                  {snapshot.rhythm.phaseName}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-amber-200">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-semibold text-sm">{snapshot.emotion}</span>
                </div>
                {/* Emoji Bar */}
                <div className="flex items-center justify-between text-base px-1 pt-1 text-stone-300">
                  <span className="p-1 rounded-full bg-amber-500/20 ring-1 ring-amber-400/50 cursor-pointer" title="Rauhallinen">😊</span>
                  <span className="hover:text-amber-300 cursor-pointer transition-colors" title="Keskusteleva">💬</span>
                  <span className="hover:text-amber-300 cursor-pointer transition-colors" title="Innostunut">⭐</span>
                  <span className="hover:text-amber-300 cursor-pointer transition-colors" title="Opiskeleva">📖</span>
                  <span className="hover:text-amber-300 cursor-pointer transition-colors" title="Pelikehitys">🎮</span>
                  <span className="hover:text-amber-300 cursor-pointer transition-colors" title="Yörauha">🌙</span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#3d2b1d]/40 space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-semibold block">
                  AURORAN LÄSNÄOLO
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {livingStateEngine.getStateLabel(auroraState)}
                </span>
              </div>
              <p className="text-xs text-stone-300 italic leading-relaxed min-h-[36px]">
                {auroraState === 'Speaking' && "Vastaan Janille takkatulen valossa..."}
                {auroraState === 'Listening' && "Kuuntelen tarkkaavaisesti Janin puhetta..."}
                {auroraState === 'Thinking' && "Pohdin kysymystäsi syvällisesti mökillä..."}
                {auroraState === 'Working' && "Työskentelen koodin ja hankeportfolion parissa..."}
                {auroraState === 'Planning' && "Suunnittelen päivän ja seuraavan etapin tavoitteita..."}
                {auroraState === 'Researching' && "Tarkastelen johtolankoja ja muistiinpanoja..."}
                {(auroraState !== 'Speaking' && auroraState !== 'Listening' && auroraState !== 'Thinking' && auroraState !== 'Working' && auroraState !== 'Planning' && auroraState !== 'Researching') && "Kuuntelen, suunnittelen ja olen täällä sinua varten."}
              </p>
              {/* Sine Wave Audio Animation Line */}
              <div className="h-4 flex items-center gap-1.5 pt-1 justify-center opacity-90">
                <div className={`w-1 bg-[#d4af37] transition-all duration-300 ${auroraState === 'Speaking' ? 'h-4 animate-bounce' : 'h-2 animate-pulse'}`} />
                <div className={`w-1 bg-[#d4af37] transition-all duration-300 ${auroraState === 'Speaking' ? 'h-5 animate-bounce' : 'h-3.5 animate-pulse'}`} style={{ animationDelay: '0.2s' }} />
                <div className={`w-1 bg-[#d4af37] transition-all duration-300 ${auroraState === 'Speaking' ? 'h-6 animate-bounce' : 'h-4 animate-pulse'}`} style={{ animationDelay: '0.4s' }} />
                <div className={`w-1 bg-[#d4af37] transition-all duration-300 ${auroraState === 'Speaking' ? 'h-3 animate-bounce' : 'h-2 animate-pulse'}`} style={{ animationDelay: '0.1s' }} />
                <div className={`w-1 bg-[#d4af37] transition-all duration-300 ${auroraState === 'Speaking' ? 'h-5 animate-bounce' : 'h-3.5 animate-pulse'}`} style={{ animationDelay: '0.3s' }} />
                <div className={`w-1 bg-[#d4af37] transition-all duration-300 ${auroraState === 'Speaking' ? 'h-2 animate-bounce' : 'h-1.5 animate-pulse'}`} style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. CHAT INPUT & MULTIMODAL CONSOLE AT BOTTOM CENTER */}
      <div className="relative z-30 px-6 pb-3 pt-1 pointer-events-auto">
        <div className="max-w-2xl mx-auto space-y-2">
          
          {/* Drawer header toggle & Messages Drawer */}
          <div className="bg-[#0b0603]/85 border border-[#3d2b1d]/70 rounded-xl backdrop-blur-xl p-2.5 shadow-2xl space-y-2">
            <div className="flex items-center justify-between px-1">
              <button
                onClick={() => setShowChatDrawer(!showChatDrawer)}
                className="flex items-center gap-2 text-xs font-serif text-[#d4af37] hover:text-amber-200 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="font-semibold">Keskustele Auroran kanssa mökillä</span>
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
              <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs font-serif pt-1.5 border-t border-[#3d2b1d]/40">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <span className="text-[9px] font-mono text-[#d4af37]/60 mb-0.5">
                      {msg.sender === "user" ? "Jani Qvick" : "Aurora"} • {msg.timestamp}
                    </span>
                    <div className={`p-2.5 rounded-lg max-w-[85%] whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-[#25160a] text-stone-200 border border-[#3d2b1d]"
                        : "bg-[#180e06] text-amber-100 border border-[#d4af37]/30 italic shadow-md"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-xs font-serif italic text-amber-400 animate-pulse flex items-center gap-2 py-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Aurora pohtii takkatulen äärellä...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Multimodal Composer Component */}
          <MultimodalComposer
            input={input}
            setInput={setInput}
            loading={loading}
            isListeningSpeech={isListeningSpeech}
            startSpeechRecognition={startSpeechRecognition}
            onSendMessage={(text, atts) => handleSendMessage(undefined, text, atts)}
            onFocusInput={() => setShowChatDrawer(true)}
          />

        </div>
      </div>

    </div>
  );
});
