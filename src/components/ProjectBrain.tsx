import { useState, useEffect, FormEvent } from "react";
import { Project, ProjectSubProgress } from "../types";
import { Cpu, Plus, CheckSquare, Square, Edit3, Calendar, CheckCircle2, Bookmark, BarChart2 } from "lucide-react";

interface ProjectBrainProps {
  activeProject: Project | null;
  onSelectProject: (p: Project) => void;
}

export const DEFAULT_BRAIN_DATA: Record<string, {
  status: string;
  progress: number;
  subProgress: ProjectSubProgress;
  priority: string;
  currentPhase: string;
  currentMilestone: string;
  nextMilestone: string;
  upcomingMilestone: string;
  estimatedWork: string;
  estimatedCompletion: string;
  dependencies: string;
  auroraRecommendation: string;
  lastModified: string;
  activeTasks: string[];
  completedMilestones: string[];
  notes: string;
}> = {
  "Murhamysteeri Mökillä": {
    status: "Julkaistu & Valmis (v1.0)",
    progress: 100,
    subProgress: { visual: 100, story: 100, audio: 100, testing: 100, code: 100 },
    priority: "Korkea (Lippulaivahanke)",
    currentPhase: "Julkaistu – Qvick Games Lippulaivapeli",
    currentMilestone: "Virallinen julkaisu & 100% valmis peli-integraatio",
    nextMilestone: "Steam-valmistelu, traileri & markkinointimateriaalit",
    upcomingMilestone: "Pelaajapalaute, päivityssuunnittelu & jatkosisältöideat",
    estimatedWork: "Valmis (100%)",
    estimatedCompletion: "Julkaistu 23.7.2026",
    dependencies: "Peli on täysin valmis",
    auroraRecommendation: "Murhamysteeri Mökillä on valmis lippulaivapelimme! Suosittelen keskittymään markkinointiin, Steam-valmisteluun, trailerin luontiin sekä seuraavien Qvick Games -hankkeiden (Järven Vartijat, Aurora Core, Aurora Home) kehittämiseen.",
    lastModified: "23.7.2026",
    activeTasks: [
      "Steam-sivun & trailerin materiaalien valmistelu",
      "Pelaajapalautteen ja arvostelujen seuranta",
      "Patch-päivitysten ja jatkosisällön kartoitus",
      "Portfolio- ja verkkosivupäivitykset (qvickgames.fi)"
    ],
    completedMilestones: [
      "11 tutkintapaikan (Tupa, Keittiö, Antin huone, Sauna, Venevalkama ym.) toteutus",
      "Interaktiivinen tutkintataulu, todisteinventaario & kuulustelumekaniikka",
      "Kaksikielisyys (Suomi/Englanti), FMOD-äänipankki & pelitallennus",
      "Lippulaivajulkaisu & 100% valmis peli-integraatio"
    ],
    notes: "Qvick Gamesin virallinen elokuvallinen suomalainen murhamysteeri mökkimiljöössä. Peli on 100% valmis."
  },
  "Aurora Qvick": {
    status: "Aurora Core Alpha 0.4",
    progress: 96,
    subProgress: { visual: 96, story: 95, audio: 94, testing: 92, code: 96 },
    priority: "Korkea",
    currentPhase: "Alpha 0.4 – Älykäs Työtila-apulainen & Dashboard",
    currentMilestone: "Työtilan Päivittäinkatsaus & Smart Project Timeline",
    nextMilestone: "Digitaalinen kumppanipäivitys & Aamukatsaus",
    upcomingMilestone: "Presence Engine 2.0 & Tilatietoiset rutiinit mökillä",
    estimatedWork: "Valmis / Ylläpito",
    estimatedCompletion: "Jatkuva kehitys",
    dependencies: "AGENTS.md, Gateway, Puhesynteesi",
    auroraRecommendation: "Vahvistetaan projektien välistä muistia ja päivittäistä reflektointia mökillä.",
    lastModified: "23.7.2026",
    activeTasks: [
      "Project Brain & Aamukatsaus -integraatio",
      "Kategorioitu muistiselain ja teemat",
      "Presence Engine 2.0 -animaatiokerros"
    ],
    completedMilestones: [
      "Suomenkielinen mökkikäyttöliittymä & Gateway",
      "Pehmeä & luonnollinen suomalainen puhesynteesi",
      "Xamk 21 op opintosuoritusote & sertifikaattikanta muistissa"
    ],
    notes: "Aurora ei ole pelkkä apulainen, vaan sielukas ja rauhallinen Qvick Games -kumppani."
  },
  "Aurora Home": {
    status: "Virtuaalitila & Koti-integraatio",
    progress: 50,
    subProgress: { visual: 60, story: 70, audio: 40, testing: 20, code: 45 },
    priority: "Normaali",
    currentPhase: "Esituotanto – 3D-ympäristö & Tilakonsepti",
    currentMilestone: "3D-mökkiympäristön ja Gatewayn kytkentä",
    nextMilestone: "3D-mökkiympäristön ja Gatewayn kytkentä",
    upcomingMilestone: "Huoneiden välinen virtuaalinavigaatio & interaktiiviset esineet",
    estimatedWork: "25 h",
    estimatedCompletion: "Marraskuu 2026",
    dependencies: "Aurora Core Alpha 0.3, Unity WebGL",
    auroraRecommendation: "Hahmotellaan tulevan 3D-virtuaalimökin vuorovaikutusmallia ja huonevalikkoa.",
    lastModified: "23.7.2026",
    activeTasks: [
      "Huoneiden välinen virtuaalinavigaatio",
      "Kytke Aurora Core Homen tekoälymoottoriksi",
      "Interaktiiviset työpöytäobjektit"
    ],
    completedMilestones: [
      "Virtuaalikodin pääkonsepti määritelty"
    ],
    notes: "Tuleva 3D-kotiympäristö jossa Aurora toivottaa vieraat ja käyttäjän tervetulleeksi."
  },
  "Järven Vartijat": {
    status: "Konseptointi & Visio",
    progress: 45,
    subProgress: { visual: 50, story: 70, audio: 40, testing: 10, code: 35 },
    priority: "Normaali",
    currentPhase: "Lore & Mytologinen Taustatarina",
    currentMilestone: "Selain- ja Unity-versioiden tekninen määrittely",
    nextMilestone: "Selain- ja Unity-versioiden tekninen määrittely",
    upcomingMilestone: "Vartijat-hahmojen suojeluvahvuudet & Kirjasarjan 1. luku",
    estimatedWork: "40 h",
    estimatedCompletion: "Joulukuu 2026",
    dependencies: "Suomalainen tarusto, pelimoottori",
    auroraRecommendation: "Syvennytään saaren vartijoiden taustatarinaan ja mytologiseen kronikkaan.",
    lastModified: "23.7.2026",
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
    status: "Studio, Opinnot & Portfolio",
    progress: 92,
    subProgress: { visual: 90, story: 90, audio: 88, testing: 85, code: 95 },
    priority: "Strateginen",
    currentPhase: "Studiobrändi & Akateeminen Avoin Väylä",
    currentMilestone: "Tutkintohaku avoimen väylän kautta (Xamk 21 op pohjalla)",
    nextMilestone: "Tutkintohaku avoimen väylän kautta (Xamk 21 op pohjalla)",
    upcomingMilestone: "Seuraavan Unity/Unreal-pelihankkeen esituotanto",
    estimatedWork: "Jatkuva kehitys",
    estimatedCompletion: "2026 - 2027",
    dependencies: "Xamk 21 op suoritusote, IVGC+ 33p, Microsoft C# (96.3%)",
    auroraRecommendation: "Ylläpidetään virallisten sertifikaattien ja peliportfolion yhteistä esittelyä.",
    lastModified: "23.7.2026",
    activeTasks: [
      "Haku tutkinto-opiskelijaksi avoimen väylän kautta (Xamk 21 op pohjalla)",
      "Pelistudiobrändin ja julkaisustrategian viimeistely",
      "Seuraavan Unity/Unreal-pelihankkeen esituotanto"
    ],
    completedMilestones: [
      "Virallinen Xamk-opintosuoritusote (21 op, 23.7.2026)",
      "IVGC+ / Cadgi 33 pisteellä suoritettu (11 moduulia)",
      "Google Project Management Professional & C# Microsoft Certification (96.3%)",
      "Epic Games Game Design & Elements of AI (2op)"
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
    const stored = localStorage.getItem("aurora_project_brain_v3");
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
    localStorage.setItem("aurora_project_brain_v3", JSON.stringify(updated));
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

        {/* Smart Project Timeline */}
        <div className="bg-stone-950/50 p-3.5 rounded-lg border border-amber-500/30 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="text-[11px] text-amber-400 font-serif tracking-wider font-semibold uppercase flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
              ÄLYKÄS PROJEKTIAIKAJANA (SMART PROJECT TIMELINE)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              {brain.currentPhase || brain.status}
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
                {brain.currentMilestone || brain.nextMilestone}
              </span>
              <span className="text-[9px] text-amber-400/80 block">Työn alla – {brain.estimatedWork || "15 h"}</span>
            </div>

            {/* Upcoming */}
            <div className="bg-stone-900/60 p-2.5 rounded border border-stone-800 space-y-1">
              <span className="text-stone-400 font-semibold block text-[9px] uppercase tracking-wider flex items-center gap-1">
                → Seuraava etappi
              </span>
              <span className="text-stone-300 font-serif text-[11px] block">
                {brain.upcomingMilestone || "Aamukatsaus & Teeman hiominen"}
              </span>
              <span className="text-[9px] text-stone-500 block">Suunnitteluvaiheessa</span>
            </div>

            {/* Completion */}
            <div className="bg-stone-900/60 p-2.5 rounded border border-stone-800 space-y-1">
              <span className="text-stone-400 font-semibold block text-[9px] uppercase tracking-wider flex items-center gap-1">
                🏁 Arvioitu valmistuminen
              </span>
              <span className="text-stone-200 font-mono text-xs block">
                {brain.estimatedCompletion || "Syyskuu 2026"}
              </span>
              <span className="text-[9px] text-stone-500 block">Status: Aikataulussa</span>
            </div>
          </div>
        </div>

        {/* Planning Center & Companion Recommendation */}
        <div className="bg-stone-950/50 p-3.5 rounded-lg border border-stone-800/60 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
            <span className="text-[11px] text-amber-400 font-serif tracking-wider font-semibold uppercase">
              AURORAN SUUNNITTELUKESKUS
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded">
              Prioriteetti: {brain.priority || "Korkea"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="bg-stone-900/40 p-2 rounded border border-stone-800/40">
              <span className="text-stone-500 block text-[9px] uppercase">Seuraava Etappi</span>
              <span className="text-stone-200 font-sans">{brain.nextMilestone || "Täsmennetään"}</span>
            </div>
            <div className="bg-stone-900/40 p-2 rounded border border-stone-800/40">
              <span className="text-stone-500 block text-[9px] uppercase">Arvioitu Jäljellä Oleva Työ</span>
              <span className="text-stone-200 font-sans">{brain.estimatedWork || "10-15 h"}</span>
            </div>
          </div>

          {brain.auroraRecommendation && (
            <div className="bg-amber-950/20 border border-amber-500/30 p-2.5 rounded text-amber-200 text-xs italic font-serif">
              <span className="not-italic font-semibold text-amber-400 block text-[10px] uppercase font-mono mb-0.5">
                ✦ Auroran kumppanisuositus
              </span>
              "{brain.auroraRecommendation}"
            </div>
          )}
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
