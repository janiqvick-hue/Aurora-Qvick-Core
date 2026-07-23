import { MemoryCategory } from "../types";

export interface EcosystemProject {
  id: string;
  name: string;
  codeName: string;
  version: string;
  status: 'In Development' | 'Alpha' | 'Beta' | 'Concept' | 'Live';
  progress: number;
  category: string;
  description: string;
  techStack: string[];
  keyFeatures: string[];
  githubRepo?: string;
  lastUpdated: string;
}

export interface StudyItem {
  id: string;
  title: string;
  institution: string;
  creditsOrPoints: string;
  date: string;
  verificationUrl?: string;
  status: 'Completed' | 'In Progress';
  description: string;
}

export interface DevMetric {
  label: string;
  value: string;
  change?: string;
  icon: string;
}

class QvickGamesEcosystemEngine {
  public getStudioProfile() {
    return {
      studioName: "Qvick Games",
      leadName: "Jani-Petteri Qvick",
      email: "jani.Qvick@gmail.com",
      studentNumber: "2616831",
      role: "Founder, Game Designer & Lead Developer",
      certificationsCount: 8,
      totalXamkCredits: "21 op (Bachelor's Level - BD)",
      totalIvgcPoints: "33 p (11 Valmista Moduulia)",
      microsoftCSharpScore: "96.3% (77/80)",
      aiCertificates: "Elements of AI (2 ECTS) & Google AI",
      location: "Lopen Järvenrantamökki / Qvick Games HQ",
      website: "qvickgames.fi",
      github: "github.com/Jani-PetteriQvick"
    };
  }

  public getEcosystemProjects(): EcosystemProject[] {
    return [
      {
        id: "proj-murhamysteeri",
        name: "Murhamysteeri Mökillä",
        codeName: "Cabin Mystery",
        version: "v1.0 Julkaistu",
        status: "Live",
        progress: 100,
        category: "Lippulaiva Salapoliisipeli (Julkaistu)",
        description: "Qvick Gamesin virallisesti julkaistu elokuvallinen suomalainen murhamysteeri mökkimiljöössä (Hiljaisen järven salaisuus). Pelaaja tutkii ympäristöä, kerää todisteita, kuulustelee epäiltyjä ja ratkaisee mysteerin.",
        techStack: ["React", "TypeScript", "Tailwind CSS", "FMOD Sound", "Gemini AI"],
        keyFeatures: ["11 tutkintapaikkaa (Olohuone, Keittiö, Antin huone, Vierashuone, Sauna, Venevaja, Vanha varasto, Laituri, Metsäpolku, Rantapolku, Autopaikka)", "Interaktiivinen tutkintataulu & todisteinventaario", "Täysi suomi & englanti lokalisaatio", "FMOD-äänimaailma, tallennusjärjestelmä & elokuvallinen valikko"],
        githubRepo: "Jani-PetteriQvick/murhamysteeri-mokilla",
        lastUpdated: "2026-07-23"
      },
      {
        id: "proj-aurora-core",
        name: "Aurora Qvick (Aurora Core)",
        codeName: "Companion OS",
        version: "Alpha 0.7",
        status: "Alpha",
        progress: 92,
        category: "Tekoälykumppani & OS",
        description: "Qvick Gamesin luova tekoälysielu ja työtila-apulainen, joka oppii muistoista ja ohjaa pelikehitystä.",
        techStack: ["React", "TypeScript", "Gemini 3.6 Flash", "Web Speech API", "Living State Engine"],
        keyFeatures: ["Natural Presence & Hengitys", "Context Awareness & Tunnelma", "Persistent Memory Engine", "Qvick Games OS Dashboard"],
        githubRepo: "Jani-PetteriQvick/aurora-qvick-core",
        lastUpdated: "2026-07-23"
      },
      {
        id: "proj-aurora-home",
        name: "Aurora Home",
        codeName: "3D Cabin Gateway",
        version: "Alpha 0.4",
        status: "Alpha",
        progress: 75,
        category: "Virtuaalityötila & 3D Environment",
        description: "Lopen mökin ilmapiiriin sijoittuva 3D-työtila ja tekoälykytkentä gateway-portaalilla.",
        techStack: ["Three.js", "React Three Fiber", "Web Audio", "Vite"],
        keyFeatures: ["Takkatulen loimu & Äänisynteesi", "Virtuaalinen mökkitoimisto", "Sääilmaiset (Loppi)"],
        githubRepo: "Jani-PetteriQvick/aurora-home-3d",
        lastUpdated: "2026-07-20"
      },
      {
        id: "proj-jarven-vartijat",
        name: "Järven Vartijat",
        codeName: "Lake Guardians",
        version: "Concept 0.2",
        status: "Concept",
        progress: 40,
        category: "Mytologinen Strategiapeli",
        description: "Pohjoisen järven salaisuuksiin ja kalevalaiseen mytologiaan pohjautuva peli- ja kirjahanke.",
        techStack: ["Unreal Engine 5", "C++", "C# Tooling", "FMOD"],
        keyFeatures: ["Taruston olennot", "Vesistömekaniikat", "Taktinen korttikomentosarja"],
        githubRepo: "Jani-PetteriQvick/jarven-vartijat",
        lastUpdated: "2026-07-15"
      },
      {
        id: "proj-qvickgames-portfolio",
        name: "Qvick Games Portfolio & Website",
        codeName: "Studio Web",
        version: "v2.0",
        status: "Live",
        progress: 95,
        category: "Pelistudion Verkkosivusto",
        description: "Jani-Petteri Qvickin ja Qvick Gamesin virallinen esittely-, portfolio- ja opintosivusto.",
        techStack: ["React", "Tailwind CSS", "Vite", "Cloud Run"],
        keyFeatures: ["Hankekatalogi", "Sertifikaattitodisteet", "Interaktiiviset demonäytteet"],
        githubRepo: "Jani-PetteriQvick/qvickgames-portal",
        lastUpdated: "2026-07-23"
      }
    ];
  }

