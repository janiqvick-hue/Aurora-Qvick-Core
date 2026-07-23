import { useState, useEffect } from "react";
import { emotionEngine, EmotionInfo } from "../core/EmotionEngine";
import { presenceEngine2, PresenceAction } from "../core/PresenceEngine2";
import { livingPresenceEngine } from "../core/living/LivingPresenceEngine";

interface AuroraWebAvatarProps {
  isThinking: boolean;
  isListeningSpeech: boolean;
}

export default function AuroraWebAvatar({
  isThinking,
  isListeningSpeech
}: AuroraWebAvatarProps) {
  const [isEntering, setIsEntering] = useState(true);
  const [emotion, setEmotion] = useState<EmotionInfo>(emotionEngine.getEmotion());
  const [presenceAction, setPresenceAction] = useState<PresenceAction>(presenceEngine2.getAction());
  const [isBlinking, setIsBlinking] = useState(false);

  const isActive = isThinking || isListeningSpeech;

  useEffect(() => {
    // 2-second elegant entrance duration
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubEmotion = emotionEngine.subscribe((emo) => setEmotion(emo));
    const unsubPresence = presenceEngine2.subscribe((act) => setPresenceAction(act));
    return () => {
      unsubEmotion();
      unsubPresence();
    };
  }, []);

  // Occasional organic blinking cycle (every 4-8 seconds)
  useEffect(() => {
    let timerId: any;
    const triggerOrganicBlink = () => {
      const nextInterval = 4000 + Math.random() * 4000;
      timerId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 180);
        triggerOrganicBlink();
      }, nextInterval);
    };
    triggerOrganicBlink();
    return () => clearTimeout(timerId);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden">
      {/* Soft Fireplace Glow Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-950/20 via-orange-950/10 to-transparent pointer-events-none animate-fireplaceFlicker" />

      {/* Emotion & Presence Badge Pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto bg-[#0b0603]/85 border border-[#3d2b1d]/80 px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 text-[11px] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        <span className="text-xs">{emotion.emoji}</span>
        <span className={`font-semibold ${emotion.colorClass}`}>{emotion.label}</span>
        <span className="text-stone-600">•</span>
        <span className="text-stone-300 italic">{presenceAction.label}</span>
      </div>

      {/* Avatar Container with Organic Motion */}
      <div
        className={`
          absolute
          bottom-[-10px]
          left-[42%]
          -translate-x-1/2
          w-[260px]
          md:w-[320px]
          transition-all
          ease-out
        `}
        style={{
          transitionDuration: isEntering ? "2200ms" : "700ms",
          opacity: isEntering ? 0 : (isActive ? 1 : 0.96),
          transform: isEntering
            ? "translateX(-50%) scale(0.98) translateY(8px)"
            : `translateX(-50%) scale(${isActive ? 1.02 : 1.0}) translateY(0px)`,
          animation: isEntering ? "none" : `auroraNaturalPresence ${presenceAction.breathingRate || 5.5}s ease-in-out infinite`,
          filter: isEntering
            ? "none"
            : isActive
              ? `drop-shadow(0 0 26px rgba(212,175,55,0.45)) drop-shadow(0 18px 30px rgba(0,0,0,0.7))`
              : `drop-shadow(0 0 18px rgba(212,175,55,0.25)) drop-shadow(0 16px 28px rgba(0,0,0,0.65))`,
        }}
      >
        {/* Warm Fireplace Backlight Glow */}
        <div className="absolute inset-x-4 bottom-8 h-40 bg-amber-600/15 rounded-full blur-2xl animate-fireplaceFlicker pointer-events-none" />

        <div className="relative">
          <img
            src="/aurora.png"
            alt="Aurora Qvick"
            className={`w-full h-auto object-contain transition-all duration-200 ${isBlinking ? "brightness-95 contrast-105" : ""}`}
            draggable={false}
            referrerPolicy="no-referrer"
          />

          {/* Micro eye blink overlay effect for realism */}
          {isBlinking && (
            <div className="absolute top-[28%] left-[38%] w-[24%] h-[4%] bg-[#2a170a]/60 rounded-full blur-[1px] pointer-events-none transition-all duration-150" />
          )}
        </div>
      </div>

      <style>{`
        @keyframes auroraNaturalPresence {
          0%, 100% {
            transform: translateX(-50%) translateY(0px) scale(1) rotate(0deg);
          }
          50% {
            transform: translateX(-50%) translateY(-3.5px) scale(1.01) rotate(0.15deg);
          }
        }

        @keyframes fireplaceFlicker {
          0%, 100% {
            opacity: 0.18;
            transform: scale(1);
          }
          25% {
            opacity: 0.26;
            transform: scale(1.02);
          }
          50% {
            opacity: 0.14;
            transform: scale(0.99);
          }
          75% {
            opacity: 0.22;
            transform: scale(1.01);
          }
        }

        .animate-fireplaceFlicker {
          animation: fireplaceFlicker 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}


