import { useState, useEffect } from "react";
import { IdleActivity } from "../types";
import { Compass, Flame, Volume2, VolumeX } from "lucide-react";
import { livingStateEngine, AuroraState } from "../core/LivingStateEngine";
import { useAuroraPresence } from "../core/AuroraPresence";
import AuroraWebAvatar from "./AuroraWebAvatar";

interface CabinOfficeProps {
  timeOfDay: 'aamu' | 'paiva' | 'ilta' | 'yo' | 'sade' | 'talvi';
  currentActivity: IdleActivity;
  isThinking: boolean;
  ambientSound: boolean;
  toggleAmbientSound: () => void;
  isListeningSpeech?: boolean;
}

const cabinOfficeImage = "/aurora.png";

export default function CabinOffice({ 
  timeOfDay, 
  currentActivity, 
  isThinking,
  ambientSound,
  toggleAmbientSound,
  isListeningSpeech = false
}: CabinOfficeProps) {
  const [state, setState] = useState<AuroraState>(livingStateEngine.getState());

  useEffect(() => {
    const unsubscribe = livingStateEngine.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  const presence = useAuroraPresence(state);

  return (
    <div 
      id="cabin-office-viewport" 
      className="relative w-full h-[360px] md:h-[420px] bg-[#0c0907] border-b border-[#3d3428]/80 overflow-hidden select-none p-0 m-0"
    >
      {/* Custom localized animations */}
      <style>{`
        @keyframes subtle-breath {
          0%, 100% { transform: scale(1.01); }
          50% { transform: scale(1.04); }
        }
        @keyframes fireplace-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); filter: blur(40px); }
          50% { opacity: 0.35; transform: scale(1.2); filter: blur(50px); }
        }
        .animate-breath {
          animation: subtle-breath 22s ease-in-out infinite;
        }
        .animate-fireplace {
          animation: fireplace-pulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Cinematic Cabin Office Image with Breathing effect */}
      <img 
        src={cabinOfficeImage} 
        alt="Aurora's Cabin Office" 
        className="absolute inset-0 w-full h-full object-cover object-center animate-breath"
        referrerPolicy="no-referrer"
      />

      {/* Subtle Warm Fireplace Glow Overlay */}
      <div className="absolute left-0 bottom-4 w-[40%] h-[70%] bg-gradient-radial from-amber-600/40 via-orange-600/10 to-transparent rounded-full animate-fireplace pointer-events-none mix-blend-screen" />

      {/* Dark gradient overlay for pristine readability of top & bottom text overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/60 pointer-events-none" />

      {/* Dynamic Aurora Living Avatar Presence */}
      <AuroraWebAvatar isThinking={isThinking} isListeningSpeech={isListeningSpeech} />

      {/* Floating Status / Info HUD overlay */}
      <div className="absolute top-4 right-4 bg-black/65 backdrop-blur-md border border-white/10 rounded p-2.5 text-stone-300 text-[10px] space-y-1 w-[160px] z-10 shadow-lg">
        <div className="flex items-center justify-between text-[#d4af37] font-semibold border-b border-[#3d3428]/50 pb-1 uppercase tracking-wider">
          <span>Ympäristö</span>
          <Compass className="w-3 h-3 text-[#d4af37] animate-spin" style={{ animationDuration: '25s' }} />
        </div>
        <div className="space-y-1 font-mono text-[9px]">
          <div className="flex justify-between">
            <span className="text-stone-500">Aika:</span>
            <span className="text-amber-500 uppercase font-semibold">{timeOfDay}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Tila:</span>
            <span className="text-stone-200">{isThinking ? 'Keskittynyt' : 'Levollinen'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500">Ääni:</span>
            <button 
              onClick={toggleAmbientSound}
              className="flex items-center gap-1 text-[#d4af37] hover:text-white transition-colors"
            >
              {ambientSound ? (
                <>
                  <Volume2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 text-[8.5px]">PÄÄLLÄ</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 text-stone-400" />
                  <span className="text-stone-400 text-[8.5px]">POIS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Activity description HUD footer */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-lg flex justify-between items-center text-[10px] z-10 shadow-xl">
        <div className="flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <div>
            <span className="text-[#d4af37] font-mono font-bold text-[9px] uppercase tracking-wider mr-2">Mökissä:</span>
            <span className="text-stone-100 font-light text-xs">{currentActivity.description}</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[9px] text-stone-400 font-mono">
          <span>AURORA CORE v1.0</span>
        </div>
      </div>
    </div>
  );
}
