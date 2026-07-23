import { Project } from "../types";
import { Sunrise, Sparkles, CheckCircle2, ArrowRight, X } from "lucide-react";

interface MorningBriefProps {
  activeProject: Project | null;
  onClose?: () => void;
  onActionClick?: (action: string) => void;
}

export default function MorningBrief({ activeProject, onClose, onActionClick }: MorningBriefProps) {
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 10) return "Hyvää huomenta Jani.";
    if (hr >= 10 && hr < 17) return "Hyvää päivää Jani.";
    if (hr >= 17 && hr < 22) return "Hyvää iltaa Jani.";
    return "Lämmintä yötä Jani.";
  };

  const projectName = activeProject?.name || "Murhamysteeri Mökillä";
  
  const getActionPoints = (): string[] => {
    if (projectName.includes("Murhamysteeri")) {
      return [
        "markkinointimateriaalien & Steam-sivun hienosäätö",
        "pelin trailerin & esittelyvideon viilaus",
        "pelaajapalautteen keruu & julkaisun jälkeinen seuranta"
      ];
    }
    if (projectName.includes("Aurora")) {
      return [
        "Aurora Core Alpha 0.2 -moduulien testaaminen",
        "muistin ja kontekstin optimointi",
        "Presence Engine 2.0 -animaatioiden viilaus"
      ];
    }
    if (projectName.includes("Järven Vartijat")) {
      return [
        "selain- ja Unity-version arkkitehtuuri",
        "suojelijoiden kykyjen tasapainottaminen",
        "tarinallisten kappaleiden luonnostelu"
      ];
    }
    return [
      "päämekaniikan kehittäminen",
      "käyttöliittymän ja äänimaailman hionta",
      "peliarkkitehtuurin dokumentointi"
    ];
  };

  const actionPoints = getActionPoints();

  return (
    <div id="morning-brief-root" className="bg-gradient-to-b from-stone-900/90 to-stone-950/95 border border-amber-500/30 rounded-xl p-5 md:p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative text-stone-200 my-3 transition-all duration-300">
      {/* Dismiss button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-stone-400 hover:text-stone-200 p-1 transition-colors cursor-pointer"
          title="Sulje katsaus"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Header Badge */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400">
          <Sunrise className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase font-medium">
          AAMUKATSAUS & TYÖTILAN TILANNE
        </span>
      </div>

      {/* Greeting Title */}
      <h2 className="font-serif text-xl md:text-2xl text-stone-100 font-normal mb-2 tracking-wide">
        {getGreeting()}
      </h2>

      {/* Status Paragraphs */}
      <div className="space-y-1.5 text-xs md:text-sm text-stone-300 font-light leading-relaxed">
        <p>
          Työstämme tällä hetkellä hanketta <span className="text-amber-300 font-medium">{projectName}</span>.
        </p>
        <p className="flex items-center gap-1.5 text-emerald-400/90 font-mono text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Mökin työtila toimii vakaasti. Kaikki muistitiedot ja tavoitteet synkronoitu.</span>
        </p>
      </div>

      {/* Suggested Focus Points */}
      <div className="mt-4 pt-3.5 border-t border-stone-800/80">
        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-2">
          TÄNÄÄN VOISIMME JATKAA ESIMERKIKSI:
        </span>
        <ul className="space-y-2">
          {actionPoints.map((point, idx) => (
            <li 
              key={idx} 
              onClick={() => onActionClick && onActionClick(point)}
              className="flex items-center justify-between bg-stone-900/60 hover:bg-amber-500/10 border border-stone-800/60 hover:border-amber-500/30 px-3 py-2 rounded-lg text-xs text-stone-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500/70 group-hover:text-amber-400 shrink-0" />
                <span className="capitalize">{point}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
