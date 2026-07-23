import { useState, useEffect, FormEvent, useMemo, useRef } from "react";
import { Memory, MemoryCategory } from "../types";
import { 
  BrainCircuit, 
  Search, 
  X, 
  Pin, 
  PinOff, 
  Archive, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  Plus, 
  Folder, 
  GraduationCap, 
  Gamepad2, 
  Sparkles, 
  User, 
  Lightbulb, 
  Calendar, 
  Clock, 
  Tag, 
  Check, 
  CloudCheck, 
  CloudUpload, 
  CloudOff,
  Bookmark,
  Layers,
  Inbox,
  AlertTriangle,
  FolderGit2
} from "lucide-react";
import { auroraMemoryEngine } from "../core/AuroraMemoryEngine";
import { projectIdentityEngine } from "../core/ProjectIdentityEngine";

interface MemoryBrowserProps {
  onMemoriesChange?: (memories: Memory[]) => void;
}

export type NavFilter = 
  | 'all' 
  | 'pinned' 
  | 'today' 
  | 'this_week' 
  | 'projects' 
  | 'ideas' 
  | 'archive' 
  | 'trash';

const NAV_FILTERS: { key: NavFilter; label: string; icon: any }[] = [
  { key: 'all', label: 'Kaikki', icon: BrainCircuit },
  { key: 'pinned', label: 'Kiinnitetyt', icon: Pin },
  { key: 'today', label: 'Tänään', icon: Clock },
  { key: 'this_week', label: 'Tällä viikolla', icon: Calendar },
  { key: 'projects', label: 'Projektit', icon: Folder },
  { key: 'ideas', label: 'Ideat', icon: Lightbulb },
  { key: 'archive', label: 'Arkisto', icon: Archive },
  { key: 'trash', label: 'Roskakori', icon: Trash2 },
];

const CATEGORIES: { key: MemoryCategory; label: string; icon: any }[] = [
  { key: 'Projects', label: 'Projects', icon: Folder },
  { key: 'Studies', label: 'Studies', icon: GraduationCap },
  { key: 'Ideas', label: 'Ideas', icon: Lightbulb },
  { key: 'Personal', label: 'Personal', icon: User },
  { key: 'Aurora', label: 'Aurora', icon: Sparkles },
  { key: 'Qvick Games', label: 'Qvick Games', icon: Gamepad2 },
  { key: 'Certificates', label: 'Certificates', icon: Bookmark },
  { key: 'Education', label: 'Education', icon: GraduationCap },
  { key: 'Personal Milestones', label: 'Milestones', icon: Layers },
];

function isToday(dateString?: string): boolean {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
         d.getMonth() === now.getMonth() &&
         d.getDate() === now.getDate();
}

function isThisWeek(dateString?: string): boolean {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
  return diffDays >= 0 && diffDays <= 7;
}

