import { useState, useEffect, FormEvent } from "react";
import { Memory, MemoryCategory } from "../types";
import { BrainCircuit, Trash2, Plus, AlertCircle, Bookmark } from "lucide-react";
import { auroraMemoryEngine } from "../core/AuroraMemoryEngine";

interface MemoryPanelProps {
  onMemoriesChange?: (memories: Memory[]) => void;
}

export default function MemoryPanel({ onMemoriesChange }: MemoryPanelProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [newMemory, setNewMemory] = useState("");
  const [category, setCategory] = useState<MemoryCategory>("Personal");

  useEffect(() => {
    const list = auroraMemoryEngine.getMemories();
    setMemories(list);
  }, []);

  const handleAddMemory = (e: FormEvent) => {
    e.preventDefault();
    if (!newMemory.trim()) return;

    const updated = auroraMemoryEngine.saveMemory(newMemory, category);
    setMemories(updated);
    setNewMemory("");
    if (onMemoriesChange) onMemoriesChange(updated);
  };

  const handleDeleteMemory = (id: string) => {
    const updated = auroraMemoryEngine.deleteMemory(id);
    setMemories(updated);
    if (onMemoriesChange) onMemoriesChange(updated);
  };

  const handleResetMemories = () => {
    if (window.confirm("Haluatko palauttaa Auroran oletusmuistot?")) {
      const reset = auroraMemoryEngine.resetToDefaults();
      setMemories(reset);
      if (onMemoriesChange) onMemoriesChange(reset);
    }
  };

  return (
    <div id="memory-panel-root" className="bg-[#0b0603]/85 border border-[#3d2b1d]/80 rounded-xl p-5 flex flex-col h-full backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-[#f2e6d0]">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="w-5 h-5 text-amber-500" />
          <h3 className="font-serif text-sm tracking-widest text-[#e8dfd1] uppercase font-medium">Auroran Muisti</h3>
        </div>
        <span className="text-[10px] font-mono text-stone-400 bg-[#1e1107] px-2 py-0.5 rounded border border-[#3d2b1d]">
          {memories.length} Tallennettu
        </span>
      </div>

      {/* Memory Information Alert */}
      <p className="text-xs text-stone-400 font-serif leading-relaxed mb-3">
        Tallennetut asiat (sertifikaatit, opintopisteet, projektit ja tavoitteet) ohjaavat vastauksiani ja ajatuksiani mökillä.
      </p>

      {/* List of Memories */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[220px] md:max-h-none">
        {memories.length === 0 ? (
          <div className="text-center py-6 text-stone-600 flex flex-col items-center gap-1">
            <AlertCircle className="w-5 h-5 opacity-60" />
            <span className="text-xs italic">Ei muistoja tallennettuna.</span>
          </div>
        ) : (
          memories.map((memory) => (
            <div
              key={memory.id}
              className="group flex items-start justify-between bg-[#140b05]/60 hover:bg-[#1e1107] p-2.5 rounded border border-[#3d2b1d]/60 hover:border-amber-500/20 transition-all duration-200"
            >
              <div className="flex items-start gap-2 max-w-[85%]">
                <Bookmark className="w-3.5 h-3.5 text-amber-500/70 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  {memory.category && (
                    <span className="text-[8px] font-mono uppercase px-1 py-0.2 rounded bg-[#0b0603] text-amber-400 border border-[#3d2b1d] inline-block mr-1">
                      {memory.category}
                    </span>
                  )}
                  <span className="text-xs text-[#e8dfd1] font-serif leading-snug">
                    {memory.text}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteMemory(memory.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-stone-500 transition-all cursor-pointer"
                title="Unohda"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Form to Add New Memories */}
      <form onSubmit={handleAddMemory} className="mt-3 border-t border-[#3d2b1d]/60 pt-3 space-y-2">
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MemoryCategory)}
            className="bg-[#140b05] text-[10px] font-mono border border-[#3d2b1d] rounded px-2 py-1 text-amber-400 focus:outline-none"
          >
            <option value="Projects">Projects</option>
            <option value="Studies">Studies</option>
            <option value="Ideas">Ideas</option>
            <option value="Personal">Personal</option>
            <option value="Aurora">Aurora</option>
            <option value="Qvick Games">Qvick Games</option>
          </select>
          <input
            type="text"
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            placeholder="Opeta uusi asia tai saavutus..."
            className="flex-1 bg-[#140b05] text-xs border border-[#3d2b1d] rounded px-3 py-1.5 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/40 font-serif"
            maxLength={140}
          />
          <button
            type="submit"
            className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded transition-all cursor-pointer"
            title="Tallenna muistiin"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Restore Button */}
      <div className="mt-2 text-right">
        <button
          onClick={handleResetMemories}
          type="button"
          className="text-[9px] font-mono text-stone-500 hover:text-amber-400 transition-colors uppercase cursor-pointer"
        >
          Palauta oletukset
        </button>
      </div>
    </div>
  );
}

