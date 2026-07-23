/**
 * Aurora Presence Engine v1.0
 * 
 * Tämä on Auroran käyttäytymisjärjestelmä (Behavior Engine).
 * Järjestelmä EI piirrä mitään, eikä sisällä React-komponentteja tai suoraa CSS-koodia.
 * Sen ainoa tehtävä on simuloida ja laskea rauhallista, orgaanista ja inhimillistä käyttäytymistä
 * vuorokaudenajan (timeOfDay) ja vuorovaikutustilan (listening, thinking, speaking, idle) perusteella.
 * 
 * Järjestelmää ohjaa hitaus, luonnollisuus ja lähes huomaamattomat mikro-eleet.
 */

export type AuroraActivity = 
  | 'idle' 
  | 'thinking' 
  | 'listening' 
  | 'speaking' 
  | 'lookingLake' 
  | 'lookingLaptop' 
  | 'lookingNotebook' 
  | 'relaxing';

export type AuroraMood = 
  | 'focused' 
  | 'thoughtful' 
  | 'listening' 
  | 'warm' 
  | 'relaxing' 
  | 'peaceful' 
  | 'reflective';

export type AuroraPosture = 'relaxed' | 'upright' | 'leaning';

export interface AuroraPresenceState {
  currentActivity: AuroraActivity;
  mood: AuroraMood;
  breathing: number;      // Hengityksen taajuus/syvyys (0.0 - 1.0)
  headTarget: 'lake' | 'laptop' | 'notebook' | 'user' | 'away';
  eyeTarget: 'lake' | 'laptop' | 'notebook' | 'user' | 'away';
  blinkSoon: boolean;     // Merkki siitä, että silmien tulisi räpäyttää pian
  smile: number;          // Hymyn voimakkuus (0.0 - 1.0)
  posture: AuroraPosture;
  movementSpeed: number;  // Liikkeiden yleinen nopeuskerroin (pienempi = hitaampi)
}

export type TimeOfDayType = 'aamu' | 'paiva' | 'ilta' | 'yo' | 'sade' | 'talvi';
export type PresenceObserver = (state: AuroraPresenceState) => void;

class AuroraPresenceEngine {
  private timeOfDay: TimeOfDayType = 'paiva';
  private interactiveState: 'idle' | 'listening' | 'thinking' | 'speaking' = 'idle';
  
  // Nykyinen laskettu käyttäytymistila
  private currentState: AuroraPresenceState;
  private observers: Set<PresenceObserver> = new Set();
  
  // Sisäiset ajastimet ja tilat
  private behaviorIntervalId: any = null;
  private blinkTimeoutId: any = null;
  private currentIdleActivity: AuroraActivity = 'lookingLaptop';

  constructor() {
    // Alustetaan oletustila
    this.currentState = this.calculateCurrentState();
    this.startBehaviorSimulation();
  }

  /**
   * Päivittää nykyisen vuorokaudenajan ja laskee käyttäytymisen uusiksi
   */
  public setTimeOfDay(time: TimeOfDayType) {
    if (this.timeOfDay === time) return;
    this.timeOfDay = time;
    this.updateState();
  }

  /**
   * Päivittää käyttäjän ja tekoälyn välisen reaaliaikaisen tilan (Listening, Thinking, Speaking)
   */
  public setInteractiveState(state: 'idle' | 'listening' | 'thinking' | 'speaking') {
    if (this.interactiveState === state) return;
    this.interactiveState = state;
    this.updateState();
  }

  /**
   * Palauttaa nykyisen käyttäytymisdatan
   */
  public getState(): AuroraPresenceState {
    return this.currentState;
  }

  /**
   * Tilaaja-malli (Observer Pattern) mahdollistaa React-komponenttien kuuntelevan muutoksia
   */
  public subscribe(observer: PresenceObserver): () => void {
    this.observers.add(observer);
    observer(this.currentState); // Lähetetään heti nykyinen tila liittyessä
    return () => {
      this.observers.delete(observer);
    };
  }

  private notify() {
    this.currentState = this.calculateCurrentState();
    this.observers.forEach(observer => {
      try {
        observer(this.currentState);
      } catch (e) {
        console.error("PresenceEngine observer error:", e);
      }
    });
  }

