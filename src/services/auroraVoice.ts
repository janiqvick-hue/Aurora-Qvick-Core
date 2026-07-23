type SpeechListener = (speaking: boolean) => void;

class AuroraVoiceService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isVoiceOn: boolean = true;
  private voice: SpeechSynthesisVoice | null = null;
  private rate: number = 0.90; // Calm, warm conversational speed
  private pitch: number = 0.96; // Soft, warm natural tone
  private delayTimeoutId: any = null;
  private speechQueue: Array<{ text: string; pitchOffset?: number; rateOffset?: number }> = [];
  private isSpeakingQueue: boolean = false;
  private listeners: SpeechListener[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      const storedVoice = localStorage.getItem("aurora_voice_on");
      // Default to true if not explicitly turned off
      this.isVoiceOn = storedVoice !== "false";

      const storedRate = localStorage.getItem("aurora_voice_rate");
      if (storedRate) this.rate = parseFloat(storedRate);

      const storedPitch = localStorage.getItem("aurora_voice_pitch");
      if (storedPitch) this.pitch = parseFloat(storedPitch);

      this.initVoice();

      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoice();
        };
      }
    }
  }

  public subscribe(listener: SpeechListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(speaking: boolean) {
    this.listeners.forEach(l => l(speaking));
  }

  private initVoice() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    const storedVoiceName = localStorage.getItem("aurora_preferred_voice");
    if (storedVoiceName) {
      const match = voices.find(v => v.name === storedVoiceName);
      if (match) {
        this.voice = match;
        return;
      }
    }

    // Rank voices to select the highest-quality natural female Finnish voice
    const ranked = voices.map(v => {
      let score = 0;
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();

      // Primary requirement: Finnish language
      if (lang.startsWith("fi") || lang.includes("fi")) {
        score += 100;
      }

      // Preference for High Quality / Neural / Natural Speech Synthesis engines
      if (name.includes("neural") || name.includes("natural") || name.includes("online")) {
        score += 50;
      }
      if (name.includes("google") || name.includes("microsoft") || name.includes("azure")) {
        score += 30;
      }
      if (name.includes("heidi") || name.includes("selma") || name.includes("noora")) {
        score += 25;
      }
      if (name.includes("female") || name.includes("nainen")) {
        score += 20;
      }

      return { voice: v, score };
    });

    ranked.sort((a, b) => b.score - a.score);
    this.voice = ranked[0]?.voice || voices[0] || null;
  }

  public setVoiceOn(value: boolean) {
    this.isVoiceOn = value;
    localStorage.setItem("aurora_voice_on", value ? "true" : "false");
    if (!value) {
      this.stop();
    }
  }

  public getVoiceOn(): boolean {
    return this.isVoiceOn;
  }

  public getActiveVoice(): SpeechSynthesisVoice | null {
    return this.voice;
  }

  public setVoiceByName(name: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    const found = voices.find(v => v.name === name);
    if (found) {
      this.voice = found;
      localStorage.setItem("aurora_preferred_voice", name);
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === "undefined" || !window.speechSynthesis) return [];
    const voices = window.speechSynthesis.getVoices();
    
    // Sort so Finnish voices appear at the top
    return voices.slice().sort((a, b) => {
      const aFi = a.lang.toLowerCase().includes("fi");
      const bFi = b.lang.toLowerCase().includes("fi");
      if (aFi && !bFi) return -1;
      if (!aFi && bFi) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.7, Math.min(1.2, rate));
    localStorage.setItem("aurora_voice_rate", this.rate.toString());
  }

  public getRate(): number {
    return this.rate;
  }

  public setPitch(pitch: number) {
    this.pitch = Math.max(0.8, Math.min(1.2, pitch));
    localStorage.setItem("aurora_voice_pitch", this.pitch.toString());
  }

  public getPitch(): number {
    return this.pitch;
  }

  /**
   * Main speaking handler with:
   * 1. 1000ms calm initial pause before speaking (eye contact in cabin)
   * 2. Sentence-by-sentence queue with natural breaks
   * 3. Speech ducking notification
   * 4. Extensible emotion tag parsing
   */
  public speak(
    text: string, 
    onStart?: () => void, 
    onEnd?: () => void,
    delayMs: number = 1000
  ) {
    this.stop();

    if (!this.isVoiceOn || typeof window === "undefined" || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    // 1-second calm initial pause before starting speech
    this.delayTimeoutId = setTimeout(() => {
      // Process emotion tags (e.g. [huokaus], [hymy], [pohdiskelee]) for future extensibility
      const parsedClauses = this.parseEmotionAndClauses(text);

      if (parsedClauses.length === 0) {
        if (onEnd) onEnd();
        return;
      }

      this.notifyListeners(true);
      if (onStart) onStart();

      this.processSpeechQueue(parsedClauses, onEnd);
    }, delayMs);
  }

  /**
   * Parse text into natural clauses and sentence fragments
   */
  private parseEmotionAndClauses(rawText: string): Array<{ text: string; pitchOffset?: number; rateOffset?: number }> {
    // 1. Clean brackets and markdown
    let clean = rawText
      .replace(/[\*\_\#]/g, "")
      .trim();

    // Emotion cues parsing
    let pitchMod = 0;
    let rateMod = 0;

    if (clean.includes("[hymy]") || clean.includes("[iloinen]")) {
      pitchMod = 0.03;
      clean = clean.replace(/\[(hymy|iloinen)\]/gi, "");
    } else if (clean.includes("[pohdiskelee]") || clean.includes("[rauhallinen]")) {
      rateMod = -0.04;
      clean = clean.replace(/\[(pohdiskelee|rauhallinen)\]/gi, "");
    } else if (clean.includes("[huokaus]")) {
      clean = clean.replace(/\[huokaus\]/gi, "");
    }

    // Strip remaining brackets
    clean = clean.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").trim();

    if (!clean) return [];

    // Split text into natural short sentences or clauses for human-like rhythm
    const rawSentences = clean.split(/(?<=[.!?;\n])\s+/);
    const result: Array<{ text: string; pitchOffset?: number; rateOffset?: number }> = [];

    for (const s of rawSentences) {
      const trimmed = s.trim();
      if (trimmed.length > 0) {
        result.push({
          text: trimmed,
          pitchOffset: pitchMod,
          rateOffset: rateMod
        });
      }
    }

    return result;
  }

  private processSpeechQueue(
    queue: Array<{ text: string; pitchOffset?: number; rateOffset?: number }>,
    onEnd?: () => void
  ) {
    if (queue.length === 0) {
      this.isSpeakingQueue = false;
      this.notifyListeners(false);
      if (onEnd) onEnd();
      return;
    }

    this.isSpeakingQueue = true;
    const currentItem = queue.shift()!;

    const utterance = new SpeechSynthesisUtterance(currentItem.text);
    if (this.voice) {
      utterance.voice = this.voice;
    } else {
      utterance.lang = "fi-FI";
    }

    utterance.rate = Math.max(0.75, Math.min(1.15, this.rate + (currentItem.rateOffset || 0)));
    utterance.pitch = Math.max(0.85, Math.min(1.15, this.pitch + (currentItem.pitchOffset || 0)));

    utterance.onend = () => {
      // Natural 300ms pause between sentences
      this.delayTimeoutId = setTimeout(() => {
        this.processSpeechQueue(queue, onEnd);
      }, 350);
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e);
      this.processSpeechQueue(queue, onEnd);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public testVoice(sampleText: string = "Hei Jani. Sytytin takkaan hieman lisää puita. Tänään mökillä on todella rauhallista.") {
    this.speak(sampleText, undefined, undefined, 200);
  }

  public stop() {
    this.stopSpeaking();
  }

  public stopSpeaking() {
    if (this.delayTimeoutId) {
      clearTimeout(this.delayTimeoutId);
      this.delayTimeoutId = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.isSpeakingQueue = false;
    this.notifyListeners(false);
  }
}

export const auroraVoice = new AuroraVoiceService();
