import React from 'react';
import { ProjectIdentity } from '../types';
import { 
  FolderGit2, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ExternalLink, 
  Globe, 
  Github, 
  Layers, 
  Target, 
  ArrowRight,
  ShieldCheck,
  Tag,
  Network,
  Compass,
  Link2
} from 'lucide-react';

interface ProjectIdentityCardProps {
  project: ProjectIdentity;
  onSelectRelated?: (relatedName: string) => void;
  onOpenBrain?: (projectName: string) => void;
  compact?: boolean;
}

export const ProjectIdentityCard: React.FC<ProjectIdentityCardProps> = ({
  project,
  onSelectRelated,
  onOpenBrain,
  compact = false
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Released':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Released</span>;
      case 'In Development':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> In Development</span>;
      case 'Prototype':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center gap-1"><Sparkles className="w-3 h-3 text-cyan-400" /> Prototype</span>;
      case 'Planning':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 flex items-center gap-1"><Target className="w-3 h-3 text-purple-400" /> Planning</span>;
      case 'Maintenance':
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-blue-400" /> Maintenance</span>;
      default:
        return <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">{status}</span>;
    }
  };

  const getEcosystemRoleBadge = (role?: string) => {
    switch (role) {
      case 'Completed Project':
        return <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Completed Project</span>;
      case 'Main Project':
        return <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-500/30 flex items-center gap-1"><Compass className="w-2.5 h-2.5 text-amber-400" /> Main Project</span>;
      case 'Support Project':
        return <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-500/30 flex items-center gap-1"><Network className="w-2.5 h-2.5 text-blue-400" /> Support Project</span>;
      case 'Sub Project':
        return <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-500/30 flex items-center gap-1"><Link2 className="w-2.5 h-2.5 text-cyan-400" /> Sub Project</span>;
      case 'Future Project':
        return <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-500/30 flex items-center gap-1"><Target className="w-2.5 h-2.5 text-purple-400" /> Future Project</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#120c08]/90 backdrop-blur-md rounded-xl border border-[#3d2b1d] p-4 text-stone-200 shadow-xl transition-all duration-300 hover:border-[#d4af37]/40">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-serif font-bold text-amber-200 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-amber-400 shrink-0" />
              {project.name}
            </h3>
            {project.codeName && (
              <span className="text-[10px] font-mono text-amber-500/70">
                ({project.codeName})
              </span>
            )}
            {getEcosystemRoleBadge(project.roleInEcosystem)}
          </div>
          <p className="text-xs text-amber-100/70 font-sans mt-0.5">
            {project.relationshipType || project.type} • <span className="italic">{project.category}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {getStatusBadge(project.status)}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-stone-300 font-sans leading-relaxed my-2.5">
        {project.description}
      </p>

      {/* Recommended Focus Tags */}
      {project.recommendedFocus && project.recommendedFocus.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 my-2.5">
          <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold mr-1">
            Painopisteet:
          </span>
          {project.recommendedFocus.map((focus, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#27190f] text-amber-300 border border-[#523720]"
            >
              {focus}
            </span>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-1 my-3 bg-[#0c0704] p-2.5 rounded-lg border border-[#2d1e13]">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-stone-400 font-mono flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-amber-400" />
            {project.currentPhase}
          </span>
          <span className="font-mono font-bold text-amber-300">
            {project.progress}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#1a110a] rounded-full overflow-hidden border border-[#3d2b1d]">
          <div 
            className={`h-full transition-all duration-500 ${
              project.progress === 100 
                ? 'bg-gradient-to-r from-emerald-600 to-amber-400' 
                : 'bg-gradient-to-r from-amber-600 to-[#d4af37]'
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {!compact && (
        <>
          {/* Ecosystem Graph Connections (Supports / Depends on) */}
          {(project.supportsProjects?.length || project.dependsOnProjects?.length) ? (
            <div className="my-3 p-2.5 rounded-lg bg-[#180f0a] border border-[#322114] space-y-2">
              {project.supportsProjects && project.supportsProjects.length > 0 && (
                <div className="text-xs font-sans">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold flex items-center gap-1 mb-1">
                    <ArrowRight className="w-3 h-3 text-emerald-400 rotate-[-45deg]" /> Tukee Hankkeita (Supports):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.supportsProjects.map((sup, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectRelated && onSelectRelated(sup)}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/80 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>{sup}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-emerald-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {project.dependsOnProjects && project.dependsOnProjects.length > 0 && (
                <div className="text-xs font-sans pt-1 border-t border-[#2a1b10]">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold flex items-center gap-1 mb-1">
                    <Link2 className="w-3 h-3 text-cyan-400" /> Riippuu Hankkeista (Depends on):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.dependsOnProjects.map((dep, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectRelated && onSelectRelated(dep)}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/40 hover:bg-cyan-900/80 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>{dep}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-cyan-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Next Milestone */}
          {project.nextMilestone && (
            <div className="text-xs font-sans bg-[#1c120b] p-2 rounded border border-[#322114] mb-3">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold block mb-0.5">
                Seuraava Virstanpylväs:
              </span>
              <span className="text-stone-200">{project.nextMilestone}</span>
            </div>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-3">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-semibold block mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-400" /> Teknologiat & Alusta:
              </span>
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1f150c] text-amber-200/80 border border-[#3d2a1b]"
                  >
                    {tech}
                  </span>
                ))}
                {project.platform.map((plat, idx) => (
                  <span 
                    key={`p-${idx}`} 
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18201a] text-emerald-300/80 border border-emerald-900/40"
                  >
                    {plat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions & Links */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2a1b10] text-xs">
            <div className="flex items-center gap-3">
              {project.website && (
                <a 
                  href={project.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-mono"
                >
                  <Globe className="w-3 h-3" /> Verkkosivu
                </a>
              )}
              {project.repository && (
                <a 
                  href={`https://github.com/${project.repository}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-stone-400 hover:text-stone-200 flex items-center gap-1 text-[11px] font-mono"
                >
                  <Github className="w-3 h-3" /> GitHub
                </a>
              )}
            </div>

            {onOpenBrain && (
              <button
                onClick={() => onOpenBrain(project.name)}
                className="px-2.5 py-1 rounded bg-[#2a1b10] hover:bg-[#3d2717] text-amber-200 text-[11px] font-mono font-medium border border-[#4d331e] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Avaa Projektin Aivot</span>
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
