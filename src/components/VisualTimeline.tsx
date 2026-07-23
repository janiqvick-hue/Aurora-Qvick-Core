import React, { useState, useEffect } from "react";
import { ProjectVisualTimelineEvent, ProjectVisualAsset } from "../types";
import { projectVisualMemoryEngine } from "../core/ProjectVisualMemoryEngine";
import { projectIdentityEngine } from "../core/ProjectIdentityEngine";
import { 
  Calendar, 
  CheckCircle2, 
  Flag, 
  Camera, 
  Palette, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  Clock, 
  Layers
} from "lucide-react";

interface VisualTimelineProps {
  projectName: string;
  onSelectProject?: (projName: string) => void;
  className?: string;
}

export default function VisualTimeline({ projectName, onSelectProject, className = "" }: VisualTimelineProps) {
  const [timelineEvents, setTimelineEvents] = useState<ProjectVisualTimelineEvent[]>([]);
  const [previewAsset, setPreviewAsset] = useState<ProjectVisualTimelineEvent | null>(null);

  const refreshTimeline = () => {
    const events = projectVisualMemoryEngine.getVisualTimeline(projectName);
    setTimelineEvents(events);
  };

  useEffect(() => {
    refreshTimeline();
  }, [projectName]);

  const projIdentity = projectIdentityEngine.getProjectByName(projectName);

  const renderEventTypeBadge = (type: ProjectVisualTimelineEvent['type']) => {
    switch (type) {
      case 'Project Started':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"><Flag className="w-3 h-3 text-amber-400" /> Hankkeen Aloitus</span>;
      case 'Major Milestone':
        return <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Valmis Etappi</span>;
      case 'Latest Screenshot':
        return <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"><Camera className="w-3 h-3 text-cyan-400" /> Kuvakaappaus</span>;
      case 'Newest Concept Art':
        return <span className="bg-purple-950/80 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"><Palette className="w-3 h-3 text-purple-400" /> Konseptitaide</span>;
      case 'Latest Documentation':
        return <span className="bg-stone-800 text-stone-200 border border-stone-600 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"><FileText className="w-3 h-3 text-stone-400" /> Dokumentti</span>;
      default:
        return <span className="bg-blue-950/80 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"><Sparkles className="w-3 h-3 text-blue-400" /> Visualisointi</span>;
    }
  };

  return (
    <div className={`bg-stone-900/80 border border-stone-800 rounded-xl p-5 flex flex-col h-full font-serif ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-sm font-serif tracking-widest text-stone-100 uppercase font-medium flex items-center gap-2">
              <span>PROJEKTIN VISUAALINEN AIKAJANA (VISUAL TIMELINE)</span>
            </h3>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              Hankkeen kronologinen kehitys: <span className="text-amber-400 font-semibold">{projectName}</span>
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 font-bold">
          {projIdentity?.status || "Kehityksessä"}
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 overflow-y-auto pr-2 relative space-y-6">
        {/* Vertical Connecting Guide Line */}
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-stone-800/80 z-0" />

        {timelineEvents.map((evt, idx) => (
          <div key={evt.id || idx} className="relative flex items-start gap-4 z-10 group">
            {/* Timeline Icon Node */}
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-lg ${
              evt.type === 'Major Milestone'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                : evt.type === 'Project Started'
                ? 'bg-amber-950 border-amber-500 text-amber-400'
                : 'bg-stone-950 border-stone-700 text-stone-300'
            }`}>
              {evt.type === 'Major Milestone' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : evt.type === 'Project Started' ? (
                <Flag className="w-4 h-4" />
              ) : evt.type === 'Latest Screenshot' ? (
                <Camera className="w-4 h-4" />
              ) : evt.type === 'Newest Concept Art' ? (
                <Palette className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>

            {/* Event Details Card */}
            <div className="flex-1 bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 hover:border-amber-500/30 transition-all duration-300 space-y-2 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/60 pb-2">
                <div className="flex items-center gap-2">
                  {renderEventTypeBadge(evt.type)}
                  <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500/70" />
                    {evt.date}
                  </span>
                </div>
              </div>

              <h4 className="text-xs font-serif font-medium text-stone-100 group-hover:text-amber-300 transition-colors">
                {evt.title}
              </h4>

              <p className="text-xs text-stone-300 font-sans leading-relaxed">
                {evt.description}
              </p>

              {/* Optional Visual Thumbnail Preview */}
              {evt.assetUrl && (
                <div 
                  onClick={() => setPreviewAsset(evt)}
                  className="relative mt-2 rounded-lg overflow-hidden border border-stone-800 bg-stone-900 group/img cursor-pointer max-w-sm h-28"
                >
                  <img
                    src={evt.assetUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-950/40 group-hover/img:bg-stone-950/10 transition-colors flex items-center justify-center">
                    <span className="px-2.5 py-1 bg-amber-500/90 text-stone-950 rounded text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <Eye className="w-3 h-3" /> Suurenna
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal for Timeline Asset Preview */}
      {previewAsset && previewAsset.assetUrl && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-xs font-serif font-medium text-amber-300">{previewAsset.title}</span>
              <button
                onClick={() => setPreviewAsset(null)}
                className="text-stone-400 hover:text-stone-100 text-xs font-mono px-2 py-1 bg-stone-800 rounded"
              >
                Sulje
              </button>
            </div>
            <div className="bg-stone-950 rounded-lg overflow-hidden border border-stone-800 max-h-[60vh] flex items-center justify-center">
              <img src={previewAsset.assetUrl} alt={previewAsset.title} className="max-h-[60vh] w-auto object-contain" />
            </div>
            <p className="text-xs text-stone-300 font-sans">{previewAsset.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
