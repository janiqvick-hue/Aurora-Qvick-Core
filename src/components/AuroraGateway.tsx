import { useState, useEffect, useCallback, memo } from "react";
import { X, Settings, Sun, Lock, Flame, Volume2, VolumeX } from "lucide-react";
import { GatewayEnvironment } from "./gateway/GatewayEnvironment";
import { GatewayStatus } from "./gateway/GatewayStatus";
import { CabinAccessJournal } from "./gateway/CabinAccessJournal";
import { GatewayAmbientControls } from "./gateway/GatewayAmbientControls";
import { auroraVoice } from "../services/auroraVoice";
import { useLoppiWeather } from "../hooks/useLoppiWeather";

interface AuroraGatewayProps {
  onUnlock: () => void;
}

export default memo(function AuroraGateway({ onUnlock }: AuroraGatewayProps) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { cabinEnvironment } = useLoppiWeather();

  // Modals state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showMemoriesModal, setShowMemoriesModal] = useState(false);

  // Gateway Audio Settings
  const [ambientSound, setAmbientSound] = useState(true);
  const [voiceOn, setVoiceOn] = useState(auroraVoice.getVoiceOn());

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSettingsModal(false);
        setShowSummaryModal(false);
        setShowMemoriesModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleUnlockSuccess = useCallback(() => {
    setIsUnlocking(true);
    if (voiceOn) {
      auroraVoice.speak("Tervetuloa takaisin, Jani. Mökki on valmiina.");
    }
    setTimeout(() => {
      onUnlock();
    }, 2200);
  }, [voiceOn, onUnlock]);

  const handleOpenSettings = useCallback(() => setShowSettingsModal(true), []);
  const handleOpenSummary = useCallback(() => setShowSummaryModal(true), []);
  const handleOpenMemories = useCallback(() => setShowMemoriesModal(true), []);

  return (
    <div
      id="aurora-gateway-root"
      className="relative min-h-screen w-full bg-[#080503] text-[#f2e6d0] font-sans overflow-hidden select-none flex flex-col justify-between"
    >
      {/* 1. Full Cabin Interior Environment with Reference Background & Seated Aurora */}
      <GatewayEnvironment
        isUnlocking={isUnlocking}
        cabinEnvironment={cabinEnvironment}
      />

      {/* 2. Top Minimalist Status (Integrated Logo, Welcome Message, Mood & Clock) */}
      <GatewayStatus />

      {/* 3. Center Physical Leather Access Notebook on Desk */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-2 flex flex-col justify-end items-center my-auto">
        <CabinAccessJournal
          onSuccess={handleUnlockSuccess}
          isUnlocking={isUnlocking}
        />
      </main>

      {/* 4. Ambient Engraved Brass/Wood Bottom Controls */}
      <GatewayAmbientControls
        onOpenSettings={handleOpenSettings}
        onOpenSummary={handleOpenSummary}
        onOpenMemories={handleOpenMemories}
      />


      {/* 5. Modals for Bottom Actions */}

      {/* Asetukset Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1c140d] border border-[#d4af37]/30 rounded-2xl max-w-md w-full p-6 shadow-2xl text-[#e8dfd1] space-y-5">
            <div className="flex justify-between items-center border-b border-[#3d2b1d] pb-3">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Settings className="w-5 h-5" />
                <h3 className="font-serif tracking-wider text-sm font-semibold">
                  Mökkitoimiston Asetukset
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
                aria-label="Sulje asetukset"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center bg-[#140e09] border border-[#3d2b1d] p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Taustaäänet (Takka & Järvi)</span>
                </div>
                <button
                  onClick={() => setAmbientSound(!ambientSound)}
                  className={`px-3 py-1 rounded font-mono cursor-pointer ${
                    ambientSound
                      ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                      : "bg-stone-900 border border-stone-800 text-stone-500"
                  }`}
                >
                  {ambientSound ? "PÄÄLLÄ" : "POIS"}
                </button>
              </div>

              <div className="flex justify-between items-center bg-[#140e09] border border-[#3d2b1d] p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  {voiceOn ? (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-stone-500" />
                  )}
                  <span>Auroran Puheääni (TTS)</span>
                </div>
                <button
                  onClick={() => {
                    const next = !voiceOn;
                    setVoiceOn(next);
                    auroraVoice.setVoiceOn(next);
                  }}
                  className={`px-3 py-1 rounded font-mono cursor-pointer ${
                    voiceOn
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                      : "bg-stone-900 border border-stone-800 text-stone-500"
                  }`}
                >
                  {voiceOn ? "PÄÄLLÄ" : "POIS"}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-amber-300 rounded-lg text-xs font-serif cursor-pointer hover:bg-[#d4af37]/30"
              >
                Sulje
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Päivän Yhteenveto Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1c140d] border border-[#d4af37]/30 rounded-2xl max-w-md w-full p-6 shadow-2xl text-[#e8dfd1] space-y-4">
            <div className="flex justify-between items-center border-b border-[#3d2b1d] pb-3">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Sun className="w-5 h-5" />
                <h3 className="font-serif tracking-wider text-sm font-semibold">
                  Päivän yhteenveto
                </h3>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
                aria-label="Sulje"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 font-serif text-xs text-stone-300 leading-relaxed">
              <p className="text-amber-200 font-medium">
                Päivän työtila avautuu, kun astut sisään.
              </p>
              <p>
                Aurora on valmistellut päivän peli-ideat, tehtävälistat ja muistiinpanot mökkitoimistoon. Syötä pääsykoodi muistikirjaan avataksesi koko näkymän.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-amber-300 rounded-lg text-xs font-serif cursor-pointer hover:bg-[#d4af37]/30"
              >
                Selvä
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Muistit Modal */}
      {showMemoriesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1c140d] border border-[#d4af37]/30 rounded-2xl max-w-md w-full p-6 shadow-2xl text-[#e8dfd1] space-y-4">
            <div className="flex justify-between items-center border-b border-[#3d2b1d] pb-3">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif tracking-wider text-sm font-semibold">
                  Auroran muistojen kirja
                </h3>
              </div>
              <button
                onClick={() => setShowMemoriesModal(false)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
                aria-label="Sulje"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 font-serif text-xs text-stone-300 leading-relaxed">
              <p className="text-amber-200 font-medium">
                Auroran muistojen kirja avautuu, kun olet astunut sisään.
              </p>
              <p>
                Pääset lukemaan tallennettuja muistoja, oivalluksia ja yhteistä historiaa heti onnistuneen kirjautumisen jälkeen.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMemoriesModal(false)}
                className="px-4 py-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-amber-300 rounded-lg text-xs font-serif cursor-pointer hover:bg-[#d4af37]/30"
              >
                Sulje
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Cinematic Unlocking Overlay Transition */}
      {isUnlocking && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000">
          <div className="text-center space-y-3 p-6">
            <p className="text-[#d4af37] font-serif text-base md:text-lg italic tracking-[0.2em] uppercase animate-pulse">
              "Mökki herää... Tervetuloa kotiin."
            </p>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
});

