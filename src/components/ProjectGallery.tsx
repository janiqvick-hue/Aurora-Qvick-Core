import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { 
  ProjectVisualCategory, 
  ProjectVisualAsset 
} from "../types";
import { projectVisualMemoryEngine } from "../core/ProjectVisualMemoryEngine";
import { 
  Images, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Star, 
  Trash2, 
  X, 
  Calendar, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  FileText, 
  Video, 
  Compass,
  ArrowRight
} from "lucide-react";

interface ProjectGalleryProps {
  projectName: string;
  onSelectProject?: (projName: string) => void;
  className?: string;
}

const CATEGORIES: { label: string; value: ProjectVisualCategory | 'All'; icon: string }[] = [
  { label: "Kaikki Valokuvat & Dokumentit", value: "All", icon: "🖼️" },
  { label: "Hero image (Kansikuva)", value: "Hero image", icon: "⭐" },
  { label: "Screenshots (Kuvakaappaukset)", value: "Screenshots", icon: "📸" },
  { label: "Concept Art (Konseptitaide)", value: "Concept Art", icon: "🎨" },
  { label: "Character Images (Hahmot)", value: "Character Images", icon: "👤" },
  { label: "Environment Images (Ympäristöt)", value: "Environment Images", icon: "🌲" },
  { label: "UI Images (Käyttöliittymä)", value: "UI Images", icon: "📱" },
  { label: "Documents (Dokumentit)", value: "Documents", icon: "📄" },
  { label: "Videos (Videot & Traileri)", value: "Videos", icon: "🎬" },
  { label: "Reference Images (Referenssit)", value: "Reference Images", icon: "💡" }
];

