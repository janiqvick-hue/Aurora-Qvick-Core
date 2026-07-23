import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Wind, Waves, Compass, Play } from "lucide-react";

interface CinematicIntroProps {
  onEnter: () => void;
}

export default function CinematicIntro({ onEnter }: CinematicIntroProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Staggered presentation of the greeting lines
    const timer1 = setTimeout(() => setStep(1), 2000); // "Hei Jani."
    const timer2 = setTimeout(() => setStep(2), 5000); // "Mukava nähdä sinua taas."
    const timer3 = setTimeout(() => setStep(3), 8500); // "Mitä rakennamme tänään?"
    const timer4 = setTimeout(() => setStep(4), 11500); // Reveal CTA button

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div
      id="cinematic-intro-root"
      className="relative min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none"
    >
      {/* Decorative Warm Cabin Background Glows */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-900/10 rounded-full blur-[120px] animate-warm-glow pointer-events-none" />
      <div className="absolute top-12 left-12 w-[300px] h-[300px] bg-stone-900/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Sparks/Embers Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 bg-amber-500/20 rounded-full animate-spark"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 8 + 8}s`,
            }}
          />
        ))}
      </div>

      {/* Header Info - Mökki Environment Details (Text Placeholders) */}
      <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-900 pb-6 gap-4 z-10">
        <div className="flex items-center gap-3">
          <Compass className="w-5 h-5 text-amber-500/80 animate-spin" style={{ animationDuration: '30s' }} />
          <div>
            <h2 className="font-serif tracking-wider text-xs uppercase text-stone-400">Aurora Qvick Core</h2>
            <p className="text-[10px] font-mono text-stone-500">Mökki Node v0.1 • Suomi</p>
          </div>
        </div>

        {/* Ambient status placeholders */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-400">
          <div className="flex items-center gap-1.5 bg-stone-900/50 px-2.5 py-1 rounded border border-stone-800/60">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Takka loimuaa lempeästi</span>
          </div>
          <div className="flex items-center gap-1.5 bg-stone-900/50 px-2.5 py-1 rounded border border-stone-800/60">
            <Waves className="w-3.5 h-3.5 text-blue-400/80" />
            <span>Järvi on tyyni ja tumma</span>
          </div>
          <div className="flex items-center gap-1.5 bg-stone-900/50 px-2.5 py-1 rounded border border-stone-800/60">
            <Wind className="w-3.5 h-3.5 text-stone-500" />
            <span>Humina männynlatvoissa</span>
          </div>
        </div>
      </div>

      {/* Centerpiece: The Animated Dialogue Sequence */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 max-w-3xl mx-auto text-center z-10">
        <div className="space-y-8 min-h-[220px] flex flex-col justify-center">
          <AnimatePresence>
            {step >= 1 && (
              <motion.h1
                id="intro-line-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="font-serif text-3xl md:text-5xl text-stone-100 tracking-wide font-light"
              >
                "Hei Jani."
              </motion.h1>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 2 && (
              <motion.p
                id="intro-line-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="text-stone-300 text-lg md:text-2xl font-light tracking-wide italic font-serif"
              >
                "Mukava nähdä sinua taas."
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 3 && (
              <motion.p
                id="intro-line-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="text-amber-400 text-xl md:text-3xl font-serif tracking-widest font-normal"
              >
                "Mitä rakennamme tänään?"
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button: Sit by the fireplace */}
        <div className="h-20 mt-8 flex items-center justify-center">
          <AnimatePresence>
            {step >= 4 && (
              <motion.button
                id="intro-enter-btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                onClick={onEnter}
                className="group relative px-8 py-3.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 rounded text-amber-400 text-sm tracking-widest uppercase font-serif transition-all duration-300 flex items-center gap-2.5 shadow-[0_0_20px_rgba(245,158,11,0.05)] cursor-pointer hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="w-4 h-4 fill-amber-400/20 group-hover:fill-amber-400/40 transition-all" />
                  Astu sisään mökkiin
                </span>
                <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded blur-md" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer - Skip button & Atmospheric sound toggles */}
      <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center border-t border-stone-900 pt-6 gap-4 text-xs font-mono text-stone-500 z-10">
        <div>
          <span>© Qvick Games • Luova tila</span>
        </div>
        <div>
          {step < 4 && (
            <button
              id="intro-skip-btn"
              onClick={onEnter}
              className="text-stone-500 hover:text-amber-400 transition-colors tracking-wider uppercase text-[10px] cursor-pointer"
            >
              Ohita intro »
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
