import { useState, useEffect, FormEvent } from "react";
import { Project, ProjectSubProgress } from "../types";
import { projectIdentityEngine } from "../core/ProjectIdentityEngine";
import { projectVisualMemoryEngine } from "../core/ProjectVisualMemoryEngine";
import { usePhase1BSync } from "../hooks/usePhase1BSync";
import ProjectGallery from "./ProjectGallery";
import VisualTimeline from "./VisualTimeline";
import { 
  Cpu, 
  Plus, 
  CheckSquare, 
  Square, 
  Edit3, 
  Calendar, 
  CheckCircle2, 
  Bookmark, 
  BarChart2, 
  Network, 
  ArrowRight, 
  Link2, 
  Compass, 
  Sparkles,
  Images,
  Eye,
  Star
} from "lucide-react";

interface ProjectBrainProps {
  activeProject: Project | null;
  onSelectProject: (p: Project) => void;
}

export default function ProjectBrain({ activeProject, onSelectProject }: ProjectBrainProps) {
  const [activeTab, setActiveTab] = useState<'brain' | 'gallery' | 'timeline'>('brain');
  const [projectsData, setProjectsData] = useState<Record<string, any>>({});
  const [newTaskInput, setNewTaskInput] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const { syncCreateTask, syncUpdateTask, syncUpdateProject } = usePhase1BSync();

  const currentProjectName = activeProject?.name || "Murhamysteeri Mökillä";
  const identity = projectIdentityEngine.getProjectByName(currentProjectName);
  const dependenciesInfo = projectIdentityEngine.getProjectDependencies(currentProjectName);
  const ecosystemChain = projectIdentityEngine.getEcosystemMap();
  const recData = projectIdentityEngine.generateRecommendationsForProject(currentProjectName);
  const heroAsset = projectVisualMemoryEngine.getHeroImage(currentProjectName);
  const galleryAssets = projectVisualMemoryEngine.getAssetsByProject(currentProjectName);

  useEffect(() => {
    // Load from projectIdentityEngine and sync with local brain storage
    const allIdentities = projectIdentityEngine.getProjects();
    const storedBrain = localStorage.getItem("aurora_project_brain_v4");
    let brainMap: Record<string, any> = {};

    if (storedBrain) {
      try {
        brainMap = JSON.parse(storedBrain);
      } catch (e) {
        // Fallback
      }
    }

    // Merge identities into brainMap
    allIdentities.forEach(idnt => {
      if (!brainMap[idnt.name]) {
        brainMap[idnt.name] = {
          status: idnt.status,
          progress: idnt.progress,
          subProgress: idnt.subProgress || { visual: 90, story: 90, audio: 90, testing: 85, code: 90 },
          priority: idnt.priority,
          currentPhase: idnt.currentPhase,
          currentMilestone: idnt.completedMilestones?.[0] || idnt.currentPhase,
          nextMilestone: idnt.nextMilestone,
          upcomingMilestone: idnt.futurePlans?.[0] || "Seuraava vaihe",
          estimatedWork: idnt.status === "Released" ? "Valmis (100%)" : "15 h",
          estimatedCompletion: idnt.status === "Released" ? "Julkaistu 23.7.2026" : "Syyskuu 2026",
          lastModified: idnt.lastUpdated || "23.7.2026",
          activeTasks: idnt.currentGoals || [],
          completedMilestones: idnt.completedMilestones || [],
          notes: idnt.description
        };
      }
    });

    setProjectsData(brainMap);
  }, []);

  const saveBrainData = (updated: Record<string, any>) => {
    setProjectsData(updated);
    localStorage.setItem("aurora_project_brain_v4", JSON.stringify(updated));
  };

  const brain = projectsData[currentProjectName] || {
    status: identity?.status || "In Development",
    progress: identity?.progress || 50,
    subProgress: identity?.subProgress || { visual: 50, story: 50, audio: 50, testing: 50, code: 50 },
    lastModified: identity?.lastUpdated || new Date().toLocaleDateString("fi-FI"),
    activeTasks: identity?.currentGoals || ["Kehityksen seuranta"],
    completedMilestones: identity?.completedMilestones || [],
    notes: identity?.description || "Aktiivinen hanke."
  };

  const renderProgressBar = (value: number) => {
    const totalBlocks = 10;
    const filledBlocks = Math.round((value / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return `${"█".repeat(filledBlocks)}${"░".repeat(emptyBlocks)} ${value}%`;
  };

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    const taskTitle = newTaskInput.trim();
    const updated = { ...projectsData };
    const pData = updated[currentProjectName] || { ...brain };
    pData.activeTasks = [...(pData.activeTasks || []), taskTitle];
    pData.lastModified = new Date().toLocaleDateString("fi-FI");
    updated[currentProjectName] = pData;

    saveBrainData(updated);
    syncCreateTask({
      title: taskTitle,
      projectId: activeProject?.id || identity?.id || null,
      status: 'todo'
    });
    setNewTaskInput("");
  };

  const handleCompleteTask = (taskIndex: number) => {
    const updated = { ...projectsData };
    const pData = updated[currentProjectName] || { ...brain };
    const task = pData.activeTasks[taskIndex];
    if (task) {
      pData.activeTasks = pData.activeTasks.filter((_: any, idx: number) => idx !== taskIndex);
      pData.completedMilestones = [task, ...(pData.completedMilestones || [])];
      pData.lastModified = new Date().toLocaleDateString("fi-FI");
      updated[currentProjectName] = pData;
      saveBrainData(updated);
      syncCreateTask({
        title: task,
        projectId: activeProject?.id || identity?.id || null,
        status: 'completed',
        isCompleted: true
      });
    }
  };

  const handleSaveNotes = () => {
    const updated = { ...projectsData };
    const pData = updated[currentProjectName] || { ...brain };
    pData.notes = notesInput;
    pData.lastModified = new Date().toLocaleDateString("fi-FI");
    updated[currentProjectName] = pData;
    saveBrainData(updated);
    setEditingNotes(false);
  };

  const handleSubProgressChange = (key: keyof ProjectSubProgress, delta: number) => {
    const updated = { ...projectsData };
    const pData = updated[currentProjectName] || { ...brain };
    const currentVal = pData.subProgress?.[key] || 50;
    const newVal = Math.min(100, Math.max(0, currentVal + delta));
    pData.subProgress = { ...pData.subProgress, [key]: newVal };

    // recalculate overall progress
    const vals = Object.values(pData.subProgress) as number[];
    pData.progress = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    pData.lastModified = new Date().toLocaleDateString("fi-FI");
    updated[currentProjectName] = pData;

    // Sync back to projectIdentityEngine
    if (identity) {
      projectIdentityEngine.saveProject({
        ...identity,
        progress: pData.progress,
        subProgress: pData.subProgress
      });
    }

    saveBrainData(updated);
  };

  return (
    <div id="project-brain-root" className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-5 flex flex-col h-full backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-stone-800 pb-3 mb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-amber-500" />
          <h3 className="font-serif text-sm tracking-widest text-stone-200 uppercase font-medium">PROJECT BRAIN & VISUAALINEN MUISTI</h3>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('brain')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'brain'
                ? 'bg-amber-950 text-amber-200 border border-amber-500/50 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Projektiaivot</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gallery'
                ? 'bg-amber-950 text-amber-200 border border-amber-500/50 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Images className="w-3.5 h-3.5 text-amber-400" />
            <span>Galleria ({galleryAssets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-amber-950 text-amber-200 border border-amber-500/50 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Aikajana</span>
          </button>
        </div>
      </div>

      {/* Conditionally Rendered Views */}
      {activeTab === 'gallery' ? (
        <ProjectGallery projectName={currentProjectName} onSelectProject={(pName) => {
          const p = projectIdentityEngine.getProjectByName(pName);
          if (p) onSelectProject({ id: p.id, name: p.name, description: p.description, isActive: true });
        }} />
      ) : activeTab === 'timeline' ? (
        <VisualTimeline projectName={currentProjectName} onSelectProject={(pName) => {
          const p = projectIdentityEngine.getProjectByName(pName);
          if (p) onSelectProject({ id: p.id, name: p.name, description: p.description, isActive: true });
        }} />
      ) : (
        /* Main Grid */
        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Project Name and Ecosystem Role */}
          <div className="bg-stone-950/60 p-3.5 rounded-lg border border-stone-800/80 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">AKTIIVINEN HANKE</span>
                {identity?.roleInEcosystem && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-amber-400" /> {identity.roleInEcosystem}
                  </span>
                )}
              </div>
              <h4 className="font-serif text-lg text-amber-400 font-medium mt-0.5">{currentProjectName}</h4>
              <p className="text-xs text-stone-400 font-sans">{identity?.relationshipType || identity?.type || "Qvick Games Hanke"}</p>
            </div>

            {/* Visual Hero Teaser */}
            {heroAsset && (
              <div 
                onClick={() => setActiveTab('gallery')}
                className="hidden sm:flex items-center gap-2 bg-stone-900 border border-amber-500/30 p-1.5 rounded-lg cursor-pointer hover:border-amber-500 transition-all"
                title="Avaa Projektin Galleria"
              >
                <img src={heroAsset.url} alt={heroAsset.title} className="w-12 h-12 rounded object-cover border border-stone-800" />
                <div className="text-left font-sans pr-1">
                  <span className="text-[9px] font-mono text-amber-400 block flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> HERO IMAGE
                  </span>
                  <span className="text-[10px] text-stone-200 line-clamp-1 max-w-[110px] font-medium">{heroAsset.title}</span>
                </div>
              </div>
            )}
          </div>

        {/* ECOSYSTEM DEPENDENCIES & RELATIONSHIP MAP */}
        <div className="bg-stone-950/80 p-3.5 rounded-lg border border-[#3d2b1d] space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-2">
            <span className="text-[11px] text-amber-300 font-serif tracking-wider font-semibold uppercase flex items-center gap-1.5">
              <Network className="w-4 h-4 text-amber-400" />
              QVICK GAMES EKOSYSTEEMIKARTTA & RIIPPUVUUDET
            </span>
            <span className="text-[10px] text-amber-500/80 font-mono">
              Aurora Core 1.0.2 System
            </span>
          </div>

          {/* Visual Ecosystem Chain */}
          <div className="p-2.5 rounded bg-[#130b06] border border-[#2d1e13]">
            <span className="text-[9px] text-stone-400 uppercase tracking-wider block mb-2 font-bold">
              Kokonaisvaltainen Hankeketju (Ecosystem Chain Flow):
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              {ecosystemChain.map((item, idx) => {
                const isCurrent = item.project?.name.toLowerCase() === currentProjectName.toLowerCase();
                return (
                  <div key={idx} className="flex items-center gap-1.5">
                    <button
                      onClick={() => item.project && onSelectProject({
                        id: item.project.id,
                        name: item.project.name,
                        description: item.project.description,
                        isActive: true
                      })}
                      className={`px-2 py-1 rounded text-left transition-all cursor-pointer font-mono border ${
                        isCurrent
                          ? 'bg-amber-950 text-amber-200 border-amber-500/60 font-bold shadow-md ring-1 ring-amber-500/30'
                          : 'bg-[#1e130a] text-stone-300 border-[#3d2a1b] hover:border-amber-500/40'
                      }`}
                    >
                      <span className="text-amber-500/80 mr-1">{item.step}.</span>
                      <span>{item.project?.name || item.title}</span>
                      {item.project?.status === "Released" && <span className="text-emerald-400 ml-1">✓</span>}
                    </button>
                    {idx < ecosystemChain.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-stone-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Specific Dependencies (Supports / Depends On) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {/* Supports */}
            <div className="bg-[#18100a] p-2.5 rounded border border-emerald-900/30 space-y-1">
              <span className="text-emerald-400 font-semibold block text-[10px] uppercase tracking-wider flex items-center gap-1">
                <ArrowRight className="w-3 h-3 rotate-[-45deg]" /> Tukee Suoraan Hankkeita (Supports):
              </span>
              {dependenciesInfo.supports.length > 0 ? (
                <div className="flex flex-wrap gap-1 pt-1">
                  {dependenciesInfo.supports.map((sup, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectProject({ id: sup.id, name: sup.name, description: sup.description, isActive: true })}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/80 cursor-pointer flex items-center gap-1"
                    >
                      <span>{sup.name}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-stone-500 italic">Ei suoria riippuvaisia alaprojekteja.</span>
              )}
            </div>

            {/* Depends On */}
            <div className="bg-[#18100a] p-2.5 rounded border border-cyan-900/30 space-y-1">
              <span className="text-cyan-400 font-semibold block text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Link2 className="w-3 h-3" /> Riippuu Hankkeista (Depends On):
              </span>
              {dependenciesInfo.dependsOn.length > 0 ? (
                <div className="flex flex-wrap gap-1 pt-1">
                  {dependenciesInfo.dependsOn.map((dep, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectProject({ id: dep.id, name: dep.name, description: dep.description, isActive: true })}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/40 hover:bg-cyan-900/80 cursor-pointer flex items-center gap-1"
                    >
                      <span>{dep.name}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-stone-500 italic">Itsenäinen pohjahanke.</span>
              )}
            </div>
          </div>
        </div>

        {/* Smart Project Timeline */}
        <div className="bg-stone-950/50 p-3.5 rounded-lg border border-amber-500/30 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="text-[11px] text-amber-400 font-serif tracking-wider font-semibold uppercase flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
              ÄLYKÄS PROJEKTIAIKAJANA (SMART PROJECT TIMELINE)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              {identity?.currentPhase || brain.currentPhase || brain.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px] pt-1">
            {/* Completed */}
            <div className="bg-stone-900/60 p-2.5 rounded border border-emerald-500/30 space-y-1">
              <span className="text-emerald-400 font-semibold block text-[9px] uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Valmiit etapit
              </span>
              <span className="text-stone-300 font-serif text-[11px] block line-clamp-2">
                {brain.completedMilestones && brain.completedMilestones.length > 0 
                  ? brain.completedMilestones[0]
                  : "Perusversio suoritettu"}
              </span>
              <span className="text-[9px] text-stone-500 block">Yhteensä {brain.completedMilestones?.length || 0} etappia</span>
            </div>

            {/* Current */}
            <div className="bg-amber-950/30 p-2.5 rounded border border-amber-500/50 space-y-1">
              <span className="text-amber-400 font-semibold block text-[9px] uppercase tracking-wider flex items-center gap-1">
                ✦ Nykyinen etappi
              </span>
              <span className="text-amber-200 font-serif text-[11px] block">
                {identity?.nextMilestone || brain.currentMilestone || brain.nextMilestone}
              </span>
              <span className="text-[9px] text-amber-400/80 block">Status – {brain.estimatedWork || "15 h"}</span>
            </div>

            {/* Upcoming */}
            <div className="bg-stone-900/60 p-2.5 rounded border border-stone-800 space-y-1">
              <span className="text-stone-400 font-semibold block text-[9px] uppercase tracking-wider flex items-center gap-1">
                → Seuraava etappi
              </span>
              <span className="text-stone-300 font-serif text-[11px] block">
                {identity?.futurePlans?.[0] || brain.upcomingMilestone || "Aamukatsaus & Teeman hiominen"}
              </span>
              <span className="text-[9px] text-stone-500 block">Suunnitteluvaiheessa</span>
            </div>

            {/* Completion */}
            <div className="bg-stone-900/60 p-2.5 rounded border border-stone-800 space-y-1">
              <span className="text-stone-400 font-semibold block text-[9px] uppercase tracking-wider flex items-center gap-1">
                🏁 Arvioitu valmistuminen
              </span>
              <span className="text-stone-200 font-mono text-xs block">
                {identity?.status === "Released" ? "Julkaistu 23.7.2026" : brain.estimatedCompletion}
              </span>
              <span className="text-[9px] text-stone-500 block">Status: {identity?.status === "Released" ? "100% Valmis" : "Aikataulussa"}</span>
            </div>
          </div>
        </div>

        {/* Auroran Recommendations & Specific Focus Tags */}
        <div className="bg-stone-950/50 p-3.5 rounded-lg border border-[#3d2a1b] space-y-2.5 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
            <span className="text-[11px] text-amber-400 font-serif tracking-wider font-semibold uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              AURORAN SUOSITUKSET & PAINOPISTEET (RECOMMENDED FOCUS)
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded font-bold">
              {identity?.priority || brain.priority || "High"}
            </span>
          </div>

          {/* Focus Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-amber-400/80 uppercase font-bold mr-1">
              Avainpainopisteet:
            </span>
            {recData.focusTags.map((tag, idx) => (
              <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2a1b10] text-amber-300 border border-[#4d331e] font-semibold">
                {tag}
              </span>
            ))}
          </div>

          {/* Recommendation Action Bullets */}
          <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded text-amber-200 text-xs font-sans space-y-1.5">
            <span className="font-semibold text-amber-400 block text-[10px] uppercase font-mono mb-1">
              ✦ Auroran kumppanianalyysi ja toimenpidesuositukset:
            </span>
            {recData.recommendations.map((rec, idx) => (
              <p key={idx} className="text-stone-300 leading-relaxed flex items-start gap-1.5">
                <span className="text-amber-500 shrink-0">•</span>
                <span>{rec}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Visual Progress Bars Breakdown */}
        <div className="bg-stone-950/50 p-3.5 rounded-lg border border-stone-800/60 space-y-2.5">
          <div className="flex items-center justify-between border-b border-stone-800/60 pb-1.5">
            <span className="text-[11px] font-mono text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
              EDISTYMISRANGAT & EDISTYS ({brain.progress}%)
            </span>
            <span className="text-[10px] font-mono text-amber-400/80">
              {renderProgressBar(brain.progress)}
            </span>
          </div>

          {[
            { key: "visual", label: "Visuaalit & UI", icon: "🎨" },
            { key: "story", label: "Tarina & Lore", icon: "📖" },
            { key: "audio", label: "Äänimaisema & FMOD", icon: "🔊" },
            { key: "testing", label: "Testaus & Bugit", icon: "🧪" },
            { key: "code", label: "Koodi & Logiikka", icon: "💻" }
          ].map((item) => {
            const val = (brain.subProgress && brain.subProgress[item.key as keyof ProjectSubProgress]) || 50;
            return (
              <div key={item.key} className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400 flex items-center gap-1.5 min-w-[120px]">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400/90 tracking-widest text-[11px]">
                    {renderProgressBar(val)}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSubProgressChange(item.key as keyof ProjectSubProgress, -5)}
                      className="px-1.5 py-0.2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[10px] cursor-pointer"
                      title="Vähennä 5%"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleSubProgressChange(item.key as keyof ProjectSubProgress, 5)}
                      className="px-1.5 py-0.2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[10px] cursor-pointer"
                      title="Lisää 5%"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Tasks Checklist */}
        <div className="bg-stone-950/50 p-3.5 rounded-lg border border-stone-800/60">
          <span className="text-[11px] font-mono text-stone-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
            AKTIIVISET TEHTÄVÄT ({brain.activeTasks?.length || 0})
          </span>

          <div className="space-y-1.5 mb-3">
            {brain.activeTasks && brain.activeTasks.length > 0 ? (
              brain.activeTasks.map((task: string, idx: number) => (
                <div 
                  key={idx}
                  onClick={() => handleCompleteTask(idx)}
                  className="flex items-center gap-2 text-xs text-stone-300 hover:text-amber-300 bg-stone-900/40 p-2 rounded border border-stone-800/40 hover:border-amber-500/20 transition-all cursor-pointer group"
                >
                  <Square className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 shrink-0" />
                  <span>{task}</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-stone-500 italic">Kaikki tehtävät suoritettu!</span>
            )}
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              placeholder="Lisää uusi tehtävä..."
              className="flex-1 bg-stone-950 text-xs border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500/40"
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Completed Milestones */}
        <div className="bg-stone-950/50 p-3.5 rounded-lg border border-stone-800/60">
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SAAVUTETUT ETAPIT & VALMIIT ({brain.completedMilestones?.length || 0})
          </span>
          <div className="space-y-1 text-xs text-stone-400">
            {brain.completedMilestones && brain.completedMilestones.length > 0 ? (
              brain.completedMilestones.map((m: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 py-0.5">
                  <span className="text-emerald-500">✓</span>
                  <span>{m}</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-stone-500 italic">Ei vielä rekisteröityjä etappeja.</span>
            )}
          </div>
        </div>

        {/* Developer Notes */}
        <div className="bg-stone-950/50 p-3.5 rounded-lg border border-stone-800/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              MUISTIINPANOT & SYVEMPI VISIO
            </span>
            <button
              onClick={() => {
                if (editingNotes) handleSaveNotes();
                else {
                  setNotesInput(brain.notes || "");
                  setEditingNotes(true);
                }
              }}
              className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              {editingNotes ? "Tallenna" : "Muokkaa"}
            </button>
          </div>

          {editingNotes ? (
            <textarea
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="w-full h-20 bg-stone-950 text-xs border border-stone-800 rounded p-2 text-stone-200 focus:outline-none focus:border-amber-500/40 resize-none font-sans"
            />
          ) : (
            <p className="text-xs text-stone-300 leading-relaxed italic bg-stone-900/30 p-2.5 rounded border border-stone-800/30">
              "{brain.notes}"
            </p>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
