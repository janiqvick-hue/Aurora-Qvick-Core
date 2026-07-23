import { useState, useEffect, FormEvent } from "react";
import { Memory, MemoryCategory } from "../types";
import { 
  BrainCircuit, 
  Search, 
  Folder, 
  GraduationCap, 
  Gamepad2, 
  Sparkles, 
  User, 
  Lightbulb, 
  Plus, 
  Trash2,
  Calendar,
  Clock
} from "lucide-react";
import { auroraMemoryEngine } from "../core/AuroraMemoryEngine";

interface MemoryBrowserProps {
  onMemoriesChange?: (memories: Memory[]) => void;
}

const CATEGORIES: { key: MemoryCategory | 'All'; label: string; icon: any }[] = [
  { key: 'All', label: 'Kaikki', icon: BrainCircuit },
  { key: 'Projects', label: 'Projects', icon: Folder },
  { key: 'Studies', label: 'Studies', icon: GraduationCap },
  { key: 'Ideas', label: 'Ideas', icon: Lightbulb },
  { key: 'Personal', label: 'Personal', icon: User },
  { key: 'Aurora', label: 'Aurora', icon: Sparkles },
  { key: 'Qvick Games', label: 'Qvick Games', icon: Gamepad2 }
];

type TimelineFilter = 'All' | 'Today' | 'ThisWeek' | 'ThisMonth' | 'Older';

export default function MemoryBrowser({ onMemoriesChange }: MemoryBrowserProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | 'All'>('All');
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [newMemoryText, setNewMemoryText] = useState("");
  const [newMemoryCategory, setNewMemoryCategory] = useState<MemoryCategory>('Projects');

  useEffect(() => {
    const loadMemories = () => {
      const list = auroraMemoryEngine.getMemories();
      setMemories(list);
    };
    loadMemories();

    window.addEventListener('aurora_memories_updated', loadMemories);
    return () => window.removeEventListener('aurora_memories_updated', loadMemories);
  }, []);

  const handleAddMemory = (e: FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;

    const updated = auroraMemoryEngine.saveMemory(newMemoryText, newMemoryCategory);
    setMemories(updated);
    setNewMemoryText("");
    if (onMemoriesChange) onMemoriesChange(updated);
  };

  const handleDeleteMemory = (id: string) => {
    const updated = auroraMemoryEngine.deleteMemory(id);
    setMemories(updated);
    if (onMemoriesChange) onMemoriesChange(updated);
  };

  // Timeline & Search Filter Logic
  const timelineGroup = auroraMemoryEngine.getGroupedByTimeline(memories);

  const filterByTimeline = (list: Memory[]) => {
    if (timelineFilter === 'Today') return timelineGroup.today;
    if (timelineFilter === 'ThisWeek') return timelineGroup.thisWeek;
    if (timelineFilter === 'ThisMonth') return timelineGroup.thisMonth;
    if (timelineFilter === 'Older') return timelineGroup.older;
    return list;
  };

  const filteredMemories = filterByTimeline(memories).filter(m => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || m.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="memory-browser-root" className="bg-[#0b0603]/85 border border-[#3d2b1d]/80 rounded-xl p-5 flex flex-col h-full backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-[#f2e6d0]">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="w-5 h-5 text-amber-500" />
          <h3 className="font-serif text-sm tracking-widest text-[#e8dfd1] uppercase font-medium">AURORAN MUISTISELAIN – PERSISTENT MEMORY</h3>
        </div>
        <span className="text-[10px] font-mono text-stone-400 bg-[#1e1107] px-2 py-0.5 rounded border border-[#3d2b1d]">
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
          placeholder="Etsi muistoista, sertifikaateista tai hankkeista..."
          className="w-full bg-[#140b05] text-xs border border-[#3d2b1d] rounded-lg pl-8 pr-3 py-1.5 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 font-serif"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold"
                  : "bg-[#140b05]/60 hover:bg-[#1e1107] border border-[#3d2b1d]/60 text-stone-400 hover:text-stone-200"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Memory Timeline Tabs */}
      <div className="flex items-center gap-1 bg-[#140b05]/80 p-1 rounded-lg border border-[#3d2b1d]/60 mb-3 text-[10px] font-mono">
        <div className="flex items-center gap-1 text-amber-400 px-2 font-semibold">
          <Calendar className="w-3 h-3" />
          <span>AIKAJANA:</span>
        </div>
        {[
          { key: 'All', label: 'Kaikki' },
          { key: 'Today', label: `Tänään (${timelineGroup.today.length})` },
          { key: 'ThisWeek', label: `Tällä viikolla (${timelineGroup.thisWeek.length})` },
          { key: 'ThisMonth', label: `Tässä kuussa (${timelineGroup.thisMonth.length})` },
          { key: 'Older', label: `Aiemmat (${timelineGroup.older.length})` }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTimelineFilter(t.key as TimelineFilter)}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              timelineFilter === t.key
                ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Memory List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[260px] md:max-h-none">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-8 text-stone-500 text-xs italic font-serif">
            Ei muistoja valitulla kriteerillä tai hakutermillä.
          </div>
        ) : (
          filteredMemories.map((m) => {
            return (
              <div
                key={m.id}
                className="group flex items-start justify-between bg-[#140b05]/70 hover:bg-[#1e1107] p-3 rounded-lg border border-[#3d2b1d]/60 hover:border-amber-500/30 transition-all duration-200"
              >
                <div className="space-y-1.5 max-w-[92%]">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#0b0603] border border-[#3d2b1d] text-amber-400 uppercase tracking-wider font-semibold">
                      {m.category || 'Personal'}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(m.createdAt).toLocaleDateString("fi-FI")} {new Date(m.createdAt).toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs text-[#e8dfd1] font-serif leading-relaxed">
                    {m.text}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteMemory(m.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-stone-600 transition-opacity cursor-pointer"
                  title="Poista muisto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Memory Form */}
      <form onSubmit={handleAddMemory} className="mt-3 pt-3 border-t border-[#3d2b1d]/80 flex gap-2">
        <select
          value={newMemoryCategory}
          onChange={(e) => setNewMemoryCategory(e.target.value as MemoryCategory)}
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
          value={newMemoryText}
          onChange={(e) => setNewMemoryText(e.target.value)}
          placeholder="Tallenna uusi muisto, peli-idea tai merkkipaalu..."
          className="flex-1 bg-[#140b05] text-xs border border-[#3d2b1d] rounded px-2.5 py-1 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/40 font-serif"
        />

        <button
          type="submit"
          className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded text-xs transition-colors cursor-pointer"
          title="Tallenna muistiin"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