  public getStudyOverview(): StudyItem[] {
    return [
      {
        id: "st-xamk-top",
        title: "Kaakkois-Suomen AMK (Xamk Avoin AMK) Opintosuoritusote",
        institution: "Xamk",
        creditsOrPoints: "21 op (Bachelor's level - BD)",
        date: "23.7.2026",
        status: "Completed",
        description: "11 suoritettua opintojaksoa: Space Shooter (7 op), Interactive Card Combat (4 op), Text-based Adventure (1 op), Game AI (2 op), History, Analytics, Production & Concept Design."
      },
      {
        id: "st-ivgc-cadgi",
        title: "IVGC+ / Cadgi Pelikoulutusalustan Suoritukset",
        institution: "Cadgi & IVGC+",
        creditsOrPoints: "33 pistettä (11 Moduulia)",
        date: "23.7.2026",
        status: "Completed",
        description: "M25 Pelibrändi, M6 Avaruusräiskintä, M9.3 Äänisuunnittelu, M5 Mobiilikäärme, M30 Leikin origins, M31 Narratiivi, M32 Pelattavuus, M21 Visio, M23 Sijoitus."
      },
      {
        id: "st-microsoft-csharp",
        title: "Perustason C# Microsoftin kanssa (Foundational C#)",
        institution: "freeCodeCamp & Microsoft",
        creditsOrPoints: "Sertifikaatti (96.3%)",
        date: "13.7.2026",
        verificationUrl: "https://freecodecamp.org/certification/fcc-a6468719-344b-4878-b8da-cea110ab9b43/foundational-c-sharp-with-microsoft",
        status: "Completed",
        description: "Sertifiointitentti läpäisty pistemäärällä 77/80 (96,3%). C#-syntaksi, oliorakenne, poikkeustenkäsittely ja muistinvaraus."
      },
      {
        id: "st-elements-of-ai",
        title: "Elements of AI - Kurssitodistus",
        institution: "Helsingin yliopisto & MinnaLearn",
        creditsOrPoints: "2 op (ECTS)",
        date: "10.7.2026",
        verificationUrl: "https://certificates.mooc.fi/validate/mxdiiu9ufl",
        status: "Completed",
        description: "Tekoälyn perusteet, neuroverkot, koneoppiminen ja eettiset AI-sovellukset."
      },
      {
        id: "st-google-pm",
        title: "Google Project Management Professional Certificate",
        institution: "Google & Coursera",
        creditsOrPoints: "4 Osa-aluetta + Capstone",
        date: "1.7.2026",
        verificationUrl: "https://coursera.org/verify/5M51N9OJXC3A",
        status: "Completed",
        description: "Project Planning, Project Execution, Agile Project Management & Capstone. Ammattimainen Agile/Scrum-projektinjohto."
      }
    ];
  }

