import { useState, useEffect, FormEvent } from "react";
import { Memory } from "../types";
import { BrainCircuit, Trash2, Plus, AlertCircle, Bookmark } from "lucide-react";

interface MemoryPanelProps {
  onMemoriesChange?: (memories: Memory[]) => void;
}

export default function MemoryPanel({ onMemoriesChange }: MemoryPanelProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [newMemory, setNewMemory] = useState("");

  const certMemories = [
    "Sertifikaatti: Project Planning: Putting It All Together (Google/Coursera, 28.6.2026) - Jani-Petteri Qvick",
    "Sertifikaatti: Project Execution: Running the Project (Google/Coursera, 30.6.2026) - Jani-Petteri Qvick",
    "Sertifikaatti: Agile Project Management (Google/Coursera, 30.6.2026) - Jani-Petteri Qvick",
    "Sertifikaatti: Introduction to Game Design (Epic Games/Coursera, 1.7.2026) - Jani-Petteri Qvick",
    "Sertifikaatti: Capstone: Applying Project Management (Google/Coursera, 1.7.2026) - Jani-Petteri Qvick",
    "Sertifikaatti: Accelerate Your Job Search with AI (Google/Coursera, 1.7.2026) - Jani-Petteri Qvick",
    "Sertifikaatti: Elements of AI - Kurssitodistus (Helsingin yliopisto, 10.7.2026) - Jani-Petteri Qvick",
    "Sertifikaatti: Perustason C# Microsoftin kanssa (freeCodeCamp & Microsoft, 13.7.2026) - Jani-Petteri Qvick"
  ];

  const milestoneMemories = [
    "Kehityspäiväkirja (16.7.2026): Palautettu Unity-mobiilipeli (M5), Space Shooter (M6) sekä Sound Design & FMOD (M9) arvioitavaksi.",
    "Kehityspäiväkirja (16.7.2026): Suoritettu Unreal Engine 1 & 2 arvosanoin 100%, 87.5%, 100%, 100% ja Breakout 3D palautettu.",
    "Kehityspäiväkirja (16.7.2026): Academic Essays -tietovisa läpäisty huikein pistein 337/340 (99,1%).",
    "Kehityspäiväkirja (16.7.2026): Generative AI (M19), Teams & Roles (M22), Narrative (M31), Design Principles (M39) ja Building a Game Brand (M25) hyväksytty!"
  ];

  const allPresetMemories = [...certMemories, ...milestoneMemories];

  useEffect(() => {
    // Load memories from localStorage or initialize with default values
    const stored = localStorage.getItem("aurora_memories_v1");
    if (stored) {
      try {
        let parsed: Memory[] = JSON.parse(stored);
        
        // Ensure new certificates and milestones are present in active memory to save them
        let updated = [...parsed];
        let hasChanges = false;
        
        allPresetMemories.forEach((text, idx) => {
          const alreadyExists = parsed.some(m => m.text.toLowerCase().includes(text.substring(0, 30).toLowerCase()));
          if (!alreadyExists) {
            updated.push({
              id: `preset-${idx}-${Date.now()}`,
              text: text,
              createdAt: new Date().toISOString()
            });
            hasChanges = true;
          }
        });

        if (hasChanges) {
          localStorage.setItem("aurora_memories_v1", JSON.stringify(updated));
          setMemories(updated);
          if (onMemoriesChange) onMemoriesChange(updated);
        } else {
          setMemories(parsed);
          if (onMemoriesChange) onMemoriesChange(parsed);
        }
      } catch (e) {
        initializeDefaultMemories();
      }
    } else {
      initializeDefaultMemories();
    }
  }, []);

  const initializeDefaultMemories = () => {
    const defaults: string[] = [
      "Aurora Qvick",
      "Qvick Games",
      "Aurora Home",
      "Murhamysteeri Mökillä",
      "Järven Vartijat",
      ...allPresetMemories
    ];
    const initialList: Memory[] = defaults.map((text, idx) => ({
      id: `def-${idx}-${Date.now()}`,
      text,
      createdAt: new Date(Date.now() - (defaults.length - idx) * 3600000).toISOString()
    }));
    setMemories(initialList);
    localStorage.setItem("aurora_memories_v1", JSON.stringify(initialList));
    if (onMemoriesChange) onMemoriesChange(initialList);
  };

  const handleAddMemory = (e: FormEvent) => {
    e.preventDefault();
    if (!newMemory.trim()) return;

    const added: Memory = {
      id: `mem-${Date.now()}`,
      text: newMemory.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [...memories, added];
    setMemories(updated);
    localStorage.setItem("aurora_memories_v1", JSON.stringify(updated));
    setNewMemory("");
    if (onMemoriesChange) onMemoriesChange(updated);
  };

  const handleDeleteMemory = (id: string) => {
    const updated = memories.filter(m => m.id !== id);
    setMemories(updated);
    localStorage.setItem("aurora_memories_v1", JSON.stringify(updated));
    if (onMemoriesChange) onMemoriesChange(updated);
  };

  const handleResetMemories = () => {
    if (window.confirm("Haluatko varmasti palauttaa alkuperäiset muistot?")) {
      initializeDefaultMemories();
    }
  };

  return (
    <div id="memory-panel-root" className="bg-stone-900/60 border border-stone-800/80 rounded-lg p-5 flex flex-col h-full backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="w-5 h-5 text-amber-500" />
          <h3 className="font-serif text-sm tracking-widest text-stone-200 uppercase font-medium">Auroran Muisti</h3>
        </div>
        <span className="text-[10px] font-mono text-stone-500 bg-stone-950 px-2 py-0.5 rounded border border-stone-800/50">
          {memories.length} Tallennettu
        </span>
      </div>

      {/* Memory Information Alert */}
      <p className="text-xs text-stone-400 font-light leading-relaxed mb-4">
        Nämä asiat on juurrutettu osaksi tietoisuuttani. Ne ohjaavat ajatuksiani ja antavat kontekstia luomisellemme.
      </p>

      {/* List of Memories */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[220px] md:max-h-none">
        {memories.length === 0 ? (
          <div className="text-center py-6 text-stone-600 flex flex-col items-center gap-1">
            <AlertCircle className="w-5 h-5 opacity-60" />
            <span className="text-xs">Ei muistoja tallennettuna.</span>
          </div>
        ) : (
          memories.map((memory) => (
            <div
              key={memory.id}
              className="group flex items-center justify-between bg-stone-950/45 hover:bg-stone-950/70 p-2.5 rounded border border-stone-900 hover:border-amber-500/10 transition-all duration-200"
            >
              <div className="flex items-start gap-2 max-w-[85%]">
                <Bookmark className="w-3.5 h-3.5 text-amber-500/50 mt-0.5 shrink-0" />
                <span className="text-xs text-stone-300 tracking-wide font-normal line-clamp-2 leading-snug">
                  {memory.text}
                </span>
              </div>
              <button
                onClick={() => handleDeleteMemory(memory.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-stone-500 transition-all duration-200 cursor-pointer"
                title="Unohda"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Form to Add New Memories */}
      <form onSubmit={handleAddMemory} className="mt-4 border-t border-stone-800/50 pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            placeholder="Opeta uusi asia..."
            className="flex-1 bg-stone-950/90 text-xs border border-stone-800/80 rounded px-3 py-2 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/40 transition-all"
            maxLength={100}
          />
          <button
            type="submit"
            className="p-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 text-amber-400 rounded transition-all cursor-pointer"
            title="Tallenna muistiin"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Restore Button */}
      <div className="mt-3 text-right">
        <button
          onClick={handleResetMemories}
          type="button"
          className="text-[9px] font-mono text-stone-600 hover:text-amber-500/60 transition-colors uppercase cursor-pointer"
        >
          Palauta oletukset
        </button>
      </div>
    </div>
  );
}
