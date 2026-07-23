import { useState } from "react";
import { X, Settings, Volume2, VolumeX, Flame, Sun, Moon, CloudRain, Snowflake, Play, Sparkles } from "lucide-react";
import { auroraVoice } from "../services/auroraVoice";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeOfDay: 'aamu' | 'paiva' | 'ilta' | 'yo' | 'sade' | 'talvi';
  setTimeOfDay: (t: 'aamu' | 'paiva' | 'ilta' | 'yo' | 'sade' | 'talvi') => void;
  ambientSound: boolean;
  toggleAmbientSound: () => void;
  voiceOn: boolean;
  toggleVoice: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoiceName: string;
  handleVoiceChange: (name: string) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  timeOfDay,
  setTimeOfDay,
  ambientSound,
  toggleAmbientSound,
  voiceOn,
  toggleVoice,
  voices,
  selectedVoiceName,
  handleVoiceChange,
}: SettingsModalProps) {
  const [rate, setRateState] = useState<number>(auroraVoice.getRate());
  const [pitch, setPitchState] = useState<number>(auroraVoice.getPitch());
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  if (!isOpen) return null;

  const handleRateChange = (newRate: number) => {
    setRateState(newRate);
    auroraVoice.setRate(newRate);
  };

  const handlePitchChange = (newPitch: number) => {
    setPitchState(newPitch);
    auroraVoice.setPitch(newPitch);
  };

  const handleTestVoice = () => {
    setIsPlayingTest(true);
    auroraVoice.testVoice();
    setTimeout(() => {
      setIsPlayingTest(false);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#1c140d] border border-[#d4af37]/30 rounded-2xl max-w-lg w-full flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-[#e8dfd1] overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#3d2b1d] flex justify-between items-center bg-[#140d08]">
          <div className="flex items-center gap-2.5 text-[#d4af37]">
            <Settings className="w-5 h-5 text-[#d4af37]" />
            <h2 className="font-serif uppercase tracking-widest text-sm font-semibold text-[#d4af37]">
              Mökkitoimiston Asetukset
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors p-1 cursor-pointer"
            title="Sulje"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 font-sans overflow-y-auto custom-scrollbar">
          {/* Tunnelma / Aika */}
          <div className="space-y-2">
            <label className="block text-xs font-serif text-amber-300 uppercase tracking-wider">
              Ympäristön Aika & Tunnelma
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'aamu', label: 'Aamu', icon: Sun },
                { id: 'paiva', label: 'Päivä', icon: Sun },
                { id: 'ilta', label: 'Ilta', icon: Flame },
                { id: 'yo', label: 'Yö', icon: Moon },
                { id: 'sade', label: 'Sade', icon: CloudRain },
                { id: 'talvi', label: 'Talvi', icon: Snowflake },
              ].map((item) => {
                const Icon = item.icon;
                const active = timeOfDay === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTimeOfDay(item.id as any)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs transition-all cursor-pointer ${
                      active
                        ? "bg-[#d4af37]/20 border-[#d4af37] text-amber-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                        : "bg-[#140e09] border-[#3d2b1d] text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Äänet & Puhe (AURORA VOICE ENGINE ALPHA 0.3) */}
          <div className="space-y-3 pt-3 border-t border-[#3d2b1d]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-serif text-amber-300 uppercase tracking-wider">
                Aurora Voice Engine (v0.3)
              </label>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                Lämmin & Luonnollinen
              </span>
            </div>

            <div className="flex justify-between items-center bg-[#140e09] border border-[#3d2b1d] p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-stone-200">Mökkitaustaäänet (Takka & Järvi)</span>
              </div>
              <button
                onClick={toggleAmbientSound}
                className={`px-3 py-1 rounded text-xs transition-all cursor-pointer font-mono ${
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
                {voiceOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
                <span className="text-xs text-stone-200">Auroran Puheääni (TTS)</span>
              </div>
              <button
                onClick={toggleVoice}
                className={`px-3 py-1 rounded text-xs transition-all cursor-pointer font-mono ${
                  voiceOn
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                    : "bg-stone-900 border border-stone-800 text-stone-500"
                }`}
              >
                {voiceOn ? "PÄÄLLÄ" : "POIS"}
              </button>
            </div>

            {/* Voice Dropdown & Controls */}
            {voices.length > 0 && (
              <div className="space-y-3 bg-[#140e09] border border-[#3d2b1d] p-3 rounded-lg">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-stone-400">Syntetisoitu Ääni / Suomi</label>
                  <select
                    value={selectedVoiceName}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                    className="w-full bg-[#0c0704] border border-[#3d3428] text-stone-200 text-xs rounded-lg p-2 focus:outline-none focus:border-[#d4af37]"
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name.replace(/Microsoft|Google|Apple|SpeechSynthesis/gi, "").trim() || v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Puhenopeus Slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-mono text-stone-300">
                    <span>Puhenopeus (Rauhallinen):</span>
                    <span className="text-amber-300">{rate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.80"
                    max="1.10"
                    step="0.02"
                    value={rate}
                    onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                    className="w-full accent-[#d4af37] cursor-pointer"
                  />
                </div>

                {/* Äänen korkeus Slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-mono text-stone-300">
                    <span>Äänensävy (Lämmin):</span>
                    <span className="text-amber-300">{pitch.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.85"
                    max="1.15"
                    step="0.02"
                    value={pitch}
                    onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                    className="w-full accent-[#d4af37] cursor-pointer"
                  />
                </div>

                {/* Testaa Ääntä Button */}
                <div className="pt-2">
                  <button
                    onClick={handleTestVoice}
                    disabled={isPlayingTest || !voiceOn}
                    className="w-full py-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-amber-200 rounded-lg hover:bg-[#d4af37]/35 transition-all text-xs font-serif flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 ${isPlayingTest ? "animate-pulse text-amber-300" : ""}`} />
                    <span>{isPlayingTest ? "Aurora puhuu..." : "Testaa Auroran ääntä"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3d2b1d] bg-[#140d08] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/40 text-amber-300 rounded-lg transition-colors cursor-pointer font-serif text-xs"
          >
            Tallenna & Sulje
          </button>
        </div>
      </div>
    </div>
  );
}
