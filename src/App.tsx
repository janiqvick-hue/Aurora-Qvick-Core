import { useState, useEffect, useCallback } from "react";
import { Project, Memory } from "./types";
import CinematicIntro from "./components/CinematicIntro";
import AuroraGateway from "./components/AuroraGateway";
import MemoryBrowser from "./components/MemoryBrowser";
import ProjectBrain from "./components/ProjectBrain";
import AuroraJournal from "./components/AuroraJournal";
import SettingsModal from "./components/SettingsModal";
import AboutAuroraModal from "./components/AboutAuroraModal";
import QvickGamesEcosystemModal from "./components/QvickGamesEcosystemModal";
import LivingCabinRoom from "./components/LivingCabinRoom";
import { auroraVoice } from "./services/auroraVoice";
import { livingStateEngine } from "./core/LivingStateEngine";
import { X } from "lucide-react";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Active project
  const [activeProject, setActiveProject] = useState<Project | null>({
    id: "proj-1",
    name: "Murhamysteeri Mökillä",
    description: "Qvick Games julkaistu lippulaivapeli: Murhamysteeri Mökillä (100% valmis)",
    isActive: true
  });

  // Navigation overlays
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'memory' | 'journal' | 'brain'>('none');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showEcosystemModal, setShowEcosystemModal] = useState(false);

  const [timeOfDay, setTimeOfDay] = useState<'aamu' | 'paiva' | 'ilta' | 'yo' | 'sade' | 'talvi'>('ilta');
  const [ambientSound, setAmbientSound] = useState(true);
  const [voiceOn, setVoiceOn] = useState(auroraVoice.getVoiceOn());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");

  useEffect(() => {
    const updateVoiceList = () => {
      const available = auroraVoice.getAvailableVoices();
      setVoices(available);
      const activeVoice = auroraVoice.getActiveVoice();
      if (activeVoice) {
        setSelectedVoiceName(activeVoice.name);
      } else if (available.length > 0) {
        setSelectedVoiceName(available[0].name);
        auroraVoice.setVoiceByName(available[0].name);
      }
    };

    updateVoiceList();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoiceList;
    }
  }, []);

  const handleVoiceChange = (name: string) => {
    setSelectedVoiceName(name);
    auroraVoice.setVoiceByName(name);
    localStorage.setItem("aurora_selected_voice_name", name);
  };

  const toggleVoice = () => {
    const newVal = !voiceOn;
    setVoiceOn(newVal);
    auroraVoice.setVoiceOn(newVal);
  };

  const handleUnlock = useCallback(() => setIsUnlocked(true), []);
  const handleCinematicEnter = useCallback(() => setShowIntro(false), []);

  const handleSelectProject = useCallback((proj: Project) => {
    setActiveProject(proj);
  }, []);

  const handleOpenNav = useCallback((nav: 'memory' | 'journal' | 'brain' | 'settings' | 'about' | 'ecosystem') => {
    if (nav === 'memory' || nav === 'journal' || nav === 'brain') {
      setActiveOverlay(nav);
    } else if (nav === 'settings') {
      setShowSettingsModal(true);
    } else if (nav === 'about') {
      setShowAboutModal(true);
    } else if (nav === 'ecosystem') {
      setShowEcosystemModal(true);
    }
  }, []);

  if (!isUnlocked) return <AuroraGateway onUnlock={handleUnlock} />;
  if (showIntro) return <CinematicIntro onEnter={handleCinematicEnter} />;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0604] text-[#f2e6d0] font-sans select-none flex flex-col">
      {/* Primary Living Cabin Engine Screen */}
      <LivingCabinRoom
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        onOpenNav={handleOpenNav}
      />


      {/* Modal Overlays for Deep Context (Memory, Journal, Brain) */}
      {activeOverlay !== 'none' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 md:p-8 animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#18110b] border border-[#d4af37]/40 rounded-2xl p-6 shadow-2xl overflow-y-auto font-serif">
            <button
              onClick={() => setActiveOverlay('none')}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-amber-300 border border-[#3d2b1d] rounded-full transition-colors cursor-pointer"
              title="Palaa mökille"
            >
              <X className="w-5 h-5" />
            </button>

            {activeOverlay === 'memory' && (
              <MemoryBrowser onMemoriesChange={() => {}} />
            )}

            {activeOverlay === 'journal' && (
              <AuroraJournal />
            )}

            {activeOverlay === 'brain' && (
              <ProjectBrain activeProject={activeProject} onSelectProject={(p) => setActiveProject(p)} />
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        ambientSound={ambientSound}
        toggleAmbientSound={() => setAmbientSound(!ambientSound)}
        voiceOn={voiceOn}
        toggleVoice={toggleVoice}
        voices={voices}
        selectedVoiceName={selectedVoiceName}
        handleVoiceChange={handleVoiceChange}
      />

      {/* About Aurora Modal */}
      <AboutAuroraModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Qvick Games Studio OS Ecosystem Modal */}
      <QvickGamesEcosystemModal
        isOpen={showEcosystemModal}
        onClose={() => setShowEcosystemModal(false)}
        onSelectProject={(projName) => setActiveProject({ id: `proj-${Date.now()}`, name: projName, description: `Aktiivinen hanke: ${projName}`, isActive: true })}
      />
    </div>
  );
}
