import { useState, useEffect, FormEvent } from "react";
import { Project, ProjectSubProgress } from "../types";
import { Cpu, Plus, CheckSquare, Square, Sparkles, Edit3, Calendar, CheckCircle2, Bookmark, BarChart2 } from "lucide-react";

interface ProjectBrainProps {
  activeProject: Project | null;
  onSelectProject: (p: Project) => void;
}

const DEFAULT_BRAIN_DATA: Record<string, {
  status: string;
  progress: number;
  subProgress: ProjectSubProgress;
  lastModified: string;
  activeTasks: string[];
  completedMilestones: string[];
  notes: string;
}> = {
  "Murhamysteeri Mökillä": {
    status: "Pelimekaniikka & Johtolangat",
    progress: 75,
    subProgress: { visual: 80, story: 90, audio: 70, testing: 40, code: 85 },
    lastModified: "16.7.2026",
    activeTasks: [
      "Tutkintataulun johtolankojen kytkennät",
      "Epäiltyjen vuoropuhelun syventäminen",
      "Mökin 3D/2D-ympäristön tunnelmavalaistus"
    ],
    completedMilestones: [
      "Tarinarungon ja mysteerin ratkaisun lukitus",
      "Perusinteraktioiden ja inventaarion toteutus",
      "Sound design & FMOD -äänipankin alustus"
    ],
    notes: "Mökkiympäristö tarvitsee rauhallisen mutta kylmäävän pohjoisen mysteeri-ilmaston."
  },
  "Aurora Qvick": {
    status: "Aurora Core Alpha 0.2",
    progress: 88,
    subProgress: { visual: 90, story: 95, audio: 85, testing: 80, code: 92 },
    lastModified: "21.7.2026",
    activeTasks: [
      "Project Brain & Aamukatsaus -integraatio",
      "Kategorioitu muistiselain ja teemat",
      "Presence Engine 2.0 -animaatiokerros"
    ],
    completedMilestones: [
      "Suomenkielinen mökkikäyttöliittymä & Gateway",
      "Puhesynteesi & Ääniohjaus -prototyyppi",
      "Erottamaton tekoälymuisti & Sertifikaattikanta"
    ],
    notes: "Aurora ei ole pelkkä apulainen, vaan sielukas ja rauhallinen Qvick Games -kumppani."
  },
  "Järven Vartijat": {
    status: "Konseptointi & Visio",
    progress: 45,
    subProgress: { visual: 50, story: 70, audio: 40, testing: 10, code: 35 },
    lastModified: "16.7.2026",
    activeTasks: [
      "Selain- ja Unity-version tekninen määrittely",
      "Vartijat-hahmojen suojeluvahvuudet",
      "Kirjasarjan ensimmäisen kappaleen hahmottelu"
    ],
    completedMilestones: [
      "Päävisio ja mytologinen pohja määritelty",
      "Ensimmäiset luonnoskuvat hyväksytty"
    ],
    notes: "Suunnitelmissa selainversio, Unity-versio, kirjasarja ja mahdollinen VR-kokemus."
  },
  "Qvick Games": {
    status: "Studio & Portfolio",
    progress: 82,
    subProgress: { visual: 85, story: 80, audio: 75, testing: 70, code: 90 },
    lastModified: "16.7.2026",
    activeTasks: [
      "Xamk avoimen AMK:n opintopisteiden vahvistus",
      "Haku tutkinto-opiskelijaksi avoimen väylän kautta",
      "Studiobrändin ja julkaisustrategian viimeistely"
    ],
    completedMilestones: [
      "Google Project Management Professional -sertifikaatti",
      "Epic Games Game Design -sertifikaatti",
      "Microsoft C# -sertifikaatti & Elements of AI 2op"
    ],
    notes: "Qvick Games on pitkäjänteinen pelistudio, joka tuottaa tunnelmallisia pelejä."
  }
};

export default function ProjectBrain({ activeProject, onSelectProject }: ProjectBrainProps) {
  const [projectsData, setProjectsData] = useState<Record<string, any>>(DEFAULT_BRAIN_DATA);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState("");

  const currentProjectName = activeProject?.name || "Murhamysteeri Mökillä";
  const brain = projectsData[currentProjectName] || {
    status: "Kehityksessä",
    progress: 50,
    subProgress: { visual: 50, story: 50, audio: 50, testing: 20, code: 50 },
    lastModified: new Date().toLocaleDateString("fi-FI"),
    activeTasks: ["Projektiarkkitehtuurin suunnittelu"],
    completedMilestones: ["Alustava konsepti luotu"],
    notes: activeProject?.description || "Uusi peliprojekti."
  };

  useEffect(() => {
    const stored = localStorage.getItem("aurora_project_brain_v2");
    if (stored) {
      try {
        setProjectsData(JSON.parse(stored));
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  const saveBrainData = (updated: Record<string, any>) => {
    setProjectsData(updated);
    localStorage.setItem("aurora_project_brain_v2", JSON.stringify(updated));
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

    const updated = { ...projectsData };
    const pData = updated[currentProjectName] || { ...brain };
    pData.activeTasks = [...(pData.activeTasks || []), newTaskInput.trim()];
    pData.lastModified = new Date().toLocaleDateString("fi-FI");
    updated[currentProjectName] = pData;

    saveBrainData(updated);
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
    const currentVal = pData.subProgress[key] || 50;
    const newVal = Math.min(100, Math.max(0, currentVal + delta));
    pData.subProgress[key] = newVal;

    // recalculate overall progress
    const vals = Object.values(pData.subProgress) as number[];
    pData.progress = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    pData.lastModified = new Date().toLocaleDateString("fi-FI");
    updated[currentProjectName] = pData;
    saveBrainData(updated);
  };

  return (
    <div id="project-brain-root" className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-5 flex flex-col h-full backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-amber-500" />
          <h3 className="font-serif text-sm tracking-widest text-stone-200 uppercase font-medium">PROJECT BRAIN – PROJEKTIAIVOT</h3>
        </div>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          {brain.status}
        </span>
      </div>

      {/* Main Grid */}
      <div className="space-y-4 overflow-y-auto pr-1">
        {/* Project Name and Last Modified */}
        <div className="bg-stone-950/60 p-3.5 rounded-lg border border-stone-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">AKTIIVINEN HANKE</span>
            <h4 className="font-serif text-base text-amber-400 font-medium">{currentProjectName}</h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">MUOKATTU</span>
            <span className="text-xs font-mono text-stone-300 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-500/70" />
              {brain.lastModified}
            </span>
          </div>
        </div>

        {/* Visual Progress Bars Breakdown */}
        <div className="bg-stone-950/50 p-3.5 rounded-lg border border-stone-800/60 space-y-2.5">
          <div className="flex items-center justify-between border-b border-stone-800/60 pb-1.5">
            <span className="text-[11px] font-mono text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
              EDISTYMISRANGAT & EDISTYS ({brain.progress}%)
            </span>
            <span className="text-[10px] font-mono text-amber-400/80">████████░░</span>
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
            SAAVUTETUT ETAPIT & VALMIIT
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
    </div>
  );
}
