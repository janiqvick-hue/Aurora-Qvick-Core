import { 
  ProjectIdentity, 
  ProjectStatus, 
  ProjectPriority, 
  ProjectCategory,
  EcosystemRole
} from "../types";

export const INITIAL_PROJECT_IDENTITIES: ProjectIdentity[] = [
  {
    id: "proj-murhamysteeri",
    name: "Murhamysteeri Mökillä",
    codeName: "Cabin Mystery",
    type: "Elokuvallinen Suomalainen Salapoliisipeli",
    status: "Released",
    priority: "Completed",
    progress: 100,
    subProgress: { visual: 100, story: 100, audio: 100, testing: 100, code: 100 },
    description: "Qvick Gamesin virallisesti julkaistu elokuvallinen suomalainen murhamysteeri mökkimiljöössä (Hiljaisen järven salaisuus). 11 tutkintapaikkaa, tutkintataulu, kaksikielisyys ja FMOD-äänimaailma.",
    category: "Game",
    roleInEcosystem: "Completed Project",
    relationshipType: "Julkaistu Lippulaivapeli",
    supportsProjects: ["Qvick Games", "Aurora Core", "VR Murder Mystery"],
    dependsOnProjects: [],
    recommendedFocus: ["Marketing", "Portfolio", "Updates", "Community"],
    technologies: ["React", "TypeScript", "Tailwind CSS", "FMOD Sound", "Gemini AI"],
    platform: ["Web", "PC", "Steam"],
    repository: "Jani-PetteriQvick/murhamysteeri-mokilla",
    website: "https://qvickgames.fi/murhamysteeri",
    portfolio: "https://qvickgames.fi",
    relatedProjects: ["Qvick Games", "Aurora Core", "Portfolio", "Website"],
    currentPhase: "Julkaistu & Valmis (v1.0)",
    nextMilestone: "Steam-valmistelu, traileri & markkinointimateriaalit",
    completedMilestones: [
      "11 tutkintapaikan (Olohuone, Keittiö, Antin huone, Vierashuone, Sauna, Venevaja, Vanha varasto, Laituri, Metsäpolku, Rantapolku, Autopaikka) toteutus",
      "Interaktiivinen tutkintataulu, todisteinventaario & kuulustelumekaniikka",
      "Kaksikielisyys (Suomi/Englanti), FMOD-äänipankki & pelitallennus",
      "Lippulaivajulkaisu & 100% valmis peli-integraatio"
    ],
    currentGoals: [
      "Steam-sivun & trailerin materiaalien valmistelu",
      "Pelaajapalautteen ja arvostelujen seuranta",
      "Portfolio- ja verkkosivupäivitykset (qvickgames.fi)"
    ],
    futurePlans: [
      "Patch-päivitysten ja jatkosisällön kartoitus",
      "Seuraavien Qvick Games -hankkeiden tukeminen"
    ],
    documentation: ["Arkkitehtuuri & Peli-integraatio", "Tutkintapaikkojen kartta", "FMOD-äänisuunnittelu"],
    visualAssets: ["PF_Lakeside_Crime_Map", "PF_Brass_Magnifier", "PF_Clue_Folder_Open"],
    lastUpdated: "2026-07-23",
    isActive: true
  },
  {
    id: "proj-qvick-games",
    name: "Qvick Games",
    codeName: "Qvick Studio Hub",
    type: "Pelilaboratorio & Virallinen Studio-Sivusto",
    status: "Maintenance",
    priority: "High",
    progress: 95,
    subProgress: { visual: 95, story: 100, audio: 90, testing: 95, code: 95 },
    description: "Jani-Petteri Qvickin perustama ammattimainen pelistudio ja portfolio. Esittelee julkaistut pelit, tutkinnot ja sertifikaatit.",
    category: "Portfolio",
    roleInEcosystem: "Support Project",
    relationshipType: "Pelistudio & Portfolion Keskusalusta",
    supportsProjects: ["Aurora Core", "Järven Vartijat", "VR Murder Mystery"],
    dependsOnProjects: ["Murhamysteeri Mökillä"],
    recommendedFocus: ["Portfolio", "Sertifikaatit", "Studiobrändi", "Julkaisunäytteet"],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    platform: ["Web"],
    website: "https://qvickgames.fi",
    portfolio: "https://qvickgames.fi",
    relatedProjects: ["Murhamysteeri Mökillä", "Aurora Core", "Järven Vartijat"],
    currentPhase: "Virallinen pelitiedotus & Julkaisunäyte",
    nextMilestone: "Murhamysteeri Mökillä v1.0 näyteosiot & lehdistökitti",
    completedMilestones: [
      "Sivuston perusrakenne ja visuaalinen ilme",
      "Opintosuoritusotteen (Xamk 21 op) ja Sertifikaattien (Google PM, Microsoft C#, Elements of AI) todentaminen",
      "Murhamysteeri Mökillä -pelin julkaisusivun aktivointi"
    ],
    currentGoals: [
      "Julkaistun pelin lehdistömateriaalit & traileri-linkit",
      "Steam Direct -sivun kytkentä"
    ],
    futurePlans: [
      "Uusien Qvick Games -pelien julkaisualusta",
      "Kansainvälinen pelialan verkostoituminen"
    ],
    documentation: ["Studio Profile & CV", "Xamk 21 op Transcript", "Microsoft C# Certificate"],
    visualAssets: ["QvickGames_Logo", "Certificates_Badge_Grid"],
    lastUpdated: "2026-07-23",
    isActive: false
  },
  {
    id: "proj-aurora-core",
    name: "Aurora Core",
    codeName: "Aurora Companion OS",
    type: "Tekoälyohjain & Sielutason Kumppani",
    status: "In Development",
    priority: "Critical",
    progress: 88,
    subProgress: { visual: 90, story: 95, audio: 80, testing: 85, code: 90 },
    description: "Luova tekoäly-kumppani ja peli-ideointisielu Qvick Gamesille. Yhdistää kontekstisielun, persistentin muistin ja työtila-analytiikan.",
    category: "AI",
    roleInEcosystem: "Main Project",
    relationshipType: "Tekoälyohjain & Työtila-Sielu",
    supportsProjects: ["Aurora Home", "Qvick Games", "Järven Vartijat", "VR Murder Mystery"],
    dependsOnProjects: ["Qvick Games"],
    recommendedFocus: ["Development", "Memory", "Workspace", "Proactive Intelligence"],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Gemini 3.6 Flash", "Web Speech API"],
    platform: ["Web", "AI Studio", "Cloud Run"],
    repository: "Jani-PetteriQvick/aurora-qvick-core",
    website: "https://qvickgames.fi/aurora",
    portfolio: "https://qvickgames.fi",
    relatedProjects: ["Aurora Home", "Project Brain", "Studio OS", "Memory Engine", "Living Desk", "Qvick Games"],
    currentPhase: "Aurora Core Alpha 0.8 - Proactive Intelligence Engine",
    nextMilestone: "Aurora Core Beta 1.0 - Täysi Äänikeskustelu & Reaaliaikainen Pelituki",
    completedMilestones: [
      "Persistentti muistiarkkitehtuuri v4",
      "Proactive Intelligence Engine & Sielun syötteet",
      "Qvick Games Ecosystem Engine & Studio OS -integraatio",
      "Living Desk & Ambient Presence Engine"
    ],
    currentGoals: [
      "Project Identity -malli & yhtenäinen projektiverkko",
      "Monimodal-ääniohjauksen viimeistely",
      "Studio OS -ohjainten reaktiivisuus"
    ],
    futurePlans: [
      "Reaaliaikainen peli- ja koodituki Unity/UE5-projekteille",
      "Itsenäiset työtilarutiinit ja proaktiivinen tavoitehallinta"
    ],
    documentation: ["Aurora Core Architecture", "Living Presence Specification", "Memory Engine Specs"],
    visualAssets: ["Aurora_Avatar_Cabin", "Fireplace_Glow_FX"],
    lastUpdated: "2026-07-23",
    isActive: false
  },
  {
    id: "proj-aurora-home",
    name: "Aurora Home",
    codeName: "Virtual Cabin Gateway",
    type: "Älykäs Työtila- ja Mökkiympäristöohjain",
    status: "Prototype",
    priority: "High",
    progress: 40,
    subProgress: { visual: 60, story: 50, audio: 40, testing: 20, code: 30 },
    description: "Tekoälyohjattu rauhallisen kodin tai työtilan hallintajärjestelmä. Sisältää virtuaalisen 3D-mökkiympäristön Lopen mökillä.",
    category: "AI",
    roleInEcosystem: "Sub Project",
    relationshipType: "Virtuaalimökin 3D Työtilagateway",
    supportsProjects: ["Future Projects"],
    dependsOnProjects: ["Aurora Core"],
    recommendedFocus: ["Environment", "Architecture", "Landscape", "3D Cabin Gateway"],
    technologies: ["Three.js", "React", "TypeScript", "IoT Gateway"],
    platform: ["Web", "3D Canvas", "Mobile"],
    relatedProjects: ["Aurora Core", "Qvick Games", "Future AI Companion"],
    currentPhase: "Esituotanto & Virtuaalimökin 3D Gateway",
    nextMilestone: "3D-mökkiympäristön esikatselu & ohjainliittymä",
    completedMilestones: [
      "Virtuaalisen työtilan Gateway-kytkentä Lopen mökillä",
      "Valaistus- ja äänitilamallien määrittely"
    ],
    currentGoals: [
      "3D-mallinnus Lopen mökistä & takkatulen visualisointi",
      "Ympäristölämpötilan ja valaistuksen ohjausohjelmisto"
    ],
    futurePlans: [
      "Aito IoT-laitekytkentä mökille",
      "3D VR-työtila ja ääniohjattu ilmapiiri"
    ],
    documentation: ["Aurora Home 3D Gateway Spec", "Cabin IoT Interface"],
    visualAssets: ["PF_Cabin_3D_Mesh", "Fireplace_3D_Particle"],
    lastUpdated: "2026-07-23",
    isActive: false
  },
  {
    id: "proj-jarven-vartijat",
    name: "Järven Vartijat",
    codeName: "Guardians of the Lake",
    type: "Myyttinen Suojelija- ja Strategiapeli",
    status: "Planning",
    priority: "Normal",
    progress: 20,
    subProgress: { visual: 30, story: 40, audio: 10, testing: 0, code: 20 },
    description: "Myyttinen suojelija- ja strategiapeli pohjoisen järven salaisuuksista ja suomalaisen taruston olennosta.",
    category: "Game",
    roleInEcosystem: "Future Project",
    relationshipType: "Seuraavan Sukupolven Mytologiapeli",
    supportsProjects: [],
    dependsOnProjects: ["Aurora Core", "Qvick Games"],
    recommendedFocus: ["Story", "Mechanics", "Planning", "Lore"],
    technologies: ["Unreal Engine 5", "C++", "FMOD", "Gemini AI"],
    platform: ["PC", "Console"],
    relatedProjects: ["Future flagship game", "Qvick Games"],
    currentPhase: "Peli-ideointi & Lore-suunnittelu",
    nextMilestone: "Prototyypin demo Unreal Engine 5:ssä",
    completedMilestones: [
      "Suomalaisen mytologian taustaloren lukitus",
      "Konseptikuvitus ja ideahautomo"
    ],
    currentGoals: [
      "Pelimekaniikan määrittely & UE5-hankkeen esivalmistelu",
      "Mytologisten hahmojen ja kykyjen suunnittelu"
    ],
    futurePlans: [
      "UE5-demovedos ja FMOD-äänimaailman luonti",
      "Rahoitus- ja julkaisuhaku"
    ],
    documentation: ["Järven Vartijat Lore Bible", "UE5 Architecture Outline"],
    visualAssets: ["Concept_Lake_Guardian", "UE5_Environment_Draft"],
    lastUpdated: "2026-07-23",
    isActive: false
  },
  {
    id: "proj-vr-murder-mystery",
    name: "VR Murder Mystery",
    codeName: "Cabin VR Mystery",
    type: "Virtuaalitodellisuuden Mökkimysteeri",
    status: "Planning",
    priority: "Low",
    progress: 15,
    subProgress: { visual: 20, story: 30, audio: 10, testing: 0, code: 10 },
    description: "Virtuaalitodellisuudessa pelattava kylmäävä mökkimurhamysteeri, joka pohjautuu Murhamysteeri Mökillä -maailmaan.",
    category: "Game",
    roleInEcosystem: "Future Project",
    relationshipType: "Virtuaalitodellisuuden Spinoff-Mysteeri",
    supportsProjects: [],
    dependsOnProjects: ["Murhamysteeri Mökillä", "Aurora Core"],
    recommendedFocus: ["VR Interaction", "Meta Quest", "3D Audio"],
    technologies: ["Unity", "OpenXR", "C#", "FMOD"],
    platform: ["Meta Quest", "SteamVR"],
    relatedProjects: ["Murhamysteeri Mökillä", "Qvick Games"],
    currentPhase: "Konseptisuunnittelu",
    nextMilestone: "VR-interaktioiden prototyyppaus Unityssä",
    completedMilestones: [
      "VR-sovelluksen peruskonseptointi"
    ],
    currentGoals: [
      "Kädenliikkeiden ja esineiden tarttumismekaniikkojen hahmottelu"
    ],
    futurePlans: [
      "VR-demoympäristön rakentaminen"
    ],
    documentation: ["VR Interaction Design Sheet"],
    visualAssets: ["VR_Cabin_Mockup"],
    lastUpdated: "2026-07-23",
    isActive: false
  }
];

