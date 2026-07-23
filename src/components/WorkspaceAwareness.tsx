import { useState, useEffect } from "react";
import { Project } from "../types";
import { 
  Compass, 
  Sparkles, 
  Clock, 
  BrainCircuit, 
  BookOpen, 
  CheckSquare, 
  FolderGit2, 
  ExternalLink, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Activity,
  Zap,
  Target,
  Layers,
  Lightbulb,
  CheckCircle2,
  LogOut,
  X
} from "lucide-react";
import { proactiveIntelligenceEngine, SessionSummary } from "../core/ProactiveIntelligenceEngine";

interface WorkspaceAwarenessProps {
  activeProject: Project | null;
  onSelectProjectName?: (name: string) => void;
  onOpenNav?: (nav: 'memory' | 'journal' | 'brain' | 'settings' | 'about' | 'ecosystem') => void;
}

export default function WorkspaceAwareness({ 
  activeProject, 
  onSelectProjectName,
  onOpenNav 
}: WorkspaceAwarenessProps) {
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const projectName = activeProject?.name || "Murhamysteeri Mökillä";
  const suggestions = proactiveIntelligenceEngine.getProactiveSuggestions(projectName);
  const insights = proactiveIntelligenceEngine.getWorkspaceInsights();

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionMinutes(prev => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleEndSession = () => {
    const summary = proactiveIntelligenceEngine.generateSessionSummary(sessionMinutes || 1);
    setSessionSummary(summary);
    setShowSummaryModal(true);
  };

  const dailyPlan = [
    { timeOfDay: "AAMU", action: "Review Project Brain & Kertaa aamukatsauksen tavoitteet", icon: "🌅" },
    { timeOfDay: "ILTAPÄIVÄ", action: `Jatka hankkeen ${projectName} koodia & Tarkasta GitHub`, icon: "☀️" },
    { timeOfDay: "ILTA", action: "Päivitä Päiväkirja, pohdi Aurora Homea & Ilta-reflektio", icon: "🌙" }
  ];

  return (
    <div id="workspace-awareness-root" className="bg-[#0b0603]/80 border border-[#3d2b1d] rounded-xl p-3 shadow-xl backdrop-blur-md my-2 text-xs font-serif text-[#f2e6d0]">
      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-amber-400 animate-spin-slow shrink-0" />
          <span className="text-stone-400 font-mono text-[11px] uppercase">AKTIIVINEN TYÖTILA:</span>
          <span className="text-amber-300 font-medium font-mono text-xs">{projectName}</span>
          <span className="text-[10px] font-mono text-stone-500 bg-[#1e1107] px-1.5 py-0.5 rounded border border-[#3d2b1d]">
            {sessionMinutes} min
          </span>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2">
          {onOpenNav && (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => onOpenNav('ecosystem')}
                className="px-2 py-1 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 font-semibold rounded text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                title="Avaa Qvick Games Studio OS & Viikkokatsaus"
              >
                <Layers className="w-3 h-3 text-amber-400" />
                <span>Studio OS</span>
              </button>
              <button
                onClick={() => onOpenNav('brain')}
                className="px-2 py-1 bg-[#1e1107] hover:bg-[#28170a] border border-[#3d2b1d] text-amber-200 rounded text-[11px] flex items-center gap-1 cursor-pointer transition-all"
                title="Avaa Project Brain"
              >
                <BrainCircuit className="w-3 h-3 text-amber-400" />
                <span>Brain</span>
              </button>
              <button
                onClick={() => onOpenNav('journal')}
                className="px-2 py-1 bg-[#1e1107] hover:bg-[#28170a] border border-[#3d2b1d] text-amber-200 rounded text-[11px] flex items-center gap-1 cursor-pointer transition-all"
                title="Avaa Päiväkirja"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Päiväkirja</span>
              </button>
            </div>
          )}

          <button
            onClick={handleEndSession}
            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-semibold rounded text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-sm"
            title="Päätä työskentelyistunto ja luo yhteenveto"
          >
            <LogOut className="w-3 h-3 text-amber-400" />
            <span>Päätä istunto</span>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-amber-400 hover:text-amber-200 border border-[#3d2b1d] rounded-md transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono"
            title="Laajenna Työtila-Dashboard"
          >
            <span>DASHBOARD</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Proactive Intelligence Banner Bar */}
      {suggestions.length > 0 && (
        <div className="mt-2.5 p-2 bg-amber-950/40 border border-amber-500/30 rounded-lg flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-mono text-amber-300 font-bold uppercase text-[10px]">AURORAN EHDOTUS:</span>
            <span className="text-stone-200 font-serif">{suggestions[0].title} – {suggestions[0].description}</span>
          </div>
          {onOpenNav && (
            <button
              onClick={() => {
                if (suggestions[0].suggestedActionType === 'openStudioOS') onOpenNav('ecosystem');
                else if (suggestions[0].suggestedActionType === 'openDiary') onOpenNav('journal');
                else if (suggestions[0].suggestedActionType === 'openBrain') onOpenNav('brain');
                else onOpenNav('ecosystem');
              }}
              className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded font-mono text-[10px] transition-all cursor-pointer shrink-0"
            >
              {suggestions[0].actionLabel}
            </button>
          )}
        </div>
      )}

      {/* Expanded Workspace Dashboard & Assistant */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#3d2b1d]/60 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn">
          {/* 1. Proactive Suggestions & Insights */}
          <div className="bg-[#140b05]/80 p-2.5 rounded-lg border border-[#3d2b1d]/60 space-y-2">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block flex items-center gap-1 font-semibold">
              <Lightbulb className="w-3.5 h-3.5" />
              PROAKTIIVISET EHDOTUKSET & HAVAINNOT
            </span>
            <div className="space-y-1.5 text-[11px]">
              {suggestions.map(s => (
                <div key={s.id} className="p-2 bg-[#0b0603]/80 rounded border border-[#3d2b1d] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-amber-400 uppercase">{s.category}</span>
                    <span className="text-[9px] font-mono text-stone-500">{s.priority} prioriteetti</span>
                  </div>
                  <p className="text-amber-200 font-bold">{s.title}</p>
                  <p className="text-stone-300 text-[10px] leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Daily Planning Assistant */}
          <div className="bg-[#140b05]/80 p-2.5 rounded-lg border border-[#3d2b1d]/60 space-y-2">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block flex items-center gap-1 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              AURORAN PÄIVÄNSUUNNITELMA
            </span>
            <div className="space-y-1.5 text-[11px]">
              {dailyPlan.map((p, idx) => (
                <div key={idx} className="flex items-start gap-1.5 bg-[#0b0603]/60 p-1.5 rounded border border-[#3d2b1d]/30">
                  <span className="text-xs">{p.icon}</span>
                  <div>
                    <span className="text-[9px] font-mono text-amber-400 font-semibold block">{p.timeOfDay}</span>
                    <span className="text-stone-300 leading-tight">{p.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Workspace Insights & Gentle Reminders */}
          <div className="bg-[#140b05]/80 p-2.5 rounded-lg border border-[#3d2b1d]/60 space-y-2">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block flex items-center gap-1 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              TYÖTILAN HAVAINNOT & MUISTUTUKSET
            </span>
            <div className="space-y-1.5 text-[11px]">
              {insights.map(ins => (
                <div key={ins.id} className="flex items-start gap-2 text-stone-300 bg-[#0b0603]/60 p-1.5 rounded border border-[#3d2b1d]/30">
                  <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-stone-200 leading-snug">{ins.message}</p>
                    <span className="text-[9px] font-mono text-stone-500">{ins.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Session Summary Modal */}
      {showSummaryModal && sessionSummary && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-serif text-[#f2e6d0]">
          <div className="relative w-full max-w-lg bg-[#0c0704] border border-[#d4af37]/50 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-3">
              <div className="flex items-center gap-2">
                <LogOut className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-amber-200 text-base">TYÖSKENTELYISTUNNON YHTEENVETO</h3>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="p-1 text-stone-400 hover:text-amber-200 border border-[#3d2b1d] rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-mono text-stone-400 bg-[#140b05] p-2 rounded border border-[#3d2b1d]">
                <span>Istunnon kesto: {sessionSummary.durationMinutes} min</span>
                <span>{new Date(sessionSummary.timestamp).toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">Työstetyt hankkeet</span>
                <div className="flex flex-wrap gap-1">
                  {sessionSummary.projectsWorkedOn.map((p, idx) => (
                    <span key={idx} className="bg-[#1e1107] border border-[#3d2b1d] text-amber-200 px-2 py-0.5 rounded text-[11px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">Saavutetut virstanpylväät</span>
                <ul className="space-y-1 bg-[#140b05] p-2.5 rounded border border-[#3d2b1d]">
                  {sessionSummary.completedMilestones.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-stone-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-lg space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block">Suositeltu seuraava tehtävä</span>
                <p className="text-stone-200 leading-relaxed font-sans">{sessionSummary.recommendedNextTask}</p>
              </div>
            </div>

            <button
              onClick={() => setShowSummaryModal(false)}
              className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold rounded text-xs transition-all cursor-pointer"
            >
              Päätä istunto ja sulje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

