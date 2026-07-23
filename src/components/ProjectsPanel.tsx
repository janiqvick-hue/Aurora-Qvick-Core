import { useState, useEffect, FormEvent, MouseEvent as ReactMouseEvent } from "react";
import { Project } from "../types";
import { FolderGit2, Plus, Sparkles, FolderLock, Trash2 } from "lucide-react";

interface ProjectsPanelProps {
  onSelectProject: (project: Project) => void;
}

export default function ProjectsPanel({ onSelectProject }: ProjectsPanelProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("aurora_projects_v1");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProjects(parsed);
        // Find if there is an active one
        const active = parsed.find((p: Project) => p.isActive);
        if (active) {
          onSelectProject(active);
        } else if (parsed.length > 0) {
          onSelectProject(parsed[0]);
        }
      } catch (e) {
        initializeDefaultProjects();
      }
    } else {
      initializeDefaultProjects();
    }
  }, []);

  const initializeDefaultProjects = () => {
    const defaults = [
      { name: "Aurora Qvick", desc: "Luova tekoäly-kumppani ja peli-ideointisielu Qvick Gamesille." },
      { name: "Aurora Home", desc: "Tekoälyohjattu rauhallisen kodin tai työtilan hallintajärjestelmä." },
      { name: "Murhamysteeri Mökillä", desc: "Rauhalliseen suomalaiseen mökkiympäristöön sijoittuva salapoliisipeli." },
      { name: "Järven Vartijat", desc: "Myyttinen suojelija- ja strategiapeli pohjoisen järven salaisuuksista." },
      { name: "VR Murder Mystery", desc: "Virtuaalitodellisuudessa pelattava kylmäävä mökkimurhamysteeri." }
    ];

    const initialList: Project[] = defaults.map((p, idx) => ({
      id: `proj-${idx}-${Date.now()}`,
      name: p.name,
      description: p.desc,
      isActive: idx === 0 // Default first to active
    }));

    setProjects(initialList);
    localStorage.setItem("aurora_projects_v1", JSON.stringify(initialList));
    onSelectProject(initialList[0]);
  };

  const handleSelect = (id: string) => {
    const updated = projects.map((p) => {
      const activeState = p.id === id;
      if (activeState) {
        onSelectProject(p);
      }
      return {
        ...p,
        isActive: activeState
      };
    });
    setProjects(updated);
    localStorage.setItem("aurora_projects_v1", JSON.stringify(updated));
  };

  const handleAddProject = (e: FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const added: Project = {
      id: `proj-${Date.now()}`,
      name: newProjectName.trim(),
      description: newProjectDesc.trim() || "Luova peliprojekti",
      isActive: projects.length === 0 // Make active if it's the only one
    };

    const updated = [...projects, added];
    setProjects(updated);
    localStorage.setItem("aurora_projects_v1", JSON.stringify(updated));
    setNewProjectName("");
    setNewProjectDesc("");
    setShowAddForm(false);

    if (added.isActive) {
      onSelectProject(added);
    }
  };

  const handleDeleteProject = (id: string, e: ReactMouseEvent) => {
    e.stopPropagation(); // Avoid selecting the deleted project
    if (projects.length <= 1) {
      alert("Projekteja on oltava vähintään yksi.");
      return;
    }

    const targetProject = projects.find(p => p.id === id);
    const updated = projects.filter(p => p.id !== id);

    // If we deleted the active project, activate the first remaining
    if (targetProject?.isActive) {
      updated[0].isActive = true;
      onSelectProject(updated[0]);
    }

    setProjects(updated);
    localStorage.setItem("aurora_projects_v1", JSON.stringify(updated));
  };

  return (
    <div id="projects-panel-root" className="bg-stone-900/60 border border-stone-800/80 rounded-lg p-5 flex flex-col h-full backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <FolderGit2 className="w-5 h-5 text-amber-500" />
          <h3 className="font-serif text-sm tracking-widest text-stone-200 uppercase font-medium">Projektit</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1 hover:text-amber-400 text-stone-400 transition-colors cursor-pointer"
          title="Uusi projekti"
        >
          <Plus className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Projects List or Add Form */}
      {showAddForm ? (
        <form onSubmit={handleAddProject} className="space-y-3 bg-stone-950/40 p-3.5 rounded border border-stone-800/60 animate-fadeIn">
          <h4 className="text-xs font-serif text-amber-400 uppercase tracking-widest">Uusi peliprojekti</h4>
          <div>
            <label className="block text-[10px] font-mono text-stone-500 mb-1">PROJEKTIN NIMI</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="esm. Jään Äärellä..."
              required
              className="w-full bg-stone-950 text-xs border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500/40"
              maxLength={40}
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-stone-500 mb-1">KUVAUS / VISIO</label>
            <textarea
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              placeholder="Kuvaile pelimekaniikkaa tai tunnelmaa..."
              className="w-full h-16 bg-stone-950 text-xs border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500/40 resize-none"
              maxLength={150}
            />
          </div>
          <div className="flex gap-2 justify-end text-xs">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 bg-stone-900 hover:bg-stone-850 text-stone-400 rounded transition-colors cursor-pointer"
            >
              Peruuta
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded transition-colors cursor-pointer"
            >
              Luo hanke
            </button>
          </div>
        </form>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[220px] md:max-h-none">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleSelect(project.id)}
              className={`group relative p-3 rounded-md border text-left cursor-pointer transition-all duration-300 ${
                project.isActive
                  ? "bg-stone-950 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.03)]"
                  : "bg-stone-950/30 hover:bg-stone-950/60 border-stone-900 hover:border-amber-500/10"
              }`}
            >
              {/* Highlight bar for active project */}
              {project.isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-amber-500 rounded-r" />
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FolderLock className={`w-3.5 h-3.5 shrink-0 ${project.isActive ? "text-amber-400" : "text-stone-500"}`} />
                  <h4 className={`text-xs tracking-wide font-medium ${project.isActive ? "text-amber-400" : "text-stone-300"}`}>
                    {project.name}
                  </h4>
                </div>

                <button
                  onClick={(e) => handleDeleteProject(project.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-stone-600 hover:text-red-400 transition-opacity cursor-pointer"
                  title="Poista"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <p className="text-[11px] text-stone-400 font-light mt-1.5 leading-relaxed line-clamp-2">
                {project.description}
              </p>

              {project.isActive && (
                <div className="mt-2.5 flex items-center gap-1 text-[9px] font-mono text-amber-500/70">
                  <Sparkles className="w-3 h-3" />
                  <span>Aurora työstää tätä parhaillaan kanssasi</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-3 text-left border-t border-stone-800/40 pt-2 flex items-center justify-between text-[10px] text-stone-500 font-mono">
        <span>© Qvick Games</span>
        <span>Aktiivinen hanke ohjaa keskustelua</span>
      </div>
    </div>
  );
}
