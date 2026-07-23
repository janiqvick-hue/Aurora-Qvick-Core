import React, { useState } from "react";
import { 
  qvickGamesEcosystemEngine, 
  EcosystemProject, 
  StudyItem 
} from "../core/QvickGamesEcosystemEngine";
import { proactiveIntelligenceEngine } from "../core/ProactiveIntelligenceEngine";
import { knowledgeLibraryEngine } from "../core/KnowledgeLibraryEngine";
import { ideaVaultEngine } from "../core/IdeaVaultEngine";
import { intelligentSearchEngine } from "../core/IntelligentSearchEngine";
import { documentationAssistantEngine } from "../core/DocumentationAssistantEngine";
import { projectIdentityEngine } from "../core/ProjectIdentityEngine";
import { ProjectIdentityCard } from "./ProjectIdentityCard";
import { KnowledgeCategory, IdeaCategory, SearchResultItem } from "../types";
import { 
  FolderGit2, 
  GraduationCap, 
  Award, 
  Code, 
  Gamepad2, 
  Clock, 
  BrainCircuit, 
  Target, 
  User, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  X, 
  Layers, 
  GitCommit, 
  ChevronRight,
  Globe,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  Search,
  BookOpen,
  FileText,
  Plus,
  Tag,
  Send,
  Check,
  Archive,
  Trash2,
  RotateCcw,
  Cloud
} from "lucide-react";
import { usePhase1BSync } from "../hooks/usePhase1BSync";

interface QvickGamesEcosystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projName: string) => void;
}

type TabType = 'overview' | 'weekly' | 'search' | 'knowledge' | 'ideas' | 'docs' | 'projects' | 'studies' | 'github' | 'metrics' | 'roadmap' | 'profile';

