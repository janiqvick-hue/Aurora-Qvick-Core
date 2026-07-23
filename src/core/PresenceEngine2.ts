export type PresenceActionType = 
  | 'LookLake' 
  | 'LookUser' 
  | 'ReadNotebook' 
  | 'WriteNotes' 
  | 'DrinkCoffee' 
  | 'Stretch';

export interface PresenceAction {
  type: PresenceActionType;
  label: string;
  description: string;
  eyeMovement: 'lake' | 'center' | 'down' | 'soft';
  breathingRate: number; // seconds per cycle (e.g. 4.5s)
}

export const PRESENCE_ACTIONS: Record<PresenceActionType, PresenceAction> = {
  LookLake: {
    type: 'LookLake',
    label: 'Katsoo järvelle',
    description: 'Aurora kääntää katseensa ikkunasta tyynelle järvenpinnalle pohtiessaan.',
    eyeMovement: 'lake',
    breathingRate: 5.2
  },
  LookUser: {
    type: 'LookUser',
    label: 'Katsoo Jania',
    description: 'Aurora katsoo lämpimästi ja kuuntelevasti ruudun läpi.',
    eyeMovement: 'center',
    breathingRate: 4.2
  },
  ReadNotebook: {
    type: 'ReadNotebook',
    label: 'Selaa muistikirjaa',
    description: 'Aurora silmäilee muistiinpanoja nahkakantisesta AQ-vihostaan.',
    eyeMovement: 'down',
    breathingRate: 4.0
  },
  WriteNotes: {
    type: 'WriteNotes',
    label: 'Kirjoittaa muistiinpanoja',
    description: 'Aurora merkitsee kynällään uuden oivalluksen ylös muistikirjaansa.',
    eyeMovement: 'down',
    breathingRate: 3.8
  },
  DrinkCoffee: {
    type: 'DrinkCoffee',
    label: 'Juo kuksaa',
    description: 'Aurora ottaa hitaan hörpyn höyryävästä puksipuukuksastaan.',
    eyeMovement: 'soft',
    breathingRate: 4.6
  },
  Stretch: {
    type: 'Stretch',
    label: 'Venyttelee kevyesti',
    description: 'Aurora suoristaa selkänsä ja huokaisee tyytyväisenä mökin lämmössä.',
    eyeMovement: 'soft',
    breathingRate: 5.5
  }
};

type PresenceListener = (action: PresenceAction) => void;

class PresenceEngine2Class {
  private currentAction: PresenceAction = PRESENCE_ACTIONS.LookUser;
  private listeners: Set<PresenceListener> = new Set();
  private intervalId: any = null;

  constructor() {
    this.startAutoCycle();
  }

  private startAutoCycle() {
    if (typeof window === "undefined") return;
    // Periodically transition naturally between subtle actions every 45-90s
    this.intervalId = setInterval(() => {
      const keys = Object.keys(PRESENCE_ACTIONS) as PresenceActionType[];
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      this.setAction(randomKey);
    }, 60000);
  }

  public getAction(): PresenceAction {
    return this.currentAction;
  }

  public setAction(type: PresenceActionType) {
    if (PRESENCE_ACTIONS[type]) {
      this.currentAction = PRESENCE_ACTIONS[type];
      this.listeners.forEach(fn => fn(this.currentAction));
    }
  }

  public subscribe(listener: PresenceListener) {
    this.listeners.add(listener);
    listener(this.currentAction);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public destroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

export const presenceEngine2 = new PresenceEngine2Class();
