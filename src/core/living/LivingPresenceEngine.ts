import { 
  AuroraActivityType, 
  AURORA_ACTIVITIES, 
  ActivityDetail, 
  getCurrentDailyRhythm, 
  RhythmInfo 
} from "./AuroraActivities";
import { generateDynamicWelcome, WelcomeMessage } from "./WelcomeEngine";
import { getDeskStateForProject, DeskState } from "./LivingDeskEngine";
import { loadSessionContinuity, saveSessionContinuity, getContinuityMessage } from "./SessionContinuity";

export type LivingEmotion = "Rauhallinen" | "Luova" | "Keskittynyt" | "Pohdiskeleva" | "Iloinen";

export interface LivingPresenceSnapshot {
  activity: ActivityDetail;
  rhythm: RhythmInfo;
  emotion: LivingEmotion;
  deskState: DeskState;
  welcome: WelcomeMessage;
  continuityMessage: string;
  unityStateExport: {
    avatarPose: string;
    animationNode: string;
    soundHint?: string;
    lightingWarmth: number;
    bgFilter: string;
    deskPropsCount: number;
    timestamp: string;
  };
}

type Subscriber = (snapshot: LivingPresenceSnapshot) => void;

class LivingPresenceEngineClass {
  private subscribers: Set<Subscriber> = new Set();
  private currentActivityType: AuroraActivityType = AuroraActivityType.WritingJournal;
  private currentEmotion: LivingEmotion = "Rauhallinen";
  private activeProjectName: string = "Murhamysteeri Mökillä";
  private intervalId: any = null;

  constructor() {
    this.pickInitialActivity();
    this.startIdleActivityLoop();
  }

  private pickInitialActivity(): void {
    const rhythm = getCurrentDailyRhythm();
    const activities = Object.values(AURORA_ACTIVITIES);
    const suitable = activities.filter(a => a.preferredRhythm.includes(rhythm.phase));
    if (suitable.length > 0) {
      this.currentActivityType = suitable[Math.floor(Math.random() * suitable.length)].type;
    } else {
      this.currentActivityType = AuroraActivityType.WritingJournal;
    }
  }

  private startIdleActivityLoop(): void {
    if (this.intervalId) clearInterval(this.intervalId);

    const scheduleNextTransition = () => {
      const nextDelay = Math.floor(Math.random() * (300000 - 120000 + 1)) + 120000;
      this.intervalId = setTimeout(() => {
        this.transitionToNextActivity();
        scheduleNextTransition();
      }, nextDelay);
    };

    scheduleNextTransition();
  }

  public transitionToNextActivity(): void {
    const rhythm = getCurrentDailyRhythm();
    const activities = Object.values(AURORA_ACTIVITIES);
    const suitable = activities.filter(a => 
      a.preferredRhythm.includes(rhythm.phase) && a.type !== this.currentActivityType
    );

    if (suitable.length > 0) {
      this.currentActivityType = suitable[Math.floor(Math.random() * suitable.length)].type;
    } else {
      const pool = activities.filter(a => a.type !== this.currentActivityType);
      this.currentActivityType = pool[Math.floor(Math.random() * pool.length)].type;
    }

    const emotions: LivingEmotion[] = ["Rauhallinen", "Luova", "Keskittynyt", "Pohdiskeleva", "Iloinen"];
    this.currentEmotion = emotions[Math.floor(Math.random() * emotions.length)];

    this.notifySubscribers();
  }

  public setActiveProject(projectName: string): void {
    this.activeProjectName = projectName;
    saveSessionContinuity(projectName, AURORA_ACTIVITIES[this.currentActivityType].label);
    this.notifySubscribers();
  }

  public getSnapshot(): LivingPresenceSnapshot {
    const rhythm = getCurrentDailyRhythm();
    const activity = AURORA_ACTIVITIES[this.currentActivityType];
    const deskState = getDeskStateForProject(this.activeProjectName);
    const welcome = generateDynamicWelcome(this.activeProjectName, activity.label);
    const continuityMessage = getContinuityMessage(this.activeProjectName);

    return {
      activity,
      rhythm,
      emotion: this.currentEmotion,
      deskState,
      welcome,
      continuityMessage,
      unityStateExport: {
        avatarPose: activity.avatarPose,
        animationNode: activity.unityAnimationNode,
        soundHint: activity.soundHint,
        lightingWarmth: rhythm.lightingTheme.lightingWarmth,
        bgFilter: rhythm.lightingTheme.bgFilter,
        deskPropsCount: deskState.props.length,
        timestamp: new Date().toISOString()
      }
    };
  }

  public subscribe(fn: Subscriber): () => void {
    this.subscribers.add(fn);
    fn(this.getSnapshot());
    return () => {
      this.subscribers.delete(fn);
    };
  }

  private notifySubscribers(): void {
    const snapshot = this.getSnapshot();
    this.subscribers.forEach(fn => fn(snapshot));
  }

  public exportStateForUnity(): string {
    return JSON.stringify(this.getSnapshot().unityStateExport, null, 2);
  }
}

export const livingPresenceEngine = new LivingPresenceEngineClass();