class ProjectIdentityEngine {
  private STORAGE_KEY = "aurora_project_identities_v2";
  private projects: ProjectIdentity[] = [];

  constructor() {
    this.loadProjects();
  }

  private loadProjects() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed: ProjectIdentity[] = JSON.parse(stored);
        // Ensure legacy stored objects have ecosystem graph fields populated
        this.projects = parsed.map(p => {
          const matchedInitial = INITIAL_PROJECT_IDENTITIES.find(ip => ip.id === p.id || ip.name.toLowerCase() === p.name.toLowerCase());
          return {
            ...p,
            roleInEcosystem: p.roleInEcosystem || matchedInitial?.roleInEcosystem || 'Related Project',
            relationshipType: p.relationshipType || matchedInitial?.relationshipType || 'Hanke',
            supportsProjects: p.supportsProjects || matchedInitial?.supportsProjects || [],
            dependsOnProjects: p.dependsOnProjects || matchedInitial?.dependsOnProjects || [],
            recommendedFocus: p.recommendedFocus || matchedInitial?.recommendedFocus || []
          };
        });
      } else {
        this.projects = [...INITIAL_PROJECT_IDENTITIES];
        this.saveProjects();
      }
    } catch (e) {
      this.projects = [...INITIAL_PROJECT_IDENTITIES];
    }
  }

  private saveProjects() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.projects));
    } catch (e) {
      // Graceful fallback
    }
  }

  public getProjects(): ProjectIdentity[] {
    return this.projects;
  }

  public getProjectByName(name: string): ProjectIdentity | undefined {
    const n = name.toLowerCase().trim();
    return this.projects.find(p => 
      p.name.toLowerCase().trim() === n || 
      n.includes(p.name.toLowerCase().trim()) ||
      p.name.toLowerCase().trim().includes(n)
    );
  }

  public getProjectById(id: string): ProjectIdentity | undefined {
    return this.projects.find(p => p.id === id);
  }

  public saveProject(project: ProjectIdentity): void {
    const idx = this.projects.findIndex(p => p.id === project.id || p.name.toLowerCase() === project.name.toLowerCase());
    if (idx >= 0) {
      this.projects[idx] = { ...project, lastUpdated: new Date().toISOString().split('T')[0] };
    } else {
      this.projects.push({ ...project, lastUpdated: new Date().toISOString().split('T')[0] });
    }
    this.saveProjects();
  }

  public getRelatedProjects(project: ProjectIdentity): ProjectIdentity[] {
    const relatedNames = project.relatedProjects || [];
    return this.projects.filter(p => 
      p.id !== project.id && 
      (relatedNames.some(rn => p.name.toLowerCase().includes(rn.toLowerCase()) || rn.toLowerCase().includes(p.name.toLowerCase())) ||
       p.relatedProjects.some(prn => prn.toLowerCase().includes(project.name.toLowerCase())))
    );
  }

  public getProjectDependencies(projectName: string) {
    const project = this.getProjectByName(projectName);
    if (!project) return { supports: [], dependsOn: [], related: [] };

    const supports = this.projects.filter(p => (project.supportsProjects || []).some(sp => p.name.toLowerCase().includes(sp.toLowerCase())));
    const dependsOn = this.projects.filter(p => (project.dependsOnProjects || []).some(dp => p.name.toLowerCase().includes(dp.toLowerCase())));
    const related = this.getRelatedProjects(project);

    return { project, supports, dependsOn, related };
  }

  public getEcosystemMap() {
    return [
      {
        step: 1,
        title: "Julkaistu Lippulaivapeli",
        project: this.getProjectByName("Murhamysteeri Mökillä"),
        arrow: "↓ Tukee portfoliota & Aurora Core -kehitystä"
      },
      {
        step: 2,
        title: "Pelistudio & Portfolio Hub",
        project: this.getProjectByName("Qvick Games"),
        arrow: "↓ Mahdollistaa Aurora Core -tekoälyympäristön"
      },
      {
        step: 3,
        title: "Aktiivinen Tekoälyohjain & Sielu",
        project: this.getProjectByName("Aurora Core"),
        arrow: "↓ Ohjaa 3D-työtilaa & Tulevaisuuden pelejä"
      },
      {
        step: 4,
        title: "Virtuaalitila & 3D Gateway",
        project: this.getProjectByName("Aurora Home"),
        arrow: "↓ Avaa väylän tulevaisuuden pelihankkeille"
      },
      {
        step: 5,
        title: "Tulevaisuuden Pelihankkeet",
        project: this.getProjectByName("Järven Vartijat"),
        arrow: "✦ UE5 & VR -kehityssukupolvi"
      }
    ];
  }

  public searchProjects(
    query: string,
    filters?: {
      technology?: string;
      status?: ProjectStatus;
      category?: ProjectCategory;
      priority?: ProjectPriority;
      keyword?: string;
    }
  ): ProjectIdentity[] {
    const q = query.toLowerCase().trim();
    return this.projects.filter(p => {
      // Query check
      const matchesQuery = !q || (
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.currentPhase.toLowerCase().includes(q) ||
        p.nextMilestone.toLowerCase().includes(q) ||
        p.technologies.some(t => t.toLowerCase().includes(q)) ||
        p.platform.some(pl => pl.toLowerCase().includes(q)) ||
        p.relatedProjects.some(rp => rp.toLowerCase().includes(q))
      );

      if (!matchesQuery) return false;

      // Filter checks
      if (filters?.technology && !p.technologies.some(t => t.toLowerCase().includes(filters.technology!.toLowerCase()))) {
        return false;
      }
      if (filters?.status && p.status !== filters.status) {
        return false;
      }
      if (filters?.category && p.category !== filters.category) {
        return false;
      }
      if (filters?.priority && p.priority !== filters.priority) {
        return false;
      }
      if (filters?.keyword) {
        const kw = filters.keyword.toLowerCase();
        const matchesKw = p.name.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.currentGoals.some(g => g.toLowerCase().includes(kw)) ||
          p.futurePlans.some(fp => fp.toLowerCase().includes(kw));
        if (!matchesKw) return false;
      }

      return true;
    });
  }

  public generateRecommendationsForProject(projectName: string): { focusTags: string[]; recommendations: string[] } {
    const p = this.getProjectByName(projectName);
    if (!p) {
      return {
        focusTags: ["Development", "Planning"],
        recommendations: [
          "Tarkastele projektin virstanpylväitä ja tavoitteita.",
          "Aseta projektille selkeä seuraava päätehtävä."
        ]
      };
    }

    const recs: string[] = [];
    const focusTags = p.recommendedFocus || ["Development"];

    if (p.name.includes("Murhamysteeri")) {
      recs.push("📢 Marketing: Valmistele Steam-kauppasivun tekstit, lehdistötiedote ja virallinen peli-traileri.");
      recs.push("🌐 Portfolio: Päivitä qvickgames.fi-sivustolle Murhamysteeri Mökillä -pelin julkaisunäytteet ja kuvakaappaukset.");
      recs.push("🔄 Updates: Seuraa pelaajapalautetta, arvosteluja ja suunnittele mahdolliset bugipäivitykset.");
      recs.push("💬 Community: Aktivoi peliyhteisö ja hyödynnä peli-integraation puitteet tuleviin hankkeisiin.");
    } else if (p.name.includes("Aurora Core")) {
      recs.push("⚙️ Development: Syvennä Alpha 0.8 / Beta 1.0 -puhesynteesiä ja reaaliaikaista kooditukea.");
      recs.push("🧠 Memory: Vahvista persistenttiä muistiarkkitehtuuria v4 ja kontekstuaalista teema-analyysia.");
      recs.push("🖥️ Workspace: Yhdistä Studio OS -dashboard reaktiivisesti Lopen mökin työtila-analytiikkaan.");
      recs.push("✨ Proactive Intelligence: Anna Auroran ennakoida tulevat tehtävät ja viikoittaiset virstanpylväät.");
    } else if (p.name.includes("Aurora Home")) {
      recs.push("🏡 Environment: Luo rauhallinen Lopen mökkimaisema takkatulineen ja äänimaisemineen.");
      recs.push("📐 Architecture: Rakenna virtuaalisen 3D-mökkiympäristön ja Gateway-ohjaimen rajapinnat.");
      recs.push("🌲 Landscape: Sovella pohjoisen järviparatiisin visuaalisia teemoja tilasuunnittelussa.");
      recs.push("🚪 3D Cabin Gateway: Integroi työpöytäobjektit ja interaktiivinen huonenavigaatio.");
    } else if (p.name.includes("Järven Vartijat")) {
      recs.push("📖 Story: Syvenny suomalaiseen tarustoon ja Lopen järviparatiisin myyttisiin vartijoihin.");
      recs.push("⚔️ Mechanics: Määrittele suojelija- ja strategiapelin ydinkortti- ja hahmomekaniikat.");
      recs.push("📝 Planning: Rakenna Unreal Engine 5 C++ -arkkitehtuuripohja ja ensimmäinen demotasomaailma.");
      recs.push("🔮 Lore: Dokumentoi hahmojen erikoiskyvyt ja mytologinen kronikka Idea Vaultiin.");
    } else if (p.status === "Released" || p.progress === 100) {
      recs.push(`🎉 ${p.name} on valmis! Painopisteet: ${focusTags.join(", ")}.`);
      recs.push(`🌐 Päivitä ${p.portfolio || "qvickgames.fi"} -portfolio julkaisunäytteillä.`);
    } else {
      recs.push(`🎯 Nykyinen vaihe (${p.currentPhase}): Painopisteet: ${focusTags.join(", ")}.`);
      recs.push(`📌 Seuraava virstanpylväs: "${p.nextMilestone}".`);
    }

    return { focusTags, recommendations: recs };
  }

  public getKnowledgeLibraryCategories(): { categoryName: string; categoryKey: string; projects: ProjectIdentity[] }[] {
    return [
      {
        categoryName: "Julkaistut Pelit & Lippulaivat",
        categoryKey: "Released Projects",
        projects: this.projects.filter(p => p.status === "Released")
      },
      {
        categoryName: "Aktiiviset Kehityshankkeet",
        categoryKey: "Active Projects",
        projects: this.projects.filter(p => p.status === "In Development" || p.status === "Testing" || p.status === "Prototype")
      },
      {
        categoryName: "Tulevaisuuden Konseptit",
        categoryKey: "Future Projects",
        projects: this.projects.filter(p => p.status === "Planning")
      },
      {
        categoryName: "Tekoäly & Sielumuotojärjestelmät",
        categoryKey: "AI Systems",
        projects: this.projects.filter(p => p.category === "AI")
      },
      {
        categoryName: "Portfolio & Studio-Hubit",
        categoryKey: "Portfolio",
        projects: this.projects.filter(p => p.category === "Portfolio" || p.category === "Website")
      },
      {
        categoryName: "Koulutus & Sertifikaatit",
        categoryKey: "Education",
        projects: this.projects.filter(p => p.category === "Education" || p.name.includes("Xamk"))
      },
      {
        categoryName: "Tutkimus & Esiselvitykset",
        categoryKey: "Research",
        projects: this.projects.filter(p => p.category === "Research")
      }
    ];
  }
}

export const projectIdentityEngine = new ProjectIdentityEngine();