export default function QvickGamesEcosystemModal({
  isOpen,
  onClose,
  onSelectProject
}: QvickGamesEcosystemModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const {
    cloudSyncActive,
    syncCreateKnowledgeItem,
    syncArchiveKnowledgeItem,
    syncRestoreKnowledgeItem,
    syncSoftDeleteKnowledgeItem,
    syncCreateIdeaItem,
    syncUpdateIdeaStatus,
    syncArchiveIdeaItem,
    syncRestoreIdeaItem,
    syncSoftDeleteIdeaItem
  } = usePhase1BSync();

  // Search tab state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

  // Knowledge Library state
  const [selectedKbCategory, setSelectedKbCategory] = useState<KnowledgeCategory | 'All'>('All');
  const [selectedKbArticleId, setSelectedKbArticleId] = useState<string | null>(null);
  const [showAddArticleForm, setShowAddArticleForm] = useState(false);
  const [newKbTitle, setNewKbTitle] = useState("");
  const [newKbCategory, setNewKbCategory] = useState<KnowledgeCategory>('Projects');
  const [newKbSummary, setNewKbSummary] = useState("");
  const [newKbContent, setNewKbContent] = useState("");

  // Idea Vault state
  const [selectedIdeaCategory, setSelectedIdeaCategory] = useState<IdeaCategory | 'All'>('All');
  const [showAddIdeaForm, setShowAddIdeaForm] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaCategory, setNewIdeaCategory] = useState<IdeaCategory>('Game Ideas');
  const [newIdeaDescription, setNewIdeaDescription] = useState("");
  const [newIdeaImpact, setNewIdeaImpact] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Documentation Assistant state
  const [selectedDocProject, setSelectedDocProject] = useState("Murhamysteeri Mökillä");

  if (!isOpen) return null;

  const profile = qvickGamesEcosystemEngine.getStudioProfile();
  const projects = qvickGamesEcosystemEngine.getEcosystemProjects();
  const studies = qvickGamesEcosystemEngine.getStudyOverview();
  const github = qvickGamesEcosystemEngine.getGitHubOverview();
  const stats = qvickGamesEcosystemEngine.getDevStatistics();
  const goals = qvickGamesEcosystemEngine.getUpcomingGoals();
  const weeklyReview = proactiveIntelligenceEngine.getWeeklyProgressReview();
  const intelligentRecs = proactiveIntelligenceEngine.getIntelligentRecommendations();
  const gentleReminders = proactiveIntelligenceEngine.getGentleReminders();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchResults(intelligentSearchEngine.searchAll(searchQuery));
    }
  };

  const handleAddKbArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKbTitle.trim() && newKbContent.trim()) {
      const created = knowledgeLibraryEngine.addArticle({
        title: newKbTitle,
        category: newKbCategory,
        summary: newKbSummary || newKbContent.substring(0, 100),
        content: newKbContent,
        tags: [newKbCategory, "KnowledgeBase"],
        author: profile.leadName
      });

      // Background cloud sync
      syncCreateKnowledgeItem({
        id: created.id,
        title: created.title,
        category: created.category,
        summary: created.summary,
        content: created.content,
        tags: created.tags,
        author: created.author
      });

      setNewKbTitle("");
      setNewKbSummary("");
      setNewKbContent("");
      setShowAddArticleForm(false);
    }
  };

  const handleArchiveKbArticle = (id: string) => {
    knowledgeLibraryEngine.archiveArticle(id);
    syncArchiveKnowledgeItem(id);
  };

  const handleSoftDeleteKbArticle = (id: string) => {
    knowledgeLibraryEngine.softDeleteArticle(id);
    syncSoftDeleteKnowledgeItem(id);
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIdeaTitle.trim() && newIdeaDescription.trim()) {
      const created = ideaVaultEngine.addIdea(newIdeaTitle, newIdeaCategory, newIdeaDescription, newIdeaImpact);
      
      // Background cloud sync
      syncCreateIdeaItem({
        id: created.id,
        title: created.title,
        category: created.category,
        description: created.description,
        tags: created.tags,
        status: created.status,
        impact: created.impact
      });

      setNewIdeaTitle("");
      setNewIdeaDescription("");
      setShowAddIdeaForm(false);
    }
  };

  const handleUpdateIdeaStatus = (id: string, status: any) => {
    ideaVaultEngine.updateIdeaStatus(id, status);
    syncUpdateIdeaStatus(id, status);
  };

  const handleArchiveIdea = (id: string) => {
    ideaVaultEngine.archiveIdea(id);
    syncArchiveIdeaItem(id);
  };

  const handleSoftDeleteIdea = (id: string) => {
    ideaVaultEngine.softDeleteIdea(id);
    syncSoftDeleteIdeaItem(id);
  };

  const docSummary = documentationAssistantEngine.generateProjectDocSummary(selectedDocProject);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fadeIn font-serif text-[#f2e6d0]">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#0c0704] border border-[#d4af37]/40 rounded-2xl p-5 md:p-7 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold tracking-wide text-amber-200">
                  QVICK GAMES STUDIO OS
                </h2>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  Core Alpha 1.0
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans mt-0.5">
                {profile.leadName} • {profile.role} (Opiskelijanumero: {profile.studentNumber})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-amber-200 border border-[#3d2b1d] hover:border-amber-500/40 rounded-full transition-all cursor-pointer"
            title="Sulje OS Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#3d2b1d]/60 mb-4 text-xs font-mono scrollbar-none shrink-0">
          {[
            { id: 'overview', label: 'Yhteenveto', icon: Activity },
            { id: 'weekly', label: 'Viikkokatsaus & Äly', icon: BarChart3 },
            { id: 'search', label: 'Älykäs Haku', icon: Search },
            { id: 'knowledge', label: 'Tietoarkisto', icon: BookOpen },
            { id: 'ideas', label: 'Ideapankki', icon: Lightbulb },
            { id: 'docs', label: 'Dokumentaatioapuri', icon: FileText },
            { id: 'projects', label: 'Hankkeet (5)', icon: Gamepad2 },
            { id: 'studies', label: 'Opinnot & Sertifikaatit', icon: GraduationCap },
            { id: 'github', label: 'GitHub & Koodi', icon: FolderGit2 },
            { id: 'metrics', label: 'Tilastot', icon: Code },
            { id: 'roadmap', label: 'Tavoitteet', icon: Target },
            { id: 'profile', label: 'Jani-Petteri Qvick', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold"
                    : "bg-[#140b05]/60 hover:bg-[#1e1107] text-stone-400 hover:text-stone-200 border border-[#3d2b1d]/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>


        {/* Tab Contents Scrollable Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Top Banner metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#140b05] p-3.5 rounded-xl border border-[#3d2b1d] space-y-1">
                  <span className="text-[10px] font-mono text-stone-500 uppercase">Xamk Opintopisteet</span>
                  <div className="text-lg font-bold text-amber-300">{profile.totalXamkCredits}</div>
                  <p className="text-[10px] text-emerald-400 font-mono">100% Hyväksytty (BD)</p>
                </div>
                <div className="bg-[#140b05] p-3.5 rounded-xl border border-[#3d2b1d] space-y-1">
                  <span className="text-[10px] font-mono text-stone-500 uppercase">IVGC+ Cadgi Pisteet</span>
                  <div className="text-lg font-bold text-amber-300">{profile.totalIvgcPoints}</div>
                  <p className="text-[10px] text-emerald-400 font-mono">11 Valmista Moduulia</p>
                </div>
                <div className="bg-[#140b05] p-3.5 rounded-xl border border-[#3d2b1d] space-y-1">
                  <span className="text-[10px] font-mono text-stone-500 uppercase">Microsoft C# Tentti</span>
                  <div className="text-lg font-bold text-amber-300">{profile.microsoftCSharpScore}</div>
                  <p className="text-[10px] text-emerald-400 font-mono">77/80 Oikein (32 min)</p>
                </div>
                <div className="bg-[#140b05] p-3.5 rounded-xl border border-[#3d2b1d] space-y-1">
                  <span className="text-[10px] font-mono text-stone-500 uppercase">Google PM Sertifikaatit</span>
                  <div className="text-lg font-bold text-amber-300">Google Certified</div>
                  <p className="text-[10px] text-emerald-400 font-mono">Agile & Capstone</p>
                </div>
              </div>

              {/* Main Ecosystem Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Active Lead Project */}
                <div className="bg-[#140b05] p-4 rounded-xl border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold flex items-center gap-1.5">
                      <Gamepad2 className="w-4 h-4 text-amber-400" />
                      LIPPULAIVAHANKE: MURHAMYSTEERI MÖKILLÄ
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      v1.0 Julkaistu
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    Qvick Gamesin virallisesti julkaistu elokuvallinen suomalainen murhamysteeri mökkimiljöössä (Hiljaisen järven salaisuus). 11 tutkintapaikkaa, tutkintataulu, kaksikielisyys ja FMOD-äänimaailma.
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-stone-400">
                      <span>Prosessin valmiusaste</span>
                      <span className="text-emerald-400 font-mono font-bold">100% (Valmis)</span>
                    </div>
                    <div className="w-full h-2 bg-[#0c0704] rounded-full overflow-hidden border border-[#3d2b1d]">
                      <div className="h-full bg-gradient-to-r from-emerald-600 to-amber-400 w-full" />
                    </div>
                  </div>
                </div>

                {/* Aurora Companion OS */}
                <div className="bg-[#140b05] p-4 rounded-xl border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      TEKOÄLYJÄRJESTELMÄ: AURORA CORE
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                      Alpha 0.7
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    Aurora Qvick toimii Qvick Gamesin tekoälykäyttöjärjestelmänä. Se hallinnoi muistoja, opintoja, koodi-integraatioita ja toimii luovana sparraajana mökillä.
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-stone-400">
                      <span>Järjestelmän vakaus & Sync</span>
                      <span className="text-amber-300 font-mono font-bold">92%</span>
                    </div>
                    <div className="w-full h-2 bg-[#0c0704] rounded-full overflow-hidden border border-[#3d2b1d]">
                      <div className="h-full bg-gradient-to-r from-amber-600 to-[#d4af37] w-[92%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS & IDENTITIES */}
          {activeTab === 'projects' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-[#140b05] border border-amber-500/30 rounded-xl flex items-center justify-between text-xs font-mono">
                <span className="text-amber-300 font-bold flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-amber-400" />
                  YHDISTETTY PROJEKTI-IDENTITEETTIJÄRJESTELMÄ ({projectIdentityEngine.getProjects().length} Hanketta)
                </span>
                <span className="text-stone-400">Jokaisella hankkeella yhtenäinen tietomalli</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectIdentityEngine.getProjects().map(proj => (
                  <div key={proj.id} className="space-y-2">
                    <ProjectIdentityCard 
                      project={proj} 
                      onSelectRelated={(relName) => {
                        const target = projectIdentityEngine.getProjectByName(relName);
                        if (target && onSelectProject) {
                          onSelectProject(target.name);
                          onClose();
                        }
                      }}
                      onOpenBrain={(pName) => {
                        if (onSelectProject) {
                          onSelectProject(pName);
                          onClose();
                        }
                      }}
                    />
                    {onSelectProject && (
                      <button
                        onClick={() => {
                          onSelectProject(proj.name);
                          onClose();
                        }}
                        className="w-full py-1.5 bg-[#1a110a] hover:bg-amber-500/20 border border-[#3d2b1d] hover:border-amber-500/40 text-amber-300 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1 font-sans font-medium"
                      >
                        <span>Aseta aktiiviseksi työtilahankkeeksi</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STUDIES & CERTIFICATES */}
          {activeTab === 'studies' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-center gap-3 text-xs text-amber-200">
                <GraduationCap className="w-6 h-6 text-amber-400 shrink-0" />
                <p className="font-sans">
                  <strong>Viralliset Opintosuoritukset & Sertifikaatit:</strong> Jani-Petteri Qvick (opiskelijanumero 2616831) – Xamk Avoin AMK (21 op), Cadgi IVGC+ (33p / 11 moduulia), Microsoft C# (96,3%) ja Google PM Professional Certificate.
                </p>
              </div>

              <div className="space-y-2.5">
                {studies.map(s => (
                  <div key={s.id} className="bg-[#140b05] p-3.5 rounded-xl border border-[#3d2b1d] flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        <h4 className="text-xs font-bold text-amber-200">{s.title}</h4>
                      </div>
                      <p className="text-xs text-stone-300 font-sans leading-relaxed">{s.description}</p>
                    </div>

                    <div className="shrink-0 flex flex-col md:items-end gap-1 font-mono text-[11px]">
                      <span className="text-amber-300 font-bold bg-[#0b0603] px-2 py-0.5 rounded border border-[#3d2b1d]">
                        {s.creditsOrPoints}
                      </span>
                      <span className="text-stone-500 text-[10px]">{s.institution} • {s.date}</span>
                      {s.verificationUrl && (
                        <a
                          href={s.verificationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>Vahvista todistus</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GITHUB & CODE PIPELINE */}
          {activeTab === 'github' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-[#140b05] p-4 rounded-xl border border-[#3d2b1d] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="text-sm font-bold text-amber-200">GitHub Repository Overview</h3>
                      <a 
                        href={github.profileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono"
                      >
                        <span>{github.username}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {github.ciCdStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs pt-2">
                  <div className="bg-[#0b0603] p-2.5 rounded border border-[#3d2b1d]">
                    <span className="text-stone-500 text-[10px] uppercase block">Repositories</span>
                    <span className="text-amber-300 font-bold">{github.totalRepositories} julkista/yksityistä</span>
                  </div>
                  <div className="bg-[#0b0603] p-2.5 rounded border border-[#3d2b1d]">
                    <span className="text-stone-500 text-[10px] uppercase block">Haara</span>
                    <span className="text-amber-300 font-bold">{github.activeBranch}</span>
                  </div>
                  <div className="bg-[#0b0603] p-2.5 rounded border border-[#3d2b1d]">
                    <span className="text-stone-500 text-[10px] uppercase block">Koodirivien arvio</span>
                    <span className="text-amber-300 font-bold">{github.linesOfCode}</span>
                  </div>
                </div>
              </div>

              {/* Commits timeline */}
              <div className="bg-[#140b05] p-4 rounded-xl border border-[#3d2b1d] space-y-3">
                <h4 className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <GitCommit className="w-4 h-4" />
                  VIIMEISIMMÄT COMMITIT & RELEASE-HISTORIA
                </h4>
                <div className="space-y-2">
                  {github.recentCommits.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-[#0b0603] p-2.5 rounded border border-[#3d2b1d]/60 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500 text-[10px] bg-[#1e1107] px-1.5 py-0.5 rounded">{c.hash}</span>
                        <span className="text-stone-200">{c.msg}</span>
                      </div>
                      <span className="text-stone-500 text-[10px]">{c.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DEV METRICS */}
          {activeTab === 'metrics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-fadeIn">
              {stats.map((m, idx) => (
                <div key={idx} className="bg-[#140b05] p-4 rounded-xl border border-[#3d2b1d] space-y-2">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">{m.label}</span>
                  <div className="text-2xl font-bold text-amber-300 font-mono">{m.value}</div>
                  <p className="text-xs text-emerald-400 font-mono">{m.change}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: ROADMAP & GOALS */}
          {activeTab === 'roadmap' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 bg-[#140b05] border border-[#3d2b1d] rounded-xl font-sans text-xs text-stone-300">
                <h4 className="font-serif text-sm text-amber-300 font-bold mb-1">QVICK GAMES 2026 STRATEGINEN ROADMAP</h4>
                <p>Strateginen polku keskittyy korkealuokkaisiin kotimaisiin pelikokemuksiin ja AI-ohjattuun pelikehitykseen Lopen mökki-studioympäristössä.</p>
              </div>

              <div className="space-y-2">
                {goals.map((g, idx) => (
                  <div key={idx} className="bg-[#140b05] p-3.5 rounded-xl border border-[#3d2b1d] flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{g.timeline}</span>
                      <h4 className="text-xs font-bold text-amber-200">{g.goal}</h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#0b0603] text-stone-300 border border-[#3d2b1d]">
                      {g.priority} Prioriteetti
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: WEEKLY PROGRESS REVIEW & INTELLIGENCE */}
          {activeTab === 'weekly' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Header Banner */}
              <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-amber-200 font-serif flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                    VIIKKOEDISTYMISEN KATSAUS & PROAKTIIVISUUS
                  </h3>
                  <p className="text-xs text-stone-300 font-sans mt-0.5">
                    {weeklyReview.weekLabel} • Auroran jatkuva työtila-analyysi
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-[#0b0603] px-3 py-1 rounded border border-[#3d2b1d]">
                  {weeklyReview.certificatesCount} Sertifikaattia Todennettu
                </span>
              </div>

              {/* Summary Insight */}
              <div className="bg-[#140b05] p-3.5 rounded-xl border border-[#3d2b1d] text-xs font-sans space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">AURORAN KOKONAISARVIO</span>
                <p className="text-stone-200 leading-relaxed font-light">{weeklyReview.summaryInsight}</p>
              </div>

              {/* 2-Column Grid: Milestones & Priorities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Completed Milestones */}
                <div className="bg-[#140b05] p-4 rounded-xl border border-[#3d2b1d] space-y-3">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    SUORITETUT VIRSTANPYLVÄÄT
                  </span>
                  <div className="space-y-2 text-xs font-sans">
                    {weeklyReview.completedMilestones.map((m, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-[#0b0603] p-2 rounded border border-[#3d2b1d]/60">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <span className="text-stone-200">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Priorities */}
                <div className="bg-[#140b05] p-4 rounded-xl border border-[#3d2b1d] space-y-3">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-amber-400" />
                    NYKYISET PRIORITEETIT
                  </span>
                  <div className="space-y-2 text-xs font-sans">
                    {weeklyReview.currentPriorities.map((p, idx) => (
                      <div key={idx} className="p-2 bg-[#0b0603] rounded border border-[#3d2b1d]/60 text-stone-200 font-medium">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attention & Inactive Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Most Attention */}
                <div className="bg-[#140b05] p-4 rounded-xl border border-[#3d2b1d] space-y-3">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-amber-400" />
                    ENITEN HUOMIOTA SAANEET HANKKEET
                  </span>
                  <div className="space-y-2 text-xs font-sans">
                    {weeklyReview.mostActiveProjects.map((ap, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-[#0b0603] rounded border border-[#3d2b1d]/60">
                        <span className="text-amber-200 font-medium">{ap.name}</span>
                        <span className="font-mono text-[11px] text-amber-400 font-semibold">{ap.hoursOrPercentage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inactive Projects & Actionable Suggestion */}
                <div className="bg-[#140b05] p-4 rounded-xl border border-[#3d2b1d] space-y-3">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    PYSÄHTYNEET HANKKEET & SUOSITUKSET
                  </span>
                  <div className="space-y-2 text-xs font-sans">
                    {weeklyReview.inactiveProjects.map((ip, idx) => (
                      <div key={idx} className="p-2 bg-[#0b0603] rounded border border-[#3d2b1d]/60 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-amber-200 font-bold">{ip.name}</span>
                          <span className="text-[10px] font-mono text-amber-500">{ip.idleTime}</span>
                        </div>
                        <p className="text-stone-300 text-[11px] leading-relaxed">{ip.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Intelligent Recommendations & Gentle Reminders */}
              <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-3">
                <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  ÄLYKKÄÄT SUOSITUKSET & MUISTUTUKSET
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-stone-400 uppercase">SUOSITUKSET</span>
                    {intelligentRecs.map((rec, idx) => (
                      <p key={idx} className="p-2 bg-[#0b0603] rounded border border-[#3d2b1d] text-stone-200 leading-snug">
                        {rec}
                      </p>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-stone-400 uppercase">MUISTUTUKSET</span>
                    {gentleReminders.map((rem, idx) => (
                      <p key={idx} className="p-2 bg-[#0b0603] rounded border border-[#3d2b1d] text-stone-300 leading-snug">
                        {rem}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTELLIGENT SEARCH */}
          {activeTab === 'search' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-amber-200 font-serif">MONIKANAVAINEN ÄLYKÄS HAKU</h3>
                </div>
                <p className="text-xs text-stone-300 font-sans">
                  Hae saumattomasti päiväkirjasta, muistoista, Project Brainista, tietoarkistosta, ideapankista ja dokumentaatiosta.
                </p>

                <form onSubmit={handleSearchSubmit} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Etsi esim. C#, Unity, Murhamysteeri, Xamk, FMOD..."
                    className="flex-1 bg-[#0b0603] border border-[#3d2b1d] focus:border-amber-500/60 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Hae</span>
                  </button>
                </form>
              </div>

              {/* Results List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                  <span>HAKUTULOKSET ({searchResults.length})</span>
                  {searchQuery && <span>Lähdehakusana: "{searchQuery}"</span>}
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-8 text-center bg-[#140b05] rounded-xl border border-[#3d2b1d] text-xs text-stone-400 font-sans">
                    {searchQuery ? "Ei tuloksia hakusanalla. Kokeile yleisempää käsitettä kuten 'peli' tai 'C#'." : "Kirjoita hakusana yllä olevaan kenttään aloittaaksesi haun."}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map(res => (
                      <div key={res.id} className="p-3 bg-[#140b05] rounded-xl border border-[#3d2b1d] space-y-1.5 hover:border-amber-500/30 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#0b0603] text-amber-400 border border-[#3d2b1d]">
                            {res.sourceType}
                          </span>
                          {res.timestamp && (
                            <span className="text-[10px] font-mono text-stone-500">{res.timestamp}</span>
                          )}
                        </div>
                        <h4 className="font-bold text-amber-200 text-sm">{res.title}</h4>
                        <p className="text-xs text-stone-300 font-sans leading-relaxed">{res.snippet}</p>
                        {res.tags && res.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {res.tags.map((t, idx) => (
                              <span key={idx} className="text-[9px] font-mono text-stone-400 bg-[#0b0603] px-1.5 py-0.5 rounded border border-[#3d2b1d]/50">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: KNOWLEDGE LIBRARY */}
          {activeTab === 'knowledge' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-amber-200 font-serif flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    DEVELOPMENT KNOWLEDGE LIBRARY
                  </h3>
                  <p className="text-xs text-stone-300 font-sans mt-0.5">
                    10 Kategoriaa: Projects, Programming, Unity, React, Game Design, Sound, Graphics, AI, Studies, Personal Notes
                  </p>
                </div>
                <button
                  onClick={() => setShowAddArticleForm(!showAddArticleForm)}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Uusi Artikkeli</span>
                </button>
              </div>

              {/* Category Pills Filter */}
              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                {(['All', 'Projects', 'Programming', 'Unity', 'React', 'Game Design', 'Sound', 'Graphics', 'Artificial Intelligence', 'Studies', 'Personal Notes'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedKbCategory(cat)}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      selectedKbCategory === cat
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold"
                        : "bg-[#140b05] text-stone-400 hover:text-stone-200 border border-[#3d2b1d]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Form to add article */}
              {showAddArticleForm && (
                <form onSubmit={handleAddKbArticle} className="p-4 bg-[#140b05] border border-amber-500/40 rounded-xl space-y-3 font-sans">
                  <h4 className="text-xs font-mono font-bold text-amber-300 uppercase">Lisää uusi artikkeli tietovarastoon</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      placeholder="Artikkelin otsikko"
                      value={newKbTitle}
                      onChange={e => setNewKbTitle(e.target.value)}
                      className="bg-[#0b0603] border border-[#3d2b1d] rounded px-3 py-2 text-stone-200 focus:outline-none"
                    />
                    <select
                      value={newKbCategory}
                      onChange={e => setNewKbCategory(e.target.value as KnowledgeCategory)}
                      className="bg-[#0b0603] border border-[#3d2b1d] rounded px-3 py-2 text-stone-200 focus:outline-none"
                    >
                      {(['Projects', 'Programming', 'Unity', 'React', 'Game Design', 'Sound', 'Graphics', 'Artificial Intelligence', 'Studies', 'Personal Notes'] as KnowledgeCategory[]).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Tiivistelmä / Yhteenveto"
                    value={newKbSummary}
                    onChange={e => setNewKbSummary(e.target.value)}
                    className="w-full bg-[#0b0603] border border-[#3d2b1d] rounded px-3 py-2 text-xs text-stone-200 focus:outline-none"
                  />
                  <textarea
                    placeholder="Syvällinen sisältö ja muistiinpanot..."
                    value={newKbContent}
                    onChange={e => setNewKbContent(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0b0603] border border-[#3d2b1d] rounded px-3 py-2 text-xs text-stone-200 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddArticleForm(false)}
                      className="px-3 py-1.5 bg-[#0b0603] border border-[#3d2b1d] text-stone-400 rounded text-xs cursor-pointer"
                    >
                      Peruuta
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold rounded text-xs cursor-pointer"
                    >
                      Tallenna Artikkeli
                    </button>
                  </div>
                </form>
              )}

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {knowledgeLibraryEngine.getAllArticles()
                  .filter(a => selectedKbCategory === 'All' || a.category === selectedKbCategory)
                  .map(art => (
                    <div key={art.id} className="p-4 bg-[#140b05] rounded-xl border border-[#3d2b1d] hover:border-amber-500/30 space-y-2 transition-all relative group">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-amber-400 bg-[#0b0603] px-2 py-0.5 rounded border border-[#3d2b1d] font-bold">
                          {art.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-stone-500">{art.lastUpdated}</span>
                          <button
                            onClick={() => handleArchiveKbArticle(art.id)}
                            title="Arkistoi artikkeli"
                            className="p-1 hover:bg-amber-500/20 text-stone-400 hover:text-amber-300 rounded cursor-pointer transition-colors"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleSoftDeleteKbArticle(art.id)}
                            title="Poista artikkeli"
                            className="p-1 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 rounded cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-amber-200 text-sm">{art.title}</h4>
                      <p className="text-xs text-stone-300 font-sans leading-relaxed">{art.summary}</p>
                      <p className="text-[11px] text-stone-400 font-sans border-t border-[#3d2b1d]/40 pt-2">{art.content}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {art.tags.map((t, idx) => (
                          <span key={idx} className="text-[9px] font-mono text-stone-400 bg-[#0b0603] px-1.5 py-0.5 rounded border border-[#3d2b1d]/40">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 5: IDEA VAULT */}
          {activeTab === 'ideas' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-amber-200 font-serif flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    IDEAPANKKI (IDEA VAULT)
                  </h3>
                  <p className="text-xs text-stone-300 font-sans mt-0.5">
                    Luokittelu: Game Ideas, Aurora Ideas, Business Ideas, Research, Future Features. Automaattiset tägit & vaikuttavuus.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddIdeaForm(!showAddIdeaForm)}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Uusi Idea</span>
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                {(['All', 'Game Ideas', 'Aurora Ideas', 'Business Ideas', 'Research', 'Future Features'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedIdeaCategory(cat)}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      selectedIdeaCategory === cat
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold"
                        : "bg-[#140b05] text-stone-400 hover:text-stone-200 border border-[#3d2b1d]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Form to add Idea */}
              {showAddIdeaForm && (
                <form onSubmit={handleAddIdea} className="p-4 bg-[#140b05] border border-amber-500/40 rounded-xl space-y-3 font-sans">
                  <h4 className="text-xs font-mono font-bold text-amber-300 uppercase">Tallenna uusi idea pankkiin</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <input
                      type="text"
                      placeholder="Idean otsikko"
                      value={newIdeaTitle}
                      onChange={e => setNewIdeaTitle(e.target.value)}
                      className="bg-[#0b0603] border border-[#3d2b1d] rounded px-3 py-2 text-stone-200 focus:outline-none col-span-1 md:col-span-1"
                    />
                    <select
                      value={newIdeaCategory}
                      onChange={e => setNewIdeaCategory(e.target.value as IdeaCategory)}
                      className="bg-[#0b0603] border border-[#3d2b1d] rounded px-3 py-2 text-stone-200 focus:outline-none"
                    >
                      {(['Game Ideas', 'Aurora Ideas', 'Business Ideas', 'Research', 'Future Features'] as IdeaCategory[]).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <select
                      value={newIdeaImpact}
                      onChange={e => setNewIdeaImpact(e.target.value as 'High' | 'Medium' | 'Low')}
                      className="bg-[#0b0603] border border-[#3d2b1d] rounded px-3 py-2 text-stone-200 focus:outline-none"
                    >
                      <option value="High">Korkea vaikuttavuus (High)</option>
                      <option value="Medium">Keskisuuri vaikuttavuus (Medium)</option>
                      <option value="Low">Matala vaikuttavuus (Low)</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Kuvaile ideaa ja sen tarjoamaa hyötyä pelille tai studiolle..."
                    value={newIdeaDescription}
                    onChange={e => setNewIdeaDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0b0603] border border-[#3d2b1d] rounded px-3 py-2 text-xs text-stone-200 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddIdeaForm(false)}
                      className="px-3 py-1.5 bg-[#0b0603] border border-[#3d2b1d] text-stone-400 rounded text-xs cursor-pointer"
                    >
                      Peruuta
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold rounded text-xs cursor-pointer"
                    >
                      Lisää Idea
                    </button>
                  </div>
                </form>
              )}

              {/* Ideas List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ideaVaultEngine.getAllIdeas()
                  .filter(i => selectedIdeaCategory === 'All' || i.category === selectedIdeaCategory)
                  .map(idea => (
                    <div key={idea.id} className="p-4 bg-[#140b05] rounded-xl border border-[#3d2b1d] hover:border-amber-500/30 space-y-2 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-amber-400 bg-[#0b0603] px-2 py-0.5 rounded border border-[#3d2b1d] font-bold">
                          {idea.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <select
                            value={idea.status}
                            onChange={(e) => handleUpdateIdeaStatus(idea.id, e.target.value)}
                            className="text-[9px] font-mono text-amber-300 bg-[#0b0603] border border-[#3d2b1d] px-1.5 py-0.5 rounded focus:outline-none cursor-pointer"
                          >
                            <option value="Draft">Draft</option>
                            <option value="In Evaluation">In Evaluation</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Archived">Archived</option>
                          </select>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            idea.impact === 'High' ? "text-amber-400 bg-amber-950" : "text-stone-400 bg-[#0b0603]"
                          }`}>
                            {idea.impact}
                          </span>
                          <button
                            onClick={() => handleArchiveIdea(idea.id)}
                            title="Arkistoi idea"
                            className="p-1 hover:bg-amber-500/20 text-stone-400 hover:text-amber-300 rounded cursor-pointer transition-colors"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleSoftDeleteIdea(idea.id)}
                            title="Poista idea"
                            className="p-1 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 rounded cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-amber-200 text-sm">{idea.title}</h4>
                      <p className="text-xs text-stone-300 font-sans leading-relaxed">{idea.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {idea.tags.map((t, idx) => (
                          <span key={idx} className="text-[9px] font-mono text-amber-300/80 bg-[#0b0603] px-1.5 py-0.5 rounded border border-[#3d2b1d]/40">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 6: DOCUMENTATION ASSISTANT */}
          {activeTab === 'docs' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-amber-200 font-serif flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    DOKUMENTAATIOAPURI (DOCUMENTATION ASSISTANT)
                  </h3>
                  <p className="text-xs text-stone-300 font-sans mt-0.5">
                    Automaattinen projektitilan, valmiiden ominaisuuksien ja jatkotehtävien yhteenveto.
                  </p>
                </div>
                <select
                  value={selectedDocProject}
                  onChange={e => setSelectedDocProject(e.target.value)}
                  className="bg-[#0b0603] border border-[#3d2b1d] text-amber-300 font-mono text-xs rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Doc Summary Output Card */}
              <div className="bg-[#140b05] p-5 rounded-xl border border-[#3d2b1d] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3d2b1d] pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-amber-200">{docSummary.projectName}</h3>
                    <p className="text-xs text-stone-400 font-mono">Tila: {docSummary.status} • Päivitetty: {docSummary.lastUpdated}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-[#0b0603] px-3 py-1 rounded border border-[#3d2b1d]">
                      Valmiusaste: {docSummary.progressPercentage}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1 font-sans text-xs">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">PROSESSIN YHTEENVETO</span>
                  <p className="text-stone-200 leading-relaxed bg-[#0b0603] p-3 rounded border border-[#3d2b1d]">{docSummary.progressSummary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      VALMIIT OMINAISUUDET ({docSummary.completedFeatures.length})
                    </span>
                    <div className="space-y-1.5">
                      {docSummary.completedFeatures.map((f, idx) => (
                        <div key={idx} className="p-2 bg-[#0b0603] rounded border border-[#3d2b1d] text-stone-300">
                          ✓ {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      JÄLJELLÄ OLEVA TYÖ & VIRSTANPYLVÄS
                    </span>
                    <div className="p-2.5 bg-[#0b0603] rounded border border-[#3d2b1d] font-bold text-amber-300 mb-2">
                      Seuraava etappi: {docSummary.nextMilestone}
                    </div>
                    <div className="space-y-1.5">
                      {docSummary.remainingWork.map((rw, idx) => (
                        <div key={idx} className="p-2 bg-[#0b0603] rounded border border-[#3d2b1d] text-stone-300">
                          • {rw}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#3d2b1d] flex flex-wrap gap-1.5 items-center text-xs font-mono">
                  <span className="text-stone-500 uppercase text-[10px]">Teknologiaversiointi:</span>
                  {docSummary.techStack.map((tech, idx) => (
                    <span key={idx} className="bg-[#0b0603] text-amber-300 px-2 py-0.5 rounded border border-[#3d2b1d] text-[10px]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-[#140b05] p-5 rounded-xl border border-[#3d2b1d] space-y-4 animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-950 border-2 border-amber-500/50 flex items-center justify-center text-amber-200 font-serif font-bold text-xl shadow-xl">
                  JQ
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-200">{profile.leadName}</h3>
                  <p className="text-xs text-stone-400 font-sans">{profile.role}</p>
                  <p className="text-[11px] font-mono text-stone-500">Opiskelijanumero: {profile.studentNumber} • {profile.email}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#3d2b1d] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                <div className="bg-[#0b0603] p-3 rounded-lg border border-[#3d2b1d] space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">TUTKINTO & AKATEEMINEN STATUS</span>
                  <p className="text-stone-300 leading-relaxed">
                    Xamk Avoin AMK (21 op hyväksytty). Sertifioitu C#-asiantuntija (Microsoft 96.3%) & Google Certified Project Manager.
                  </p>
                </div>
                <div className="bg-[#0b0603] p-3 rounded-lg border border-[#3d2b1d] space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">QVICK GAMES PELISTUDIO</span>
                  <p className="text-stone-300 leading-relaxed">
                    Itsenäinen pelikehitysstudio. Erikoistuminen narratiivisiin peleihin, AI-arkkitehtuuriin ja pelisuunnitteluun.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-[#3d2b1d] flex items-center justify-between text-[11px] font-mono text-stone-500 shrink-0">
          <span>© Qvick Games Studio OS • Alpha 0.7</span>
          <a href="https://qvickgames.fi" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
            <Globe className="w-3 h-3" />
            <span>qvickgames.fi</span>
          </a>
        </div>

      </div>
    </div>
  );
}