  private updateState() {
    this.notify();
  }

  /**
   * Käynnistää taustasimulaation, joka arpoo rauhallisesti uusia mikro-toimintoja silloin kun hahmo on idle-tilassa.
   * Kaikki siirtymät ovat hitaita ja harvoja (10-20 sekunnin välein) rauhattoman heilunnan välttämiseksi.
   */
  private startBehaviorSimulation() {
    if (this.behaviorIntervalId) clearInterval(this.behaviorIntervalId);
    
    this.behaviorIntervalId = setInterval(() => {
      if (this.interactiveState === 'idle') {
        this.selectRandomIdleActivity();
      }
    }, 12000 + Math.random() * 8000); // 12-20 sekunnin rauhallinen sykli
  }

  /**
   * Valitsee orgaanisen idle-aktiviteetin sen perusteella, mikä vuorokaudenaika on kyseessä (psykologinen painotus)
   */
  private selectRandomIdleActivity() {
    const roll = Math.random() * 100;
    let nextActivity: AuroraActivity = 'lookingLaptop';

    switch (this.timeOfDay) {
      case 'aamu':
        // Aamu: 70% työpöydällä, 20% katsoo järvelle, 10% kirjoittaa
        if (roll < 70) nextActivity = 'lookingLaptop';
        else if (roll < 90) nextActivity = 'lookingLake';
        else nextActivity = 'lookingNotebook';
        break;

      case 'paiva':
        // Päivä: Enemmän tehokasta työskentelyä
        if (roll < 80) nextActivity = 'lookingLaptop';
        else if (roll < 90) nextActivity = 'lookingNotebook';
        else nextActivity = 'lookingLake';
        break;

      case 'ilta':
        // Ilta: Enemmän rentoutumista ja rauhallista ulos katsomista
        if (roll < 50) nextActivity = 'lookingLake';
        else if (roll < 75) nextActivity = 'relaxing';
        else if (roll < 90) nextActivity = 'lookingLaptop';
        else nextActivity = 'lookingNotebook';
        break;

      case 'yo':
        // Yö: Erittäin rauhallista rentoutumista ja järvelle katsomista
        if (roll < 60) nextActivity = 'lookingLake';
        else if (roll < 90) nextActivity = 'relaxing';
        else nextActivity = 'lookingLaptop';
        break;

      case 'sade':
        // Sade: Melankolinen tunnelma, tasaista työtä ja järvelle katselua sadetta kuunnellen
        if (roll < 45) nextActivity = 'lookingLaptop';
        else if (roll < 80) nextActivity = 'lookingLake';
        else nextActivity = 'lookingNotebook';
        break;

      case 'talvi':
        // Talvi: Cozy keskittyminen mökin lämmössä
        if (roll < 55) nextActivity = 'lookingLaptop';
        else if (roll < 80) nextActivity = 'lookingNotebook';
        else nextActivity = 'lookingLake';
        break;
    }

    if (this.currentIdleActivity !== nextActivity) {
      this.currentIdleActivity = nextActivity;
      this.triggerBlink(); // Luonnollinen silmien räpäytys pään kääntyessä
      this.updateState();
    }
  }

  /**
   * Simuloi luonnollista räpyttelyä
   */
  private triggerBlink() {
    this.currentState.blinkSoon = true;
    this.observers.forEach(obs => obs({ ...this.currentState, blinkSoon: true }));
    
    if (this.blinkTimeoutId) clearTimeout(this.blinkTimeoutId);
    this.blinkTimeoutId = setTimeout(() => {
      this.currentState.blinkSoon = false;
      this.observers.forEach(obs => obs({ ...this.currentState, blinkSoon: false }));
    }, 250);
  }

