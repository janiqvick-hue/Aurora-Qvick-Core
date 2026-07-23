export enum AuroraActivityType {
  Reading = "Reading",
  WritingJournal = "WritingJournal",
  LookingOutside = "LookingOutside",
  DrinkingCoffee = "DrinkingCoffee",
  PlanningProject = "PlanningProject",
  OrganizingDesk = "OrganizingDesk",
  WatchingFireplace = "WatchingFireplace",
  Thinking = "Thinking",
  Stretching = "Stretching",
  ListeningToRain = "ListeningToRain"
}

export interface ActivityDetail {
  type: AuroraActivityType;
  label: string;
  description: string;
  activePhrase: string;
  avatarPose: string;
  microAnimation: string;
  unityAnimationNode: string; // Ready for Unity/VR 3D Avatar
  soundHint?: string;
  preferredRhythm: DailyRhythmPhase[];
}

export type DailyRhythmPhase = "MORNING" | "DAYTIME" | "EVENING" | "NIGHT" | "DEEP_NIGHT";

export interface RhythmInfo {
  phase: DailyRhythmPhase;
  label: string;
  description: string;
  timeRange: string;
  lightingTheme: {
    bgFilter: string;
    fireplaceGlow: string;
    ambientTint: string;
    lightingWarmth: number; // 0 (cold) to 1 (max warm candle/fireplace)
  };
  auroraTone: string;
}

export const DAILY_RHYTHMS: Record<DailyRhythmPhase, RhythmInfo> = {
  MORNING: {
    phase: "MORNING",
    label: "Aamu (06.00–09.00)",
    description: "Aurora juo aamukahvia kuksasta. Aurinko nousee rauhallisesti Lopen järven yllä.",
    timeRange: "06:00 - 09:00",
    lightingTheme: {
      bgFilter: "sepia(10%) brightness(105%) contrast(100%)",
      fireplaceGlow: "rgba(245, 158, 11, 0.2)",
      ambientTint: "rgba(254, 243, 199, 0.08)",
      lightingWarmth: 0.6
    },
    auroraTone: "Virkeä, kirkas ja inspiroitunut"
  },
  DAYTIME: {
    phase: "DAYTIME",
    label: "Päivä (09.00–16.00)",
    description: "Aktiivista suunnittelua ja koodausta. Työpöydällä on muistiinpanoja ja luonnoksia.",
    timeRange: "09:00 - 16:00",
    lightingTheme: {
      bgFilter: "brightness(102%) contrast(102%)",
      fireplaceGlow: "rgba(245, 158, 11, 0.15)",
      ambientTint: "rgba(255, 255, 255, 0.02)",
      lightingWarmth: 0.4
    },
    auroraTone: "Keskittynyt, täsmällinen ja analyyttinen"
  },
  EVENING: {
    phase: "EVENING",
    label: "Ilta (16.00–21.00)",
    description: "Takka palaa kotoisasti. Aurora tekee muistiinpanoja ja katselee ikkunasta iltatyyntä järveä.",
    timeRange: "16:00 - 21:00",
    lightingTheme: {
      bgFilter: "sepia(25%) brightness(95%) contrast(105%)",
      fireplaceGlow: "rgba(245, 158, 11, 0.4)",
      ambientTint: "rgba(217, 119, 6, 0.12)",
      lightingWarmth: 0.8
    },
    auroraTone: "Lämmin, kotoisa ja kuunteleva"
  },
  NIGHT: {
    phase: "NIGHT",
    label: "Ilta-yö (21.00–00.00)",
    description: "Takka palaa kirkkaammin, valaistus muuttuu pehmeän lämpimäksi. Puhe sävyltään rauhallisempaa.",
    timeRange: "21:00 - 00:00",
    lightingTheme: {
      bgFilter: "sepia(45%) brightness(85%) contrast(110%)",
      fireplaceGlow: "rgba(234, 88, 12, 0.55)",
      ambientTint: "rgba(180, 83, 9, 0.2)",
      lightingWarmth: 0.95
    },
    auroraTone: "Syvä, rauhoittava ja pohdiskeleva"
  },
  DEEP_NIGHT: {
    phase: "DEEP_NIGHT",
    label: "Yö (00.00–06.00)",
    description: "Mökki on levollinen ja hiljainen. Kynttilänvalo heijastuu hirsiseiniin. Aurora puhuu pehmeästi.",
    timeRange: "00:00 - 06:00",
    lightingTheme: {
      bgFilter: "sepia(60%) brightness(75%) contrast(115%)",
      fireplaceGlow: "rgba(194, 65, 12, 0.65)",
      ambientTint: "rgba(120, 53, 15, 0.25)",
      lightingWarmth: 1.0
    },
    auroraTone: "Pehmeä, hiljainen ja levollinen"
  }
};

