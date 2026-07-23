import { useState, useEffect } from "react";
import { Project } from "../types";
import { Compass, Sparkles, Clock, Check } from "lucide-react";

interface WorkspaceAwarenessProps {
  activeProject: Project | null;
  onSelectProjectName?: (name: string) => void;
}

export default function WorkspaceAwareness({ activeProject, onSelectProjectName }: WorkspaceAwarenessProps) {
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const projectName = activeProject?.name || "Murhamysteeri Mökillä";

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionMinutes(prev => prev + 1);
    }, 60000); // Increments every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (sessionMinutes > 30) {
      setSuggestion(`Olet työskennellyt ahkerasti hankkeen "${projectName}" parissa yli 30 min. Haluatko siirtyä hetkeksi pohtimaan Aurora Core -arkkitehtuuria?`);
    } else {
      setSuggestion(null);
    }
  }, [sessionMinutes, projectName]);

  return (
    <div id="workspace-awareness-root" className="bg-stone-950/70 border border-amber-500/20 rounded-lg px-3.5 py-2 flex flex-wrap items-center justify-between text-xs font-mono text-stone-300 backdrop-blur-md my-2">
      <div className="flex items-center gap-2">
        <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow shrink-0" />
        <span className="text-stone-400">AKTIIVINEN TYÖTILA:</span>
        <span className="text-amber-300 font-medium">{projectName}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] text-stone-500 flex items-center gap-1">
          <Clock className="w-3 h-3 text-stone-600" />
          Istunto: {sessionMinutes} min
        </span>

        {suggestion && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded text-[11px] text-amber-200">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="line-clamp-1">{suggestion}</span>
            {onSelectProjectName && (
              <button
                onClick={() => onSelectProjectName("Aurora Qvick")}
                className="underline hover:text-white cursor-pointer"
              >
                Vaihda
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