export default function ProjectGallery({ projectName, onSelectProject, className = "" }: ProjectGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectVisualCategory | 'All'>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState<ProjectVisualAsset[]>([]);
  const [activeAssetModal, setActiveAssetModal] = useState<ProjectVisualAsset | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for uploading new visual asset
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState<ProjectVisualCategory>("Screenshots");
  const [newDesc, setNewDesc] = useState("");
  const [newTags, setNewTags] = useState("");
  const [previewDataUrl, setPreviewDataUrl] = useState("");

  const refreshAssets = () => {
    const list = projectVisualMemoryEngine.getAssetsByProject(projectName);
    setAssets(list);
  };

  useEffect(() => {
    refreshAssets();
  }, [projectName]);

  const filteredAssets = assets.filter((asset) => {
    const matchesCat = selectedCategory === "All" || asset.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      asset.title.toLowerCase().includes(q) ||
      asset.description.toLowerCase().includes(q) ||
      asset.tags.some(t => t.toLowerCase().includes(q)) ||
      asset.category.toLowerCase().includes(q)
    );
    return matchesCat && matchesSearch;
  });

  const heroAsset = assets.find(a => a.isHero || a.category === 'Hero image') || assets[0];

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        setPreviewDataUrl(resultUrl);
        setNewUrl(resultUrl);
        if (!newTitle) setNewTitle(file.name.split('.')[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalUrl = newUrl.trim() || previewDataUrl || "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1000&q=80";
    if (!newTitle.trim()) return;

    const tagsArr = newTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    projectVisualMemoryEngine.processAndAttachAsset({
      title: newTitle.trim(),
      url: finalUrl,
      projectName,
      description: newDesc.trim() || `Visuaalinen muisto lisätty galleriaan: ${newTitle.trim()}`,
      tags: tagsArr,
      forcedCategory: newCategory
    });

    // Reset
    setNewTitle("");
    setNewUrl("");
    setNewDesc("");
    setNewTags("");
    setPreviewDataUrl("");
    setShowAddModal(false);
    refreshAssets();
  };

  const handleDeleteAsset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Haluatko varmasti poistaa tämän visuaalisen muiston galleriasta?")) {
      const all = projectVisualMemoryEngine.getAllAssets();
      const updated = all.filter(a => a.id !== id);
      localStorage.setItem("aurora_project_visual_assets_v1", JSON.stringify(updated));
      refreshAssets();
      if (activeAssetModal?.id === id) setActiveAssetModal(null);
    }
  };

  const renderCategoryBadge = (category: ProjectVisualCategory) => {
    switch (category) {
      case 'Hero image':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> Hero Image</span>;
      case 'Concept Art':
        return <span className="bg-purple-950/60 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded text-[10px] font-mono">🎨 Concept Art</span>;
      case 'Character Images':
        return <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-mono">👤 Character</span>;
      case 'Environment Images':
        return <span className="bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded text-[10px] font-mono">🌲 Environment</span>;
      case 'UI Images':
        return <span className="bg-blue-950/60 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded text-[10px] font-mono">📱 UI & HUD</span>;
      case 'Documents':
        return <span className="bg-stone-800 text-stone-300 border border-stone-600 px-2 py-0.5 rounded text-[10px] font-mono">📄 Document</span>;
      case 'Videos':
        return <span className="bg-rose-950/60 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded text-[10px] font-mono">🎬 Video / Trailer</span>;
      case 'Reference Images':
        return <span className="bg-amber-950/40 text-amber-200 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-mono">💡 Reference</span>;
      default:
        return <span className="bg-stone-900 text-stone-300 border border-stone-700 px-2 py-0.5 rounded text-[10px] font-mono">📸 Screenshot</span>;
    }
  };

  return (
    <div className={`bg-stone-900/80 border border-stone-800 rounded-xl p-5 flex flex-col h-full font-serif ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-stone-800 pb-3 mb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <Images className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-sm font-serif tracking-widest text-stone-100 uppercase font-medium flex items-center gap-2">
              <span>PROJECT GALLERIA & VISUAALINEN MUISTI</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {assets.length} Visualisointia
              </span>
            </h3>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              Hanke: <span className="text-amber-400 font-semibold">{projectName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Lisää Visuaalinen Muisto</span>
          </button>
        </div>
      </div>

      {/* Featured Hero Banner if Available */}
      {heroAsset && (
        <div className="relative mb-4 rounded-xl overflow-hidden border border-amber-500/30 bg-stone-950 group shadow-lg">
          <img 
            src={heroAsset.url} 
            alt={heroAsset.title}
            className="w-full h-44 object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/50 uppercase font-bold flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> PROJEKTIN HERO-KUVA
              </span>
              <span className="text-[10px] font-mono text-stone-400">{heroAsset.addedAt}</span>
            </div>
            <h4 className="text-base font-serif text-stone-100 font-medium">{heroAsset.title}</h4>
            <p className="text-xs text-stone-300 font-sans line-clamp-1 mt-0.5">{heroAsset.description}</p>
          </div>
        </div>
      )}

      {/* Filter Category Tabs & Search Bar */}
      <div className="space-y-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Etsi visuaalisia muistoja, tägejä tai hakusanoja..."
            className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/40 font-sans"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs font-mono">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            const count = cat.value === 'All' 
              ? assets.length 
              : assets.filter(a => a.category === cat.value).length;

            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-amber-950 text-amber-200 border-amber-500/60 font-semibold shadow-md'
                    : 'bg-stone-950/60 text-stone-400 border-stone-800 hover:border-amber-500/30 hover:text-stone-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-70 bg-stone-900 px-1.5 py-0.2 rounded">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Grid (Newest First) */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredAssets.length === 0 ? (
          <div className="bg-stone-950/40 border border-stone-800/80 rounded-xl p-8 text-center text-stone-400 space-y-2">
            <Images className="w-10 h-10 text-stone-600 mx-auto" />
            <p className="text-sm font-medium text-stone-300">Ei löytyneitä visuaalisia muistoja kategorialla "{selectedCategory}".</p>
            <p className="text-xs text-stone-500">Voit lisätä uuden kuvan tai kuvakaappauksen yläkulman painikkeesta.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => setActiveAssetModal(asset)}
                className="group relative bg-stone-950 border border-stone-800/80 rounded-xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 cursor-pointer shadow-md flex flex-col"
              >
                {/* Image Thumbnail Container */}
                <div className="relative h-36 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={asset.url}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors" />

                  {/* Top Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    {renderCategoryBadge(asset.category)}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteAsset(asset.id, e)}
                    className="absolute top-2 right-2 p-1 bg-stone-950/80 text-stone-400 hover:text-red-400 rounded transition-opacity opacity-0 group-hover:opacity-100"
                    title="Poista muisto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Hover Overlay Eye */}
                  <div className="absolute inset-0 bg-stone-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1 bg-amber-500/80 text-stone-950 rounded-full text-xs font-mono font-bold flex items-center gap-1 shadow-lg">
                      <Eye className="w-3.5 h-3.5" /> Katso suurennettuna
                    </span>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-serif font-medium text-stone-200 group-hover:text-amber-300 transition-colors line-clamp-1">
                      {asset.title}
                    </h5>
                    <p className="text-[11px] text-stone-400 font-sans line-clamp-2 mt-0.5 leading-relaxed">
                      {asset.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between text-[10px] font-mono text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-500/60" />
                      {asset.addedAt}
                    </span>
                    {asset.tags && asset.tags.length > 0 && (
                      <span className="truncate max-w-[100px] text-stone-400">
                        #{asset.tags[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX / FULLSCREEN ASSET MODAL */}
      {activeAssetModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            {/* Image Preview Side */}
            <div className="md:w-3/5 bg-stone-950 flex items-center justify-center relative p-2 min-h-[260px]">
              <img
                src={activeAssetModal.url}
                alt={activeAssetModal.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
              />
              <div className="absolute top-3 left-3">
                {renderCategoryBadge(activeAssetModal.category)}
              </div>
            </div>

            {/* Information Side */}
            <div className="md:w-2/5 p-5 flex flex-col justify-between space-y-4 bg-stone-900 overflow-y-auto">
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-stone-800 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">VISUAALINEN MUISTO</span>
                    <h4 className="text-lg font-serif text-stone-100 font-medium">{activeAssetModal.title}</h4>
                  </div>
                  <button
                    onClick={() => setActiveAssetModal(null)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div>
                    <label className="text-[10px] font-mono text-stone-500 uppercase block mb-0.5">Kuvaus & Tausta</label>
                    <p className="text-stone-300 leading-relaxed bg-stone-950/60 p-3 rounded-lg border border-stone-800">
                      {activeAssetModal.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="bg-stone-950/40 p-2 rounded border border-stone-800">
                      <span className="text-stone-500 block text-[9px]">HANKE</span>
                      <span className="text-amber-300">{activeAssetModal.projectName}</span>
                    </div>
                    <div className="bg-stone-950/40 p-2 rounded border border-stone-800">
                      <span className="text-stone-500 block text-[9px]">LISÄTTY</span>
                      <span className="text-stone-300">{activeAssetModal.addedAt}</span>
                    </div>
                  </div>

                  {activeAssetModal.tags && activeAssetModal.tags.length > 0 && (
                    <div>
                      <label className="text-[10px] font-mono text-stone-500 uppercase block mb-1">Tägit & Avainsanat</label>
                      <div className="flex flex-wrap gap-1">
                        {activeAssetModal.tags.map((t, idx) => (
                          <span key={idx} className="bg-stone-950 text-stone-400 px-2 py-0.5 rounded text-[10px] font-mono border border-stone-800">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-stone-800 pt-3 flex items-center justify-between text-xs font-mono">
                <a
                  href={activeAssetModal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Avaa alkuperäinen kuva
                </a>
                <button
                  onClick={(e) => handleDeleteAsset(activeAssetModal.id, e)}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Poista muisto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD / ADD NEW VISUAL MEMORY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <h4 className="text-sm font-serif tracking-wider text-stone-100 uppercase font-medium">
                  LISÄÄ VISUAALINEN MUISTO – {projectName}
                </h4>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-[10px] font-mono text-stone-400 mb-1">OTSIKKO / Nimi *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="esm. Tutkintataulun uusi konsepti..."
                  required
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-stone-400 mb-1">KATEGORIA</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProjectVisualCategory)}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500/40 font-mono text-xs"
                  >
                    {CATEGORIES.filter(c => c.value !== 'All').map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-stone-400 mb-1">LISÄÄ KUVATIEDOSTO</label>
                  <label className="w-full bg-stone-950 border border-stone-800 hover:border-amber-500/40 rounded px-3 py-2 text-stone-300 font-mono text-[11px] flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lataa koneelta</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-stone-400 mb-1">TAI KUVA-URL (Osoite)</label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500/40 font-mono text-[11px]"
                />
              </div>

              {previewDataUrl && (
                <div className="h-24 bg-stone-950 rounded border border-stone-800 overflow-hidden flex items-center justify-center">
                  <img src={previewDataUrl} alt="Preview" className="h-full object-contain" />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono text-stone-400 mb-1">KUVAUS / LISÄTIEDOT</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Kuvaile kuvakaappauksen tai konseptitaiteen yksityiskohtia..."
                  className="w-full h-16 bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500/40 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-stone-400 mb-1">TÄGIT (Erottele pilkulla)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="UI, Gameplay, Chapter1"
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500/40 font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs cursor-pointer"
                >
                  Peruuta
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                   Tallenna Muisto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