function parseAndNormalizeTags(rawTagsInput: string | string[]): string[] {
  const items = Array.isArray(rawTagsInput) 
    ? rawTagsInput 
    : rawTagsInput.split(/[,#\s]+/).filter(Boolean);

  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    const clean = item.trim().replace(/^#+/, '');
    if (!clean) continue;
    const lower = clean.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      result.push(clean);
    }
  }

  return result;
}

function getSyncStatusBadge(status?: string): { label: string; colorClass: string; icon: any } {
  switch (status) {
    case 'synced':
      return { label: 'Synkronoitu', colorClass: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50', icon: CloudCheck };
    case 'pending_sync':
      return { label: 'Odottaa synkronointia', colorClass: 'text-amber-400 bg-amber-950/40 border-amber-800/50', icon: CloudUpload };
    case 'sync_error':
      return { label: 'Synkronointi epäonnistui', colorClass: 'text-rose-400 bg-rose-950/40 border-rose-800/50', icon: CloudOff };
    case 'conflict':
      return { label: 'Ristiriita havaittu', colorClass: 'text-purple-400 bg-purple-950/40 border-purple-800/50', icon: CloudOff };
    case 'local_only':
    default:
      return { label: 'Tallennettu laitteelle', colorClass: 'text-stone-400 bg-stone-900/60 border-stone-800/50', icon: Check };
  }
}

export default function MemoryBrowser({ onMemoriesChange }: MemoryBrowserProps) {
  const [allRawMemories, setAllRawMemories] = useState<Memory[]>([]);
  const [navFilter, setNavFilter] = useState<NavFilter>('all');
  const [searchQuery, setSearchQuery] = useState("");

  // System projects list
  const availableProjects = useMemo(() => {
    try {
      return projectIdentityEngine.getProjects();
    } catch {
      return [];
    }
  }, []);

  // Editor Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  
  // Editor form fields
  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [formCategory, setFormCategory] = useState<MemoryCategory>('Projects');
  const [formProjectId, setFormProjectId] = useState<string>("");
  const [formTagsInput, setFormTagsInput] = useState("");
  const [formIsPinned, setFormIsPinned] = useState(false);
  
  // Dirty tracking & confirmation dialogs
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [deletingMemoryId, setDeletingMemoryId] = useState<string | null>(null);

  // Focus trap ref
  const titleInputRef = useRef<HTMLInputElement>(null);

  const reloadMemories = () => {
    const list = auroraMemoryEngine.getAllRawMemories();
    setAllRawMemories(list);
    if (onMemoriesChange) {
      onMemoriesChange(auroraMemoryEngine.getMemories());
    }
  };

  useEffect(() => {
    reloadMemories();
    window.addEventListener('aurora_memories_updated', reloadMemories);
    return () => window.removeEventListener('aurora_memories_updated', reloadMemories);
  }, []);

  // Check if current form is dirty compared to initial state
  const isFormDirty = useMemo(() => {
    if (!isEditorOpen) return false;
    if (editingMemory) {
      const origTitle = editingMemory.title || "";
      const origText = editingMemory.text || "";
      const origCategory = editingMemory.category || "Personal";
      const origProjectId = editingMemory.projectId || "";
      const origTags = editingMemory.tags ? editingMemory.tags.join(", ") : "";
      const origPinned = !!editingMemory.isPinned;

      return (
        formTitle !== origTitle ||
        formText !== origText ||
        formCategory !== origCategory ||
        formProjectId !== origProjectId ||
        formTagsInput !== origTags ||
        formIsPinned !== origPinned
      );
    } else {
      return !!(formTitle.trim() || formText.trim() || formTagsInput.trim() || formProjectId || formIsPinned);
    }
  }, [isEditorOpen, editingMemory, formTitle, formText, formCategory, formProjectId, formTagsInput, formIsPinned]);

  // Focus input when editor opens
  useEffect(() => {
    if (isEditorOpen) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isEditorOpen]);

  // Keyboard Escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (deletingMemoryId) {
          setDeletingMemoryId(null);
          return;
        }
        if (showUnsavedWarning) {
          setShowUnsavedWarning(false);
          return;
        }
        if (isEditorOpen) {
          if (isFormDirty) {
            setShowUnsavedWarning(true);
          } else {
            closeEditorModal();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditorOpen, isFormDirty, showUnsavedWarning, deletingMemoryId]);

  // Active / Archived / Deleted partitions
  const activeMemories = useMemo(() => allRawMemories.filter(m => !m.isDeleted && !m.isArchived), [allRawMemories]);
  const archivedMemories = useMemo(() => allRawMemories.filter(m => m.isArchived && !m.isDeleted), [allRawMemories]);
  const deletedMemories = useMemo(() => allRawMemories.filter(m => m.isDeleted), [allRawMemories]);

  // Precise local statistics
  const stats = useMemo(() => {
    const pinnedCount = activeMemories.filter(m => m.isPinned).length;
    // Projects filter specifically checks actual project relation: !!m.projectId
    const projectCount = activeMemories.filter(m => !!m.projectId).length;
    const ideaCount = activeMemories.filter(m => m.category === 'Ideas').length;
    return {
      totalActive: activeMemories.length,
      pinnedCount,
      projectCount,
      ideaCount,
      archivedCount: archivedMemories.length,
      trashCount: deletedMemories.length
    };
  }, [activeMemories, archivedMemories, deletedMemories]);

  // Browser-level sync status counts
  const syncSummary = useMemo(() => {
    const pendingCount = allRawMemories.filter(m => m.syncStatus === 'pending_sync').length;
    const errorCount = allRawMemories.filter(m => m.syncStatus === 'sync_error').length;
    const syncedCount = allRawMemories.filter(m => m.syncStatus === 'synced').length;

    if (errorCount > 0) {
      return { message: "Synkronointi epäonnistui", statusClass: "text-rose-400 bg-rose-950/40 border-rose-800/50", icon: CloudOff };
    }
    if (pendingCount > 0) {
      return { message: `${pendingCount} muutosta odottaa yhteyttä`, statusClass: "text-amber-400 bg-amber-950/40 border-amber-800/50", icon: CloudUpload };
    }
    if (syncedCount > 0) {
      return { message: "Kaikki muutokset synkronoitu", statusClass: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50", icon: CloudCheck };
    }
    return { message: "Tallennettu laitteelle", statusClass: "text-stone-400 bg-stone-900/60 border-stone-800/50", icon: Check };
  }, [allRawMemories]);

  // Filtered & sorted memory collection
  const filteredMemories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matched = allRawMemories.filter(m => {
      // 1. Navigation filter matching
      if (navFilter === 'all') {
        if (m.isDeleted || m.isArchived) return false;
      } else if (navFilter === 'pinned') {
        if (m.isDeleted || m.isArchived || !m.isPinned) return false;
      } else if (navFilter === 'today') {
        if (m.isDeleted || m.isArchived) return false;
        if (!isToday(m.localUpdatedAt || m.createdAt)) return false;
      } else if (navFilter === 'this_week') {
        if (m.isDeleted || m.isArchived) return false;
        if (!isThisWeek(m.localUpdatedAt || m.createdAt)) return false;
      } else if (navFilter === 'projects') {
        if (m.isDeleted || m.isArchived) return false;
        // Step 3 fix: Projects filter uses actual project relationship (!!m.projectId)
        if (!m.projectId) return false;
      } else if (navFilter === 'ideas') {
        if (m.isDeleted || m.isArchived) return false;
        if (m.category !== 'Ideas') return false;
      } else if (navFilter === 'archive') {
        if (m.isDeleted || !m.isArchived) return false;
      } else if (navFilter === 'trash') {
        if (!m.isDeleted) return false;
      }

      // 2. Search query matching
      if (!q) return true;

      const matchTitle = m.title?.toLowerCase().includes(q);
      const matchText = m.text.toLowerCase().includes(q);
      const matchCategory = m.category?.toLowerCase().includes(q);
      const matchProject = m.projectId?.toLowerCase().includes(q);
      const matchTags = m.tags?.some(t => t.toLowerCase().includes(q));

      return !!(matchTitle || matchText || matchCategory || matchProject || matchTags);
    });

    // 3. Sorting: Pinned first, then most recent update/creation time
    return matched.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      const timeA = new Date(a.localUpdatedAt || a.createdAt).getTime();
      const timeB = new Date(b.localUpdatedAt || b.createdAt).getTime();
      return timeB - timeA;
    });
  }, [allRawMemories, navFilter, searchQuery]);

  // Open editor for creating a new memory
  const handleOpenNewEditor = () => {
    setEditingMemory(null);
    setFormTitle("");
    setFormText("");
    setFormCategory('Projects');
    setFormProjectId("");
    setFormTagsInput("");
    setFormIsPinned(false);
    setShowUnsavedWarning(false);
    setIsEditorOpen(true);
  };

  // Open editor for editing an existing memory
  const handleOpenEditEditor = (m: Memory) => {
    setEditingMemory(m);
    setFormTitle(m.title || "");
    setFormText(m.text || "");
    setFormCategory(m.category || "Personal");
    setFormProjectId(m.projectId || "");
    setFormTagsInput(m.tags ? m.tags.join(", ") : "");
    setFormIsPinned(!!m.isPinned);
    setShowUnsavedWarning(false);
    setIsEditorOpen(true);
  };

  // Safe close editor check
  const handleAttemptCloseEditor = () => {
    if (isFormDirty) {
      setShowUnsavedWarning(true);
    } else {
      closeEditorModal();
    }
  };

  const closeEditorModal = () => {
    setIsEditorOpen(false);
    setEditingMemory(null);
    setShowUnsavedWarning(false);
  };

  // Save memory handler (create or update)
  const handleSaveEditor = (e: FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    const tags = parseAndNormalizeTags(formTagsInput);
    const projId = formProjectId.trim() || null;

    if (editingMemory) {
      auroraMemoryEngine.updateMemoryDetails(editingMemory.id, {
        title: formTitle,
        text: formText,
        category: formCategory,
        projectId: projId,
        tags,
        isPinned: formIsPinned
      });
    } else {
      auroraMemoryEngine.saveMemory(
        formText,
        formCategory,
        tags,
        formIsPinned,
        formTitle,
        projId
      );
    }

    closeEditorModal();
  };

  // Pin / Unpin handler (only toggles isPinned)
  const handleTogglePin = (id: string) => {
    auroraMemoryEngine.togglePin(id);
  };

  const handleArchive = (id: string) => {
    auroraMemoryEngine.archiveMemory(id);
  };

  const handleRestore = (id: string) => {
    auroraMemoryEngine.restoreMemory(id);
  };

  // Soft delete prompt handler
  const handleRequestSoftDelete = (id: string) => {
    setDeletingMemoryId(id);
  };

  const handleConfirmSoftDelete = () => {
    if (deletingMemoryId) {
      auroraMemoryEngine.deleteMemory(deletingMemoryId);
      setDeletingMemoryId(null);
    }
  };

  // Step 8: Polished empty state Finnish messages
  const getEmptyStateMessage = () => {
    if (searchQuery.trim()) {
      return {
        title: "Haulla ei löytynyt muistoja.",
        subtitle: "Kokeile toista hakusanaa tai poista suodattimia."
      };
    }
    switch (navFilter) {
      case 'pinned':
        return {
          title: "Et ole vielä kiinnittänyt muistoja.",
          subtitle: "Kiinnitetyt muistot löytyvät myöhemmin nopeasti tästä näkymästä."
        };
      case 'archive':
        return {
          title: "Arkisto on tyhjä.",
          subtitle: "Arkistoidut muistot säilyvät täällä turvallisesti."
        };
      case 'trash':
        return {
          title: "Roskakori on tyhjä.",
          subtitle: "Poistetut muistot näkyvät täällä ennen mahdollista myöhempää käsittelyä."
        };
      case 'today':
        return {
          title: "Ei muistoja tältä päivältä.",
          subtitle: "Voit lisätä uuden muiston yläpalkin Nappi-valikosta."
        };
      case 'this_week':
        return {
          title: "Ei muistoja tältä viikolta.",
          subtitle: "Tällä viikolla tallennetut muistot kertyvät tänne."
        };
      case 'projects':
        return {
          title: "Ei liitettyjä projektimuistoja.",
          subtitle: "Voit liittää muiston johonkin Qvick Games -projektiin muokkaamalla muistoa."
        };
      case 'ideas':
        return {
          title: "Ei taltioituja ideoita.",
          subtitle: "Taltioidut ideat ja visiot näkyvät tässä suodattimessa."
        };
      case 'all':
      default:
        return {
          title: "Auroralla ei ole vielä tallennettuja muistoja.",
          subtitle: "Tallenna uusi muisto, opintosaavutus tai projektipäivitys."
        };
    }
  };

  const SyncIcon = syncSummary.icon;
  const emptyStateInfo = getEmptyStateMessage();

  // Helper to find project display name
  const getProjectName = (projId?: string | null) => {
    if (!projId) return null;
    const match = availableProjects.find(p => p.id === projId || p.name === projId);
    return match ? match.name : projId;
  };

  return (
    <div id="memory-browser-pro-root" className="bg-[#0b0603]/90 border border-[#3d2b1d]/80 rounded-2xl p-4 md:p-6 flex flex-col h-full backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-[#f2e6d0] font-serif">
      {/* Header & Browser Sync Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#3d2b1d]/80 pb-4 mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <BrainCircuit className="w-6 h-6 text-amber-500 shrink-0" />
            <h2 className="text-lg md:text-xl font-medium tracking-wide text-[#f2e6d0] font-serif">
              Muistit
            </h2>
          </div>
          <p className="text-xs text-stone-400 font-serif mt-0.5">
            Auroran pitkäaikainen muisti
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <span className="text-xs font-mono text-stone-300 bg-[#160d06] px-3 py-1 rounded-lg border border-[#3d2b1d]">
            {stats.totalActive} muistia
          </span>

          {/* Browser-level sync status badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border ${syncSummary.statusClass}`}>
            <SyncIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{syncSummary.message}</span>
          </div>

          <button
            onClick={handleOpenNewEditor}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-mono transition-all cursor-pointer min-h-[38px] touch-manipulation"
            aria-label="Lisää uusi muisto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Uusi muisto</span>
          </button>
        </div>
      </div>

      {/* Memory Statistics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <div className="bg-[#140b05]/80 border border-[#3d2b1d]/60 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider truncate">Kaikki muistot</div>
            <div className="text-sm font-semibold font-mono text-amber-200">{stats.totalActive}</div>
          </div>
        </div>

        <div className="bg-[#140b05]/80 border border-[#3d2b1d]/60 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <Pin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider truncate">Kiinnitetyt</div>
            <div className="text-sm font-semibold font-mono text-amber-200">{stats.pinnedCount}</div>
          </div>
        </div>

        <div className="bg-[#140b05]/80 border border-[#3d2b1d]/60 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <Folder className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider truncate">Projektimuistot</div>
            <div className="text-sm font-semibold font-mono text-amber-200">{stats.projectCount}</div>
          </div>
        </div>

        <div className="bg-[#140b05]/80 border border-[#3d2b1d]/60 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider truncate">Ideat</div>
            <div className="text-sm font-semibold font-mono text-amber-200">{stats.ideaCount}</div>
          </div>
        </div>
      </div>

      {/* Search Input Field */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hae muistoista..."
          aria-label="Hae muistoista"
          className="w-full bg-[#140b05] text-xs md:text-sm border border-[#3d2b1d] rounded-xl pl-10 pr-9 py-2.5 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 font-serif min-h-[44px]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-2.5 p-1 text-stone-500 hover:text-stone-300 cursor-pointer"
            aria-label="Tyhjennä haku"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {NAV_FILTERS.map((f) => {
          const Icon = f.icon;
          const isActive = navFilter === f.key;
          let badgeCount = 0;
          if (f.key === 'all') badgeCount = stats.totalActive;
          else if (f.key === 'pinned') badgeCount = stats.pinnedCount;
          else if (f.key === 'projects') badgeCount = stats.projectCount;
          else if (f.key === 'ideas') badgeCount = stats.ideaCount;
          else if (f.key === 'archive') badgeCount = stats.archivedCount;
          else if (f.key === 'trash') badgeCount = stats.trashCount;

          return (
            <button
              key={f.key}
              onClick={() => setNavFilter(f.key)}
              aria-pressed={isActive}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer min-h-[38px] touch-manipulation ${
                isActive
                  ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                  : "bg-[#140b05]/60 hover:bg-[#1e1107] border border-[#3d2b1d]/60 text-stone-400 hover:text-stone-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{f.label}</span>
              {badgeCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-amber-500/30 text-amber-200" : "bg-[#0b0603] text-stone-500"
                }`}>
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Memory Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[220px]">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-12 px-4 text-stone-500 text-xs font-serif flex flex-col items-center justify-center gap-2 bg-[#140b05]/30 border border-[#3d2b1d]/40 rounded-xl">
            <Inbox className="w-8 h-8 text-stone-600/60" />
            <p className="text-stone-300 font-medium">{emptyStateInfo.title}</p>
            <p className="text-stone-500 text-[11px] max-w-sm">{emptyStateInfo.subtitle}</p>
          </div>
        ) : (
          filteredMemories.map((m) => {
            const syncBadge = getSyncStatusBadge(m.syncStatus);
            const CardSyncIcon = syncBadge.icon;
            const linkedProjectName = getProjectName(m.projectId);

            return (
              <div
                key={m.id}
                className={`group relative bg-[#140b05]/80 hover:bg-[#1c1008] p-4 rounded-xl border transition-all duration-200 ${
                  m.isPinned 
                    ? "border-amber-500/40 bg-[#1a0e06] shadow-[0_0_16px_rgba(212,175,55,0.06)]" 
                    : "border-[#3d2b1d]/60 hover:border-amber-500/30"
                }`}
              >
                <div className="flex flex-col gap-2">
                  {/* Card Header Info */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {m.isPinned && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5" /> Kiinnitetty
                        </span>
                      )}
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#0b0603] border border-[#3d2b1d] text-amber-400 uppercase tracking-wider font-semibold">
                        {m.category || 'Personal'}
                      </span>
                      {linkedProjectName && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#1e1107] border border-amber-500/30 text-amber-300/90 flex items-center gap-1">
                          <FolderGit2 className="w-2.5 h-2.5" /> {linkedProjectName}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(m.createdAt).toLocaleDateString("fi-FI")} {new Date(m.createdAt).toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {/* Sync Status Badge */}
                    <div className={`text-[9px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${syncBadge.colorClass}`}>
                      <CardSyncIcon className="w-2.5 h-2.5" />
                      <span>{syncBadge.label}</span>
                    </div>
                  </div>

                  {/* Memory Title (if present) */}
                  {m.title && (
                    <h4 className="text-xs md:text-sm font-semibold text-amber-200 font-serif tracking-wide">
                      {m.title}
                    </h4>
                  )}

                  {/* Memory Content Text */}
                  <p className="text-xs text-[#e8dfd1] font-serif leading-relaxed whitespace-pre-wrap">
                    {m.text}
                  </p>

                  {/* Tags & Actions Row */}
                  <div className="flex items-center justify-between gap-2 pt-1 mt-1 border-t border-[#3d2b1d]/40 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap max-w-full overflow-hidden">
                      {m.tags && m.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 truncate max-w-[150px]">
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1 shrink-0 ml-auto">
                      {!m.isDeleted && (
                        <>
                          {/* Pin / Unpin */}
                          <button
                            onClick={() => handleTogglePin(m.id)}
                            className={`p-2 rounded transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center ${
                              m.isPinned 
                                ? "text-amber-400 hover:text-amber-300 bg-amber-500/10" 
                                : "text-stone-500 hover:text-amber-400"
                            }`}
                            title={m.isPinned ? "Poista kiinnitys" : "Kiinnitä muisto"}
                            aria-label={m.isPinned ? "Poista kiinnitys" : "Kiinnitä muisto"}
                          >
                            {m.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditEditor(m)}
                            className="p-2 text-stone-500 hover:text-amber-300 rounded transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                            title="Muokkaa muistoa"
                            aria-label="Muokkaa muistoa"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Archive / Restore */}
                          {m.isArchived ? (
                            <button
                              onClick={() => handleRestore(m.id)}
                              className="p-2 text-stone-500 hover:text-emerald-400 rounded transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                              title="Palauta arkistosta"
                              aria-label="Palauta arkistosta"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArchive(m.id)}
                              className="p-2 text-stone-500 hover:text-amber-400 rounded transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                              title="Arkistoi muisto"
                              aria-label="Arkistoi muisto"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}

                      {/* Trash / Restore if deleted */}
                      {m.isDeleted ? (
                        <button
                          onClick={() => handleRestore(m.id)}
                          className="p-2 text-stone-500 hover:text-emerald-400 rounded transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                          title="Palauta roskakorista"
                          aria-label="Palauta roskakorista"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRequestSoftDelete(m.id)}
                          className="p-2 text-stone-500 hover:text-rose-400 rounded transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                          title="Siirrä roskakoriin"
                          aria-label="Siirrä roskakoriin"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400/80 hover:text-rose-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Step 4: Dedicated Polished Memory Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#160d06] border border-amber-500/40 rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col font-serif overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-3 mb-4 shrink-0">
              <span className="text-sm font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
                {editingMemory ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingMemory ? "Muokkaa muistoa" : "Uusi muisto"}
              </span>
              <button
                type="button"
                onClick={handleAttemptCloseEditor}
                className="p-1 text-stone-400 hover:text-stone-200 border border-[#3d2b1d] rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Sulje muokkain"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEditor} className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <label className="block text-xs font-mono text-stone-400 uppercase tracking-wider mb-1">
                  Otsikko
                </label>
                <input
                  ref={titleInputRef}
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Muiston otsikko (valinnainen)..."
                  className="w-full bg-[#0b0603] text-xs md:text-sm border border-[#3d2b1d] rounded-xl px-3 py-2 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 uppercase tracking-wider mb-1">
                  Muiston sisältö *
                </label>
                <textarea
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Kirjoita muiston kuvaus tai saavutus..."
                  rows={4}
                  className="w-full bg-[#0b0603] text-xs md:text-sm border border-[#3d2b1d] rounded-xl p-3 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 font-serif leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-stone-400 uppercase tracking-wider mb-1">
                    Kategoria
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MemoryCategory)}
                    className="w-full bg-[#0b0603] text-xs md:text-sm font-mono border border-[#3d2b1d] rounded-xl px-3 py-2 text-amber-400 focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-400 uppercase tracking-wider mb-1">
                    Liitetty projekti
                  </label>
                  <select
                    value={formProjectId}
                    onChange={(e) => setFormProjectId(e.target.value)}
                    className="w-full bg-[#0b0603] text-xs md:text-sm font-mono border border-[#3d2b1d] rounded-xl px-3 py-2 text-amber-300 focus:outline-none"
                  >
                    <option value="">Ei liitettyä projektia</option>
                    {availableProjects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-stone-500" /> Tunnisteet
                </label>
                <input
                  type="text"
                  value={formTagsInput}
                  onChange={(e) => setFormTagsInput(e.target.value)}
                  placeholder="Esim. Aurora, Firebase, Pelikehitys (pilkulla erotettuna)..."
                  className="w-full bg-[#0b0603] text-xs md:text-sm border border-[#3d2b1d] rounded-xl px-3 py-2 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-mono text-stone-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsPinned}
                    onChange={(e) => setFormIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded border-[#3d2b1d] bg-[#0b0603] text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Kiinnitetty (pysyy listan kärjessä)</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3d2b1d] mt-4">
                <button
                  type="button"
                  onClick={handleAttemptCloseEditor}
                  className="px-4 py-2 bg-[#0b0603] hover:bg-[#1e1107] border border-[#3d2b1d] text-stone-400 hover:text-stone-200 rounded-xl text-xs font-mono transition-colors cursor-pointer min-h-[40px]"
                >
                  Peruuta
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer min-h-[40px] shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                >
                  Tallenna muutokset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unsaved Changes Confirmation Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#160d06] border border-amber-500/40 rounded-2xl p-6 shadow-2xl font-serif space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-mono font-semibold uppercase tracking-wider">
                Tallentamattomia muutoksia
              </h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Sinulla on tallentamattomia muutoksia. Haluatko varmasti sulkea muokkaimen ja menettää syötetyt tiedot?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowUnsavedWarning(false)}
                className="px-4 py-2 bg-[#0b0603] border border-[#3d2b1d] text-stone-300 hover:text-stone-100 rounded-xl text-xs font-mono transition-colors cursor-pointer min-h-[40px]"
              >
                Pysy muokkaimessa
              </button>
              <button
                type="button"
                onClick={closeEditorModal}
                className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer min-h-[40px]"
              >
                Hylkää muutokset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 12: Soft Delete Safety Confirmation Modal */}
      {deletingMemoryId && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#160d06] border border-rose-500/40 rounded-2xl p-6 shadow-2xl font-serif space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <Trash2 className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-mono font-semibold uppercase tracking-wider">
                Siirretäänkö roskakoriin?
              </h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Siirretäänkö tämä muisto roskakoriin? Muistoa ei poisteta pysyvästi, ja sen voi palauttaa myöhemmin Roskakori-näkymästä.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMemoryId(null)}
                className="px-4 py-2 bg-[#0b0603] border border-[#3d2b1d] text-stone-300 hover:text-stone-100 rounded-xl text-xs font-mono transition-colors cursor-pointer min-h-[40px]"
              >
                Peruuta
              </button>
              <button
                type="button"
                onClick={handleConfirmSoftDelete}
                className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-300 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer min-h-[40px]"
              >
                Siirrä roskakoriin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
