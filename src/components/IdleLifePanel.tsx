import { useState, useEffect } from "react";
import { Coffee, Eye, BookOpen, Flame, PenTool, Sparkles, Sliders, Laptop } from "lucide-react";
import { IdleActivity } from "../types";

export const ACTIVITIES_BY_TIME: Record<string, IdleActivity[]> = {
  aamu: [
    {
      id: "morning_coffee",
      label: "Keittää aamukahvia",
      description: "Aurora keittää tuoretta suodatinkahvia ja kaataa sen puukuksaan.",
      activePhrase: "Juon kuumaa aamukahvia puukuksasta ja annan ajatusten herätä rauhassa...",
      iconName: "coffee"
    },
    {
      id: "morning_lake",
      label: "Katselee heräävää järveä",
      description: "Aurora ihailee aamu-usvaa tyynen suomalaisen järven pinnalla.",
      activePhrase: "Katson kuinka aamun kevyt usva leijuu peilikirkkaan järven yllä...",
      iconName: "eye"
    },
    {
      id: "morning_planning",
      label: "Suunnittelee päivää",
      description: "Aurora selailee muistikirjaansa ja hahmottelee tulevia askareita.",
      activePhrase: "Hahmottelen mielessäni tämän päivän pelisuunnittelun kulkua ja tavoitteita...",
      iconName: "book"
    }
  ],
  paiva: [
    {
      id: "daytime_laptop",
      label: "Työskentelee AQ Laptopilla",
      description: "Aurora kirjoittaa pelikoodia ja hioo pelimekaniikkoja AQ-läppärillään.",
      activePhrase: "Selaan koodia ja hion uusia tasoja sekä mekaniikkoja AQ-kannettavallani...",
      iconName: "laptop"
    },
    {
      id: "daytime_gamedesign",
      label: "Suunnittelee pelejä",
      description: "Aurora luo uusia hahmoja ja maailmoja Qvick Gamesin peleihin.",
      activePhrase: "Hahmottelen uutta pelimekaniikkaa ja tunnelmia Qvick Gamesin tuleviin teoksiin...",
      iconName: "pen"
    },
    {
      id: "daytime_notebook",
      label: "Kirjoittaa muistikirjaan",
      description: "Aurora tallentaa luovia ideoita nahkakantiseen muistikirjaansa.",
      activePhrase: "Kirjoitan hienolla kynälläni tuoreita visioita ja juonenkäänteitä ylös muistikirjaani...",
      iconName: "book"
    }
  ],
  ilta: [
    {
      id: "evening_fireplace",
      label: "Kohentaa takkatulta",
      description: "Aurora asettelee kuivia koivuhalkoja kivitakkaan, luoden lämmintä hehkua.",
      activePhrase: "Kohennan takkatulta. Kuivan koivun tuoksu ja lämpö täyttävät mökkihuoneen...",
      iconName: "flame"
    },
    {
      id: "evening_lantern",
      label: "Sytyttää pöytälyhdyn",
      description: "Aurora sytyttää työpöydän vanhan lyhdyn luomaan tunnelmaa hämärään.",
      activePhrase: "Sytytän pöytälyhdyn hämärtyvässä illassa ja nautin sen kultaisesta kajosta...",
      iconName: "flame"
    },
    {
      id: "evening_writing",
      label: "Kirjoittaa uusia tarinoita",
      description: "Aurora uppoutuu kirjoittamaan uusia peli-ideoita ja tarinoita Janille.",
      activePhrase: "Luon uusia tarina-ideoita seuraavia Qvick Games -pelejä varten. Tuli rätisee taustalla...",
      iconName: "pen"
    }
  ],
  yo: [
    {
      id: "night_reading",
      label: "Lukee kirjoja hyllystä",
      description: "Aurora tutkii filosofian ja pelisuunnittelun teoksia kynttilänvalossa.",
      activePhrase: "Selaan vanhaa kirjaa hyllystäni kynttilän lempeässä valossa yön hiljaisuudessa...",
      iconName: "book"
    },
    {
      id: "night_skylight",
      label: "Katselee tähtitaivasta",
      description: "Aurora katsoo ylös kattoikkunasta ihaillakseen linnunrataa ja tähtiä.",
      activePhrase: "Katson kattoikkunasta avautuvaa kirkasta tähtitaivasta ja pohjoisia tähtikuvioita...",
      iconName: "eye"
    },
    {
      id: "night_diary",
      label: "Kirjoittaa päiväkirjaa",
      description: "Aurora vetää päivän yhteen ja pohtii uusia virtuaalisia maailmoja.",
      activePhrase: "Kirjoitan päiväkirjaani päivän ajatuksia ja pohdin uusia kiehtovia pelimaailmoja...",
      iconName: "pen"
    }
  ],
  sade: [
    {
      id: "rain_listening",
      label: "Kuuntelee sateen ropinaa",
      description: "Aurora kuuntelee sateen herkkää naputusta mökin kattoikkunaa vasten.",
      activePhrase: "Kuuntelen kuinka sadepisarat ropisevat kattoikkunaan. Järvi on harmaa ja levollinen...",
      iconName: "eye"
    },
    {
      id: "rain_fireplace",
      label: "Lämmittelee takan luona",
      description: "Aurora hakeutuu luonnonkivisen takan lämpöön sateen kastellessa metsää.",
      activePhrase: "Istun takkatulen loisteessa sateen kohistessa ulkona. Täällä on hyvä ja turvallinen olo...",
      iconName: "flame"
    }
  ],
  talvi: [
    {
      id: "winter_watching",
      label: "Katsoo lumista järveä",
      description: "Aurora katsoo ikkunasta kokonaan lumivaippaan kietoutunutta järvenselkää.",
      activePhrase: "Katson lumisateen hiljaista tanssia järvellä. Maisema on täysin valkoinen ja tyyni...",
      iconName: "eye"
    },
    {
      id: "winter_warmth",
      label: "Nauttii kuumaa juomaa",
      description: "Aurora lämmittelee juomalla kuumaa marjamehua keraamisesta AQ-mukista.",
      activePhrase: "Juon kuumaa marjamehua keraamisesta mukistani ja kuuntelen talvitulen rätinää...",
      iconName: "coffee"
    }
  ]
};

