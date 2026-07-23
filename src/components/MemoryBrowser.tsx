import { useState, useEffect, FormEvent } from "react";
import { Memory, MemoryCategory } from "../types";
import { BrainCircuit, Search, Folder, Award, GraduationCap, Gamepad2, Sparkles, Star, Plus, Trash2 } from "lucide-react";

interface MemoryBrowserProps {
  onMemoriesChange?: (memories: Memory[]) => void;
}

const CATEGORIES: { key: MemoryCategory | 'All'; label: string; icon: any }[] = [
  { key: 'All', label: 'Kaikki', icon: BrainCircuit },
  { key: 'Certificates', label: 'Sertifikaatit', icon: Award },
  { key: 'Personal Milestones', label: 'Saavutukset', icon: Star },
  { key: 'Projects', label: 'Projektit', icon: Folder },
  { key: 'Education', label: 'Koulutus', icon: GraduationCap },
  { key: 'Qvick Games', label: 'Qvick Games', icon: Gamepad2 },
  { key: 'Aurora', label: 'Aurora', icon: Sparkles }
];

export default function MemoryBrowser({ onMemoriesChange }: MemoryBrowserProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [newMemoryText, setNewMemoryText] = useState("");
  const [newMemoryCategory, setNewMemoryCategory] = useState<MemoryCategory>('Projects');

  useEffect(() => {
    const stored = localStorage.getItem("aurora_memories_v1");
    if (stored) {
      try {
        const parsed: Memory[] = JSON.parse(stored);
        setMemories(parsed);
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  const categorizeMemory = (m: Memory): MemoryCategory => {
    if (m.category) return m.category;
    const lower = m.text.toLowerCase();
    if (lower.includes("sertifikaatti") || lower.includes("coursera") || lower.includes("certificate") || lower.includes("microsoft") || lower.includes("c#")) {
      return "Certificates";
    }
    if (lower.includes("kehityspäiväkirja") || lower.includes("saavutettu") || lower.includes("opintopiste") || lower.includes("xamk")) {
      return "Personal Milestones";
    }
    if (lower.includes("projekti") || lower.includes("mökki") || lower.includes("vartijat") || lower.includes("mysteeri")) {
      return "Projects";
    }
    if (lower.includes("tutkinto") || lower.includes("opiskelu") || lower.includes("amk") || lower.includes("koulutus")) {
      return "Education";
    }
    if (lower.includes("qvick games") || lower.includes("studio") || lower.includes("pelistudio")) {
      return "Qvick Games";
    }
    return "Aurora";
  };

  const handleAddMemory = (e: FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;

    const newMem: Memory = {
      id: `mem-${Date.now()}`,
      text: newMemoryText.trim(),
      createdAt: new Date().toISOString(),
      category: newMemoryCategory
    };

    const updated = [newMem, ...memories];
    setMemories(updated);
    localStorage.setItem("aurora_memories_v1", JSON.stringify(updated));
    setNewMemoryText("");
    if (onMemoriesChange) onMemoriesChange(updated);
  };

  const handleDeleteMemory = (id: string) => {
    const updated = memories.filter(m => m.id !== id);
    setMemories(updated);
    localStorage.setItem("aurora_memories_v1", JSON.stringify(updated));
    if (onMemoriesChange) onMemoriesChange(updated);
  };

  const filteredMemories = memories.filter(m => {
    const cat = categorizeMemory(m);
    const matchesCategory = selectedCategory === 'All' || cat === selectedCategory;
    const matchesSearch = !searchQuery.trim() || m.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="memory-browser-root" className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-5 flex flex-col h-full backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="w-5 h-5 text-amber-500" />
          <h3 className="font-serif text-sm tracking-widest text-stone-200 uppercase font-medium">MUISTISELAIN – CATEGORIZED MEMORY</h3>
        </div>
        <span className="text-[10px] font-mono text-stone-500 bg-stone-950 px-2 py-0.5 rounded border border-stone-800/50">
          {filteredMemories.length} / {memories.length} Muistoa
        </span>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Etsi muistoista tai sertifikaateista..."
          className="w-full bg-stone-950/80 text-xs border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/40"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-amber-500/15 border border-amber-500/40 text-amber-300"
                  : "bg-stone-950/40 hover:bg-stone-950/80 border border-stone-800/60 text-stone-400 hover:text-stone-200"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Memory List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[250px] md:max-h-none">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-8 text-stone-600 text-xs italic">
            Ei muistoja valitussa kategoriassa tai hakutermillä.
          </div>
        ) : (
          filteredMemories.map((m) => {
            const cat = categorizeMemory(m);
            return (
              <div
                key={m.id}
                className="group flex items-start justify-between bg-stone-950/50 hover:bg-stone-950/80 p-3 rounded-lg border border-stone-800/60 hover:border-amber-500/20 transition-all duration-200"
              >
                <div className="space-y-1 max-w-[90%]">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-stone-900 border border-stone-800 text-amber-400/90 uppercase tracking-wider">
                      {cat}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      {new Date(m.createdAt).toLocaleDateString("fi-FI")}
                    </span>
                  </div>
                  <p className="text-xs text-stone-200 font-sans leading-relaxed">
                    {m.text}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteMemory(m.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-stone-600 transition-opacity cursor-pointer"
                  title="Poista"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Memory Form */}
      <form onSubmit={handleAddMemory} className="mt-3 pt-3 border-t border-stone-800/80 flex gap-2">
        <select
          value={newMemoryCategory}
          onChange={(e) => setNewMemoryCategory(e.target.value as MemoryCategory)}
          className="bg-stone-950 text-[10px] font-mono border border-stone-800 rounded px-2 py-1 text-amber-400/90 focus:outline-none"
        >
          <option value="Projects">Projektit</option>
          <option value="Education">Koulutus</option>
          <option value="Certificates">Sertifikaatit</option>
          <option value="Qvick Games">Qvick Games</option>
          <option value="Aurora">Aurora</option>
          <option value="Personal Milestones">Saavutukset</option>
        </select>

        <input
          type="text"
          value={newMemoryText}
          onChange={(e) => setNewMemoryText(e.target.value)}
          placeholder="Lisää uusi muisto tai ratkaisu..."
          className="flex-1 bg-stone-950 text-xs border border-stone-800 rounded px-2.5 py-1 text-stone-200 focus:outline-none focus:border-amber-500/40"
        />

        <button
          type="submit"
          className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded text-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