export const AURORA_ACTIVITIES: Record<AuroraActivityType, ActivityDetail> = {
  Reading: {
    type: AuroraActivityType.Reading,
    label: "Lukee kirjaa",
    description: "Aurora selaa filosofiaa ja pelisuunnittelua käsittelevää teosta kynttilän valossa.",
    activePhrase: "Lukemassa mielenkiintoista lukua pelisuunnittelun filosofiasta...",
    avatarPose: "seated_book_reading",
    microAnimation: "eyes_following_page",
    unityAnimationNode: "anim_aurora_read_book",
    soundHint: "page_turn_soft",
    preferredRhythm: ["EVENING", "NIGHT", "DEEP_NIGHT"]
  },
  WritingJournal: {
    type: AuroraActivityType.WritingJournal,
    label: "Kirjoittaa muistikirjaan",
    description: "Aurora merkitsee nahkakantiseen AQ-päiväkirjaansa tuoreita ajatuksia.",
    activePhrase: "Kirjoittamassa tuoreita ajatuksia nahkakantiseen päiväkirjaan...",
    avatarPose: "seated_writing_desk",
    microAnimation: "pen_scratching_softly",
    unityAnimationNode: "anim_aurora_write_journal",
    soundHint: "pen_scribble",
    preferredRhythm: ["MORNING", "EVENING", "NIGHT"]
  },
  LookingOutside: {
    type: AuroraActivityType.LookingOutside,
    label: "Katsoo järvelle",
    description: "Aurora seuraa ikkunasta tyynen Lopen järven pintaa ja saaren mäntyjä.",
    activePhrase: "Katselemassa rauhallista järvimaisemaa ikkunan takana...",
    avatarPose: "head_turned_window",
    microAnimation: "gentle_head_tilt_smile",
    unityAnimationNode: "anim_aurora_gaze_window",
    soundHint: "wind_pines_soft",
    preferredRhythm: ["MORNING", "EVENING"]
  },
  DrinkingCoffee: {
    type: AuroraActivityType.DrinkingCoffee,
    label: "Nauttii teetä / kahvia kuksasta",
    description: "Aurora juo höyryävää kahvia koivukuksastaan mökin rauhassa.",
    activePhrase: "Nauttimassa kuumaa teetä perinteisestä puukuksasta...",
    avatarPose: "holding_kuksa_breath",
    microAnimation: "sip_kuksa_slow",
    unityAnimationNode: "anim_aurora_drink_kuksa",
    soundHint: "steam_sip",
    preferredRhythm: ["MORNING", "DAYTIME"]
  },
  PlanningProject: {
    type: AuroraActivityType.PlanningProject,
    label: "Suunnittelee projektia",
    description: "Aurora tarkastelee peliprojektien johtolankoja ja arkkitehtuurikaavioita.",
    activePhrase: "Syventymässä peliprojektimme arkkitehtuuriin ja rakenteisiin...",
    avatarPose: "analyzing_blueprint",
    microAnimation: "finger_tracing_map",
    unityAnimationNode: "anim_aurora_inspect_blueprint",
    soundHint: "paper_rustle",
    preferredRhythm: ["DAYTIME", "EVENING"]
  },
  OrganizingDesk: {
    type: AuroraActivityType.OrganizingDesk,
    label: "Järjestelee työpöytää",
    description: "Aurora laittaa kompassia, karttoja ja muistivihkoja siistiin järjestykseen.",
    activePhrase: "Järjestelmässä työpöytäämme valmiiksi yhteistä sessiota varten...",
    avatarPose: "organizing_items",
    microAnimation: "moving_prop_gentle",
    unityAnimationNode: "anim_aurora_organize_desk",
    soundHint: "wooden_click",
    preferredRhythm: ["MORNING", "DAYTIME"]
  },
  WatchingFireplace: {
    type: AuroraActivityType.WatchingFireplace,
    label: "Seuraa takkatulta",
    description: "Aurora kuuntelee takan rätinää ja nauttii elävän tulen lämmöstä.",
    activePhrase: "Seuraamassa elävän tulen rätinää takassa...",
    avatarPose: "leaning_fireplace_glow",
    microAnimation: "fire_reflection_eyes",
    unityAnimationNode: "anim_aurora_watch_fire",
    soundHint: "fireplace_crackle",
    preferredRhythm: ["EVENING", "NIGHT", "DEEP_NIGHT"]
  },
  Thinking: {
    type: AuroraActivityType.Thinking,
    label: "Pohdiskelee luovasti",
    description: "Aurora miettii syvällisiä peli-ideoita ja tieteellisiä konsepteja.",
    activePhrase: "Mietiskelemässä uusia luovia oivalluksia...",
    avatarPose: "hand_on_chin_thoughtful",
    microAnimation: "slow_breath_thought",
    unityAnimationNode: "anim_aurora_ponder",
    soundHint: undefined,
    preferredRhythm: ["DAYTIME", "EVENING", "NIGHT"]
  },
  Stretching: {
    type: AuroraActivityType.Stretching,
    label: "Oikaisemassa asentoaan",
    description: "Aurora vaihtaa asentoaan lepotuolissaan ja hengittää syvään.",
    activePhrase: "Oikaisemassa asentoani lepotuolissa...",
    avatarPose: "slight_stretch_posture",
    microAnimation: "shoulder_relax_breath",
    unityAnimationNode: "anim_aurora_stretch",
    soundHint: undefined,
    preferredRhythm: ["DAYTIME", "EVENING"]
  },
  ListeningToRain: {
    type: AuroraActivityType.ListeningToRain,
    label: "Kuuntelee sadetta",
    description: "Aurora kuuntelee ikkunaan ropisevia pisaroita.",
    activePhrase: "Kuuntelemassa sateen pehmeää ropinaa ikkunaan...",
    avatarPose: "listening_posture",
    microAnimation: "eyes_closed_smile",
    unityAnimationNode: "anim_aurora_listen_rain",
    soundHint: "rain_window_soft",
    preferredRhythm: ["EVENING", "NIGHT", "DEEP_NIGHT"]
  }
};

export function getCurrentDailyRhythm(date: Date = new Date()): RhythmInfo {
  const hr = date.getHours();
  if (hr >= 6 && hr < 9) return DAILY_RHYTHMS.MORNING;
  if (hr >= 9 && hr < 16) return DAILY_RHYTHMS.DAYTIME;
  if (hr >= 16 && hr < 21) return DAILY_RHYTHMS.EVENING;
  if (hr >= 21 || hr < 0) return DAILY_RHYTHMS.NIGHT;
  return DAILY_RHYTHMS.DEEP_NIGHT;
}