  /**
   * Laskee kaikki parametrit nykyiselle tilalle, vuorokaudenajalle ja interaktiivisuudelle.
   */
  private calculateCurrentState(): AuroraPresenceState {
    // 1. Oletusasetukset
    let currentActivity: AuroraActivity = this.currentIdleActivity;
    let mood: AuroraMood = 'relaxing';
    let breathing = 0.35; // Oletus syke
    let headTarget: 'lake' | 'laptop' | 'notebook' | 'user' | 'away' = 'laptop';
    let eyeTarget: 'lake' | 'laptop' | 'notebook' | 'user' | 'away' = 'laptop';
    let smile = 0.15;
    let posture: AuroraPosture = 'relaxed';
    let movementSpeed = 0.15; // Erittäin hidas oletusnopeus rauhallisuutta varten

    // 2. Jos käyttäjä tai tekoäly on aktiivinen, ohitetaan idle-toiminnot
    if (this.interactiveState === 'listening') {
      currentActivity = 'listening';
      mood = 'listening';
      breathing = 0.28; // Rauhoittunut, keskittynyt hengitys kuunnellessa
      headTarget = 'user';
      eyeTarget = 'user';
      smile = 0.22; // Ystävällinen vastaanottavainen hymy
      posture = 'leaning'; // Nojaa kevyesti eteenpäin kuunnellakseen tarkasti
      movementSpeed = 0.10; // Erittäin vakaa ja hiljainen liike
    } 
    else if (this.interactiveState === 'thinking') {
      currentActivity = 'thinking';
      mood = 'thoughtful';
      breathing = 0.42; // Syvempi, pohdiskeleva hengitys
      headTarget = 'away'; // Katsoo hieman sivuun/ylös pohtiessaan
      eyeTarget = 'away';
      smile = 0.12;
      posture = 'upright';
      movementSpeed = 0.12;
    } 
    else if (this.interactiveState === 'speaking') {
      currentActivity = 'speaking';
      mood = 'warm';
      breathing = 0.55; // Aktiivisempi hengitys puhuessa
      headTarget = 'user';
      eyeTarget = 'user';
      smile = 0.32; // Lämmin, iloinen ja eläväinen ilme vastatessa Jani Qvickille
      posture = 'upright';
      movementSpeed = 0.30; // Hieman nopeampi, jotta puheliikkeet rekisteröityvät luonnollisesti
    } 
    else {
      // Idle-aktiviteettien hienosäätö
      switch (this.currentIdleActivity) {
        case 'lookingLaptop':
          mood = 'focused';
          breathing = 0.35;
          headTarget = 'laptop';
          eyeTarget = 'laptop';
          smile = 0.15;
          posture = 'upright';
          movementSpeed = 0.15;
          break;

        case 'lookingLake':
          mood = 'relaxing';
          breathing = 0.30; // Hyvin rauhallinen, syvä hengitys maisemaa katsellessa
          headTarget = 'lake';
          eyeTarget = 'lake';
          smile = 0.18; // Kevyt tyytyväinen hymy
          posture = 'relaxed';
          movementSpeed = 0.08; // Äärimmäisen hidas liike
          break;

        case 'lookingNotebook':
          mood = 'reflective';
          breathing = 0.38;
          headTarget = 'notebook';
          eyeTarget = 'notebook';
          smile = 0.10;
          posture = 'leaning';
          movementSpeed = 0.18;
          break;

        case 'relaxing':
          mood = 'peaceful';
          breathing = 0.28;
          headTarget = 'away';
          eyeTarget = 'lake';
          smile = 0.20;
          posture = 'relaxed';
          movementSpeed = 0.05; // Lähes liikkumaton, rauhallinen oleilu
          break;
      }
    }

    // 3. Vuorokaudenajan tuoma lisäpainotus ja hienosäätö tunnelmaan
    switch (this.timeOfDay) {
      case 'yo':
        breathing *= 0.8; // Yöllä hengitys hidastuu entisestään
        smile = Math.max(0.08, smile - 0.05); // Yöllä ilme on seesteisempi ja levollisempi
        movementSpeed *= 0.8;
        break;
      case 'aamu':
        smile = Math.min(1.0, smile + 0.05); // Aamulla reipas, lämmin ilme uuteen päivään
        breathing *= 1.1;
        break;
      case 'sade':
        mood = 'reflective';
        breathing *= 0.95;
        movementSpeed *= 0.9;
        break;
    }

    return {
      currentActivity,
      mood,
      breathing,
      headTarget,
      eyeTarget,
      blinkSoon: this.currentState ? this.currentState.blinkSoon : false,
      smile,
      posture,
      movementSpeed
    };
  }
}

export const auroraPresenceEngine = new AuroraPresenceEngine();
