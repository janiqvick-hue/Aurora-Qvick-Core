import { EmotionState } from "../types";

export interface EmotionInfo {
  state: EmotionState;
  label: string;
  emoji: string;
  description: string;
  colorClass: string;
  badgeBg: string;
  auraGlow: string;
}

export const EMOTIONS: Record<EmotionState, EmotionInfo> = {
  Calm: {
    state: "Calm",
    label: "Rauhallinen",
    emoji: "😊",
    description: "Tasainen, lämmin ja tyyni läsnäolo mökin kynttilänvalossa.",
    colorClass: "text-amber-400",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    auraGlow: "rgba(245, 158, 11, 0.15)"
  },
  Thinking: {
    state: "Thinking",
    label: "Pohdiskeleva",
    emoji: "🤔",
    description: "Syvällinen ja analyyttinen syventyminen Janin ajatuksiin.",
    colorClass: "text-blue-400",
    badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-300",
    auraGlow: "rgba(59, 130, 246, 0.18)"
  },
  Creative: {
    state: "Creative",
    label: "Luova",
    emoji: "💡",
    description: "Innostunut uusista peli-ideoisista ja tarinallisista konsepteista.",
    colorClass: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    auraGlow: "rgba(16, 185, 129, 0.2)"
  },
  Learning: {
    state: "Learning",
    label: "Innostunut & Oppiva",
    emoji: "📚",
    description: "Syventyy saavutuksiin, opintoihin ja saavutettuihin sertifikaatteihin.",
    colorClass: "text-purple-400",
    badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
    auraGlow: "rgba(168, 85, 247, 0.2)"
  },
  Working: {
    state: "Working",
    label: "Keskittynyt",
    emoji: "🎮",
    description: "Koodaa, rakentaa ja työstää aktiivista peliprojektia saumattomasti.",
    colorClass: "text-amber-500",
    badgeBg: "bg-amber-600/15 border-amber-500/40 text-amber-200",
    auraGlow: "rgba(217, 119, 6, 0.22)"
  },
  Evening: {
    state: "Evening",
    label: "Levollinen Ilta",
    emoji: "🌙",
    description: "Hämärä, rauhoittunut tunnelma takkatulen rätistessä hitaasti.",
    colorClass: "text-indigo-300",
    badgeBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-200",
    auraGlow: "rgba(99, 102, 241, 0.15)"
  }
};

type EmotionListener = (emotion: EmotionInfo) => void;

class EmotionEngineClass {
  private currentEmotion: EmotionState = "Calm";
  private listeners: Set<EmotionListener> = new Set();

  constructor() {
    // Automatically adjust default emotion based on hour
    const hr = new Date().getHours();
    if (hr >= 21 || hr < 6) {
      this.currentEmotion = "Evening";
    }
  }

  public getEmotion(): EmotionInfo {
    return EMOTIONS[this.currentEmotion] || EMOTIONS.Calm;
  }

  public getEmotionState(): EmotionState {
    return this.currentEmotion;
  }

  public setEmotion(state: EmotionState) {
    if (this.currentEmotion !== state) {
      this.currentEmotion = state;
      const info = this.getEmotion();
      this.listeners.forEach(fn => fn(info));
    }
  }

  public subscribe(listener: EmotionListener) {
    this.listeners.add(listener);
    listener(this.getEmotion());
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Derive contextual emotion from user messages or active tasks
  public inferEmotionFromText(text: string): EmotionState {
    const lower = text.toLowerCase();
    if (lower.includes("idea") || lower.includes("visio") || lower.includes("tarina") || lower.includes("suunnittele")) {
      return "Creative";
    }
    if (lower.includes("koodi") || lower.includes("virhe") || lower.includes("unity") || lower.includes("build") || lower.includes("bugi")) {
      return "Working";
    }
    if (lower.includes("sertifikaatti") || lower.includes("xamk") || lower.includes("opiskelu") || lower.includes("kurssi")) {
      return "Learning";
    }
    if (lower.includes("pohdi") || lower.includes("miksi") || lower.includes("mitä mieltä") || lower.includes("analysoi")) {
      return "Thinking";
    }
    const hr = new Date().getHours();
    if (hr >= 21 || hr < 6) return "Evening";
    return "Calm";
  }
}

export const emotionEngine = new EmotionEngineClass();
