import { Project } from "../types";
import { Moon, CheckCircle2, ArrowRight, X, Calendar, Sparkles } from "lucide-react";

interface DailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject: Project | null;
}

export default function DailySummaryModal({ isOpen, onClose, activeProject }: DailySummaryModalProps) {
  if (!isOpen) return null;

  const todayDate = new Date().toLocaleDateString("fi-FI", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const projectName = activeProject?.name || "Murhamysteeri Mökillä";

  const getProgressItems = () => {
    if (projectName.includes("Aurora")) {
      return [
        "Järjestetty muistijärjestelmä luokitelluksi muistiselaimeksi (Memory Browser)",
        "Integroitunut uusi Project Brain ja aamukatsaus -rutiini",
        "Päivitetty Presence Engine 2.0 -animaatiot ja eloisuus",
        "Vahvistettu suomalaista järvenrantamökin rauhaa"
      ];
    }
    return [
      "Edistetty hankkeen pelimekaniikkaa ja johtolankoja",
      "Päivitetty projektiaivot ja tavoitteet muistiin",
      "Hiotut vuorovaikutusraamit Aurora Qvickin kanssa",
      "Tallennetut viralliset sertifikaatit ja opintojaksojen etapit"
    ];
  };

  const progressItems = getProgressItems();

  const getRecommendedStep = () => {
    if (projectName.includes("Murhamysteeri")) {
      return "Jatka Murhamysteeri Mökillä -pelin Steam-valmistelua, trailerin työstöä ja markkinointia huomenna.";
    }
    if (projectName.includes("Aurora")) {
      return "Jatka Project Brain -moduulin ja tekoälykumppanuuden laatuoptimointia huomenna.";
    }
    return "Viimeistele seuraava moduulietappi ja jatka Qvick Games -pelin rakentamista.";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div id="daily-summary-root" className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border border-amber-500/30 rounded-2xl p-6 md:p-8 max-w-lg w-full text-stone-100 shadow-[0_16px_48px_rgba(0,0,0,0.6)] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 transition-colors cursor-pointer"
          title="Sulje"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block">
              AURORA CORE ALPHA 0.2
            </span>
            <h3 className="font-serif text-xl font-medium text-amber-300">
              PÄIVÄN YHTEENVETO
            </h3>
          </div>
        </div>

        {/* Date Stamp */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-400 mb-5 pb-3 border-b border-stone-800">
          <Calendar className="w-3.5 h-3.5 text-amber-500/80" />
          <span className="capitalize">{todayDate}</span>
        </div>

        {/* Today's Progress Checklist */}
        <div className="mb-6 space-y-2">
          <span className="text-xs font-mono text-amber-400/90 uppercase tracking-wider block font-semibold mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            TÄMÄN PÄIVÄN EDISTYS
          </span>
          <div className="space-y-2 bg-stone-950/60 p-4 rounded-xl border border-stone-800/80">
            {progressItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Next Step */}
        <div className="mb-6">
          <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block font-semibold mb-2">
            SUOSITELTU SEURAAVA ASKEL
          </span>
          <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-xs text-amber-200 flex items-center gap-2.5">
            <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-light">{getRecommendedStep()}</span>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-stone-500 italic text-center mb-5">
          "Tämä yhteenveto on päivän heijastus. Kaikki pitkäaikaiset muistot ja projektitavoitteet pysyvät turvassa."
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-serif text-sm rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.1)]"
        >
          Päätä päivän työskentely & Hyvää yötä
        </button>
      </div>
    </div>
  );
}
