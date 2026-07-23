import { useState, useEffect } from "react";
import { emotionEngine, EmotionInfo } from "../core/EmotionEngine";
import { presenceEngine2, PresenceAction } from "../core/PresenceEngine2";

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

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10">
      {/* Emotion & Presence Badge Pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto bg-stone-950/80 border border-stone-800/80 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2 text-[10px] font-mono shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        <span className="text-xs">{emotion.emoji}</span>
        <span className={`font-medium ${emotion.colorClass}`}>{emotion.label}</span>
        <span className="text-stone-600">•</span>
        <span className="text-stone-400 italic">{presenceAction.label}</span>
      </div>

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
          opacity: isEntering ? 0 : (isActive ? 1 : 0.95),
          transform: isEntering
            ? "translateX(-50%) scale(0.98) translateY(8px)"
            : `translateX(-50%) scale(${isActive ? 1.02 : 1.0}) translateY(0px)`,
          animation: isEntering ? "none" : `auroraBreathing ${presenceAction.breathingRate || 6}s ease-in-out infinite`,
          filter: isEntering
            ? "none"
            : isActive
              ? `drop-shadow(0 0 24px ${emotion.auraGlow}) drop-shadow(0 18px 30px rgba(0,0,0,0.65))`
              : `drop-shadow(0 0 16px ${emotion.auraGlow}) drop-shadow(0 16px 28px rgba(0,0,0,0.6))`,
        }}
      >
        <img
          src="/aurora.png"
          alt="Aurora Qvick"
          className="w-full h-auto object-contain"
          draggable={false}
          referrerPolicy="no-referrer"
        />
      </div>

      <style>{`
        @keyframes auroraBreathing {
          0%, 100% {
            transform: translateX(-50%) translateY(0px) scale(1);
          }
          50% {
            transform: translateX(-50%) translateY(-4px) scale(1.012);
          }
        }
      `}</style>
    </div>
  );
}