  public getGitHubOverview() {
    return {
      username: "Jani-PetteriQvick",
      profileUrl: "https://github.com/Jani-PetteriQvick",
      totalRepositories: 14,
      activeBranch: "main / release-alpha-0.7",
      recentCommits: [
        { msg: "feat(aurora): Aurora Core Alpha 0.7 - Qvick Games OS Integration", time: "Juuri nyt", hash: "a07c9f1" },
        { msg: "release(murhamysteeri): Murhamysteeri Mökillä v1.0 Final Released & Published", time: "Tänään", hash: "m10f001" },
        { msg: "feat(presence): Aurora Core Alpha 0.5 - Natural Presence & Fireplace Glow", time: "1 h sitten", hash: "a05b3e2" },
        { msg: "feat(memory): Persistent Memory Architecture & Timeline Filter", time: "2 h sitten", hash: "m06f811" }
      ],
      ciCdStatus: "Passing 100% - Vite & Cloud Run auto-deploy",
      linesOfCode: "~42,500 loc"
    };
  }

  public getDevStatistics(): DevMetric[] {
    return [
      { label: "Suoritetut Xamk Opintopisteet", value: "21 op", change: "100% Hyväksytty", icon: "GraduationCap" },
      { label: "Cadgi/IVGC+ Pelipisteet", value: "33 p", change: "11 Moduulia", icon: "Award" },
      { label: "C# Microsoft Sertifiointi", value: "96.3%", change: "77/80 oikein", icon: "Code" },
      { label: "Aktiiviset Pelihankkeet", value: "5 Hanketta", change: "Qvick Games OS", icon: "Gamepad2" },
      { label: "Kehitystunnit Lopen Mökillä", value: "340+ h", change: "+12 h tällä viikolla", icon: "Clock" },
      { label: "Muistijärjestelmän Koko", value: "32 Muistoa", change: "Persistent Context", icon: "BrainCircuit" }
    ];
  }

  public getUpcomingGoals() {
    return [
      { goal: "Murhamysteeri Mökillä - Markkinointi, Steam-valmistelu, traileri & pelaajapalaute", timeline: "Heinä-Elokuu 2026", priority: "Korkea" },
      { goal: "Aurora Qvick Core Beta 1.0 - Täysi Äänikeskustelu & Reaaliaikainen Pelituki", timeline: "Elokuu 2026", priority: "Korkea" },
      { goal: "Järven Vartijat - Prototyypin demo Unreal Engine 5:ssä", timeline: "Syyskuu 2026", priority: "Keskisuuri" },
      { goal: "Qvick Games Portfolion & Steam-sivun päivitys", timeline: "Syksy 2026", priority: "Strateginen" }
    ];
  }
}

export const qvickGamesEcosystemEngine = new QvickGamesEcosystemEngine();
