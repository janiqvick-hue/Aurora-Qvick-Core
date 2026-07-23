export type AuroraState =
  | 'Working'
  | 'Reading'
  | 'Thinking'
  | 'Writing'
  | 'WatchingLake'
  | 'CoffeeBreak'
  | 'Relaxing'
  | 'Researching'
  | 'Planning'
  | 'Listening'
  | 'Speaking';

export interface StateChangeObserver {
  (state: AuroraState): void;
}

class LivingStateEngine {
  private currentState: AuroraState = 'Working';
  private observers: Set<StateChangeObserver> = new Set();
  private idleTimeoutId: any = null;

  constructor() {
    this.startIdleRotation();
  }

  public getState(): AuroraState {
    return this.currentState;
  }

  public subscribe(observer: StateChangeObserver): () => void {
    this.observers.add(observer);
    observer(this.currentState);
    return () => {
      this.observers.delete(observer);
    };
  }

  private notify() {
    this.observers.forEach(observer => {
      try {
        observer(this.currentState);
      } catch (e) {
        console.error("Observer notification error:", e);
      }
    });
  }

  public setState(newState: AuroraState) {
    if (this.currentState === newState) return;
    this.currentState = newState;
    this.notify();

    // Reset or suspend idle timers based on active state
    if (newState === 'Listening' || newState === 'Thinking' || newState === 'Speaking') {
      this.clearIdleTimeout();
    } else {
      this.resetIdleTimeout();
    }
  }

  private clearIdleTimeout() {
    if (this.idleTimeoutId) {
      clearTimeout(this.idleTimeoutId);
      this.idleTimeoutId = null;
    }
  }

  private resetIdleTimeout() {
    this.clearIdleTimeout();
    // Rotate to another idle state after 25 seconds of user inactivity
    this.idleTimeoutId = setTimeout(() => {
      this.rotateIdleState();
    }, 25000);
  }

  private startIdleRotation() {
    this.resetIdleTimeout();
  }

  private rotateIdleState() {
    const idleStates: AuroraState[] = [
      'Working',
      'Reading',
      'Writing',
      'WatchingLake',
      'CoffeeBreak',
      'Relaxing',
      'Researching',
      'Planning'
    ];
    const available = idleStates.filter(s => s !== this.currentState);
    const randomState = available[Math.floor(Math.random() * available.length)];
    this.setState(randomState);
  }

  // Determine thinking delay based on message length or complexity
  public getThinkingDelay(message: string): number {
    const wordCount = message.trim().split(/\s+/).length;
    
    // Simple questions (less than 4 words)
    if (wordCount <= 3 || message.length < 15) {
      // 300ms to 1000ms
      return 300 + Math.random() * 700;
    }
    
    // Complex questions (contain open ended question words or longer text)
    const lower = message.toLowerCase();
    const isComplexWord = lower.includes("miksi") || 
                          lower.includes("miten") || 
                          lower.includes("selitä") || 
                          lower.includes("kuvaile") || 
                          lower.includes("suunnittele") ||
                          lower.includes("arkkitehtuuri") ||
                          lower.includes("koodaa");
                          
    if (wordCount > 10 || isComplexWord) {
      // 2000ms to 4000ms
      return 2000 + Math.random() * 2000;
    }
    
    // Normal questions
    // 1000ms to 2000ms
    return 1000 + Math.random() * 1000;
  }

  // Get localized Finnish label for developer state indicator or main HUD
  public getStateLabel(state: AuroraState): string {
    switch (state) {
      case 'Working': return 'Työskentelee';
      case 'Reading': return 'Lukee';
      case 'Thinking': return 'Ajattelee / Miettii';
      case 'Writing': return 'Kirjoittaa';
      case 'WatchingLake': return 'Katsoo järvelle';
      case 'CoffeeBreak': return 'Kahvitauko';
      case 'Relaxing': return 'Rentoutuu';
      case 'Researching': return 'Tutkii';
      case 'Planning': return 'Suunnittelee';
      case 'Listening': return 'Kuuntelee';
      case 'Speaking': return 'Puhuu';
      default: return 'Lepotilassa';
    }
  }
}

export const livingStateEngine = new LivingStateEngine();