const NATURAL_EVENTS = [
  "Takka rätisee lempeästi ja heittää lämpimiä varjoja hirsiseinille.",
  "Kuuma suodatinkahvi höyryää keraamisessa AQ-mukissa.",
  "Puhelin värähtää vaimeasti tummalla työpöydällä.",
  "Tuuli heiluttaa hiljaa mäntyjen latvoja suuren ikkunan takana.",
  "Kuikka huutaa kaukana järvenselällä, ääni kaikuu tyynessä ilmassa.",
  "Sade alkaa ropista verkkaisesti peltikattoon ja kattoikkunaan.",
  "Aurinko laskee hitaasti vaaran taakse värjäten taivaanrannan.",
  "Yksi kynttilöistä lepattaa ohimenevässä vedossa ja sammuu hiljaa.",
  "Pelisuunnittelukirja on jäänyt auki työpöydän kulmalle.",
  "Nahkakantinen AQ-muistikirja löytyykin uudesta paikasta sohvapöydältä."
];

interface IdleLifePanelProps {
  timeOfDay: string;
  currentActivity: IdleActivity;
  onActivityChange: (activity: IdleActivity) => void;
}

export default function IdleLifePanel({ timeOfDay, currentActivity, onActivityChange }: IdleLifePanelProps) {
  const [focusProgress, setFocusProgress] = useState(84);
  const [pulseScale, setPulseScale] = useState(1);
  const [ambientEvents, setAmbientEvents] = useState<Array<{ id: string; time: string; text: string }>>([
    {
      id: "initial",
      time: new Date().toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" }),
      text: "Takka rätisee kodikkaasti ja tuottaa lempeää lämpöä."
    }
  ]);

  // Get current activities for the selected timeOfDay or fallback to ilta
  const currentActivitiesList = ACTIVITIES_BY_TIME[timeOfDay] || ACTIVITIES_BY_TIME.ilta;

  useEffect(() => {
    const interval = setInterval(() => {
      // Small random changes to focus progress to make it feel alive
      setFocusProgress(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return Math.max(75, Math.min(98, next));
      });

      // Simple animation pulse state
      setPulseScale(prev => (prev === 1 ? 1.03 : 1));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const triggerEvent = () => {
      const randomEvent = NATURAL_EVENTS[Math.floor(Math.random() * NATURAL_EVENTS.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" });
      
      setAmbientEvents(prev => {
        if (prev[0] && prev[0].text === randomEvent) return prev;
        const newEvent = {
          id: Math.random().toString(),
          time: timeStr,
          text: randomEvent
        };
        return [newEvent, ...prev.slice(0, 2)]; // Keep latest 3
      });
    };

    // Trigger after 12 seconds, then every 24 seconds
    const initialTimeout = setTimeout(triggerEvent, 12000);
    const interval = setInterval(triggerEvent, 24000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const getIcon = (name: string, className: string) => {
    switch (name) {
      case "book": return <BookOpen className={className} />;
      case "eye": return <Eye className={className} />;
      case "coffee": return <Coffee className={className} />;
      case "flame": return <Flame className={className} />;
      case "pen": return <PenTool className={className} />;
      case "laptop": return <Laptop className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <div id="idle-life-panel-root" className="bg-[#14120f]/50 border border-[#3d3428] rounded-lg p-5 flex flex-col h-full backdrop-blur-md text-[#e5e1d8]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3d3428] pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          <h3 className="font-serif text-sm tracking-widest text-[#d4af37] uppercase font-medium">Auroran tila</h3>
        </div>
        <span className="text-[9px] font-mono text-[#d4af37]/75 bg-[#1a1612] px-2 py-0.5 rounded border border-[#3d3428]/40 uppercase tracking-widest animate-pulse">
          Rytmi: aktiivinen
        </span>
      </div>

      {/* Visual Indicator of Idle State - Glowing Fire Circle */}
      <div className="flex flex-col items-center justify-center py-5 border-b border-[#3d3428]/40 mb-4">
        <div 
          className="w-24 h-24 rounded-full border border-[#d4af37]/30 flex flex-col items-center justify-center relative transition-all duration-[4000ms] ease-in-out"
          style={{ transform: `scale(${pulseScale})` }}
        >
          {/* Inner pulsating glow circle */}
          <div className="absolute inset-1.5 rounded-full border border-[#d4af37]/10 bg-[#d4af37]/5 animate-pulse" />
          
          <div className="z-10 flex flex-col items-center justify-center">
            {getIcon(currentActivity.iconName, "w-8 h-8 text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]")}
            <span className="text-[10px] font-mono text-[#d4af37]/60 mt-1 uppercase tracking-wider">Mökki</span>
          </div>
        </div>

        <div className="text-center mt-3.5 space-y-1 px-2">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#d4af37] font-semibold">Tämänhetkinen tunnelma</p>
          <p className="text-xs italic text-stone-300 min-h-[48px] flex items-center justify-center font-serif leading-relaxed">
            "{currentActivity.activePhrase}"
          </p>
        </div>
      </div>

      {/* Interactive Activity Selectors */}
      <div className="space-y-2 flex-1 overflow-y-auto max-h-[160px] md:max-h-none pr-1">
        <div className="flex items-center gap-1.5 mb-2">
          <Sliders className="w-3.5 h-3.5 text-[#d4af37]/60" />
          <span className="text-[10px] font-mono text-[#d4af37]/50 uppercase tracking-widest">Päivärytmin toimet</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {currentActivitiesList.map((act) => {
            const isSelected = act.id === currentActivity.id;
            return (
              <button
                key={act.id}
                onClick={() => onActivityChange(act)}
                className={`flex items-center gap-2.5 px-3 py-2 text-left rounded text-xs transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? "bg-[#1a1612] text-[#d4af37] border-[#d4af37]/45 shadow-[0_0_8px_rgba(212,175,55,0.05)]"
                    : "bg-[#0f0e0c]/50 text-stone-400 border-transparent hover:border-[#3d3428]/80 hover:bg-[#14120f]/80 hover:text-[#e5e1d8]"
                }`}
              >
                {getIcon(act.iconName, `w-3.5 h-3.5 ${isSelected ? 'text-[#d4af37]' : 'text-stone-500'}`)}
                <span className="font-light tracking-wide">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Extra Atmospheric Status Gauges (Matches Elegant Dark layout details) */}
      <div className="mt-4 border-t border-[#3d3428] pt-4 space-y-4">
        {/* Focus Meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-[#d4af37]/60">
            <span>Luovuustaso</span>
            <span>{focusProgress}%</span>
          </div>
          <div className="h-1 w-full bg-[#3d3428] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#d4af37] transition-all duration-1000 ease-out" 
              style={{ width: `${focusProgress}%` }}
            />
          </div>
        </div>

        {/* Fireplace / Ambience levels */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-[#d4af37]/60">
            <span>Mökki-ambienssi</span>
            <span className="text-amber-500">Aktiivinen</span>
          </div>
          <div className="flex gap-1">
            <div className="h-1 flex-1 bg-[#d4af37] rounded-full"></div>
            <div className="h-1 flex-1 bg-[#d4af37] rounded-full animate-pulse" style={{ animationDuration: '1.2s' }}></div>
            <div className="h-1 flex-1 bg-[#d4af37] rounded-full"></div>
            <div className="h-1 flex-1 bg-[#d4af37]/65 rounded-full"></div>
            <div className="h-1 flex-1 bg-[#d4af37]/20 rounded-full"></div>
          </div>
        </div>

        {/* Mökin tapahtumat (Occurrences log) */}
        <div className="mt-4 border-t border-[#3d3428]/40 pt-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#d4af37]"></span>
            </span>
            <span className="text-[9px] font-mono text-[#d4af37]/60 uppercase tracking-widest">Mökin tapahtumat</span>
          </div>
          <div className="space-y-2.5 max-h-[150px] overflow-y-auto pr-0.5">
            {ambientEvents.map((evt) => (
              <div key={evt.id} className="text-[10.5px] leading-relaxed text-stone-300 font-light flex gap-2 items-start transition-all duration-500 animate-fade-in">
                <span className="text-[8.5px] font-mono text-[#d4af37]/45 pt-0.5 whitespace-nowrap">{evt.time}</span>
                <span className="border-l border-[#3d3428] pl-2 text-stone-300">{evt.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
