import { 
  ProjectVisualCategory, 
  ProjectVisualAsset, 
  ProjectVisualTimelineEvent 
} from "../types";
import { auroraMemoryEngine } from "./AuroraMemoryEngine";
import { projectIdentityEngine } from "./ProjectIdentityEngine";

export const DEFAULT_VISUAL_ASSETS: ProjectVisualAsset[] = [
  // Murhamysteeri Mökillä
  {
    id: "asset-mm-hero-1",
    projectId: "proj-murhamysteeri",
    projectName: "Murhamysteeri Mökillä",
    title: "v1.0 Julkaisujuliste & Lippulaiva Hero",
    url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80",
    category: "Hero image",
    description: "Virallinen v1.0 julkaisujuliste ja peli-integraation hero-kuva.",
    addedAt: "2026-07-23",
    tags: ["Hero", "Release", "Poster", "v1.0"],
    milestoneTag: "Lippulaivajulkaisu v1.0",
    isHero: true
  },
  {
    id: "asset-mm-screen-1",
    projectId: "proj-murhamysteeri",
    projectName: "Murhamysteeri Mökillä",
    title: "Interaktiivinen Tutkintataulu & Todistemateriaali",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
    category: "Screenshots",
    description: "Tutkintataulun näkymä, jossa todisteet yhdistyvät punaisilla langoilla.",
    addedAt: "2026-07-22",
    tags: ["UI", "Gameplay", "Investigation"],
    milestoneTag: "Peli-integraatio"
  },
  {
    id: "asset-mm-screen-2",
    projectId: "proj-murhamysteeri",
    projectName: "Murhamysteeri Mökillä",
    title: "Lopen Rantasauna & Laiturin Tutkintapaikka",
    url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80",
    category: "Environment Images",
    description: "11 tutkintapaikan joukossa oleva hämärtyvä rantasauna ja laituri.",
    addedAt: "2026-07-20",
    tags: ["Environment", "Lakeside", "Crime Scene"],
    milestoneTag: "11 Tutkintapaikkaa"
  },
  {
    id: "asset-mm-ui-1",
    projectId: "proj-murhamysteeri",
    projectName: "Murhamysteeri Mökillä",
    title: "Kaksikielinen Kuulustelunäkymä & FMOD-ääniohjaus",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
    category: "UI Images",
    description: "Kaksikielinen (FI/EN) vuorovaikutusliittymä ja äänimaiseman asetukset.",
    addedAt: "2026-07-18",
    tags: ["UI", "Audio", "FMOD"],
    milestoneTag: "FMOD Integration"
  },
  {
    id: "asset-mm-concept-1",
    projectId: "proj-murhamysteeri",
    projectName: "Murhamysteeri Mökillä",
    title: "Mökkipihan & Tutkintapaikkojen Karttaluonnos",
    url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80",
    category: "Concept Art",
    description: "Alkuperäinen käsin luonnosteltu pohjakartta 11 tutkintapaikasta.",
    addedAt: "2026-07-10",
    tags: ["Concept", "Map", "Layout"]
  },
  {
    id: "asset-mm-char-1",
    projectId: "proj-murhamysteeri",
    projectName: "Murhamysteeri Mökillä",
    title: "Epäiltyjen Hahmoarkit & Profilointi",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
    category: "Character Images",
    description: "Antin, Maijan ja Villen hahmoprofiilit ja kuulustelumuistiinpanot.",
    addedAt: "2026-07-08",
    tags: ["Character", "Suspects"]
  },
  {
    id: "asset-mm-doc-1",
    projectId: "proj-murhamysteeri",
    projectName: "Murhamysteeri Mökillä",
    title: "Pelin Virallinen Suunnitteludokumentti (GDD v1.0)",
    url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80",
    category: "Documents",
    description: "Kattava 24-sivuinen pelimekaniikka- ja tarinadokumentti.",
    addedAt: "2026-07-05",
    tags: ["GDD", "Documentation"]
  },

  // Aurora Core
  {
    id: "asset-ac-hero-1",
    projectId: "proj-aurora-core",
    projectName: "Aurora Core",
    title: "Aurora Companion Avatar Lopen Mökillä",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    category: "Hero image",
    description: "Auroran sielukas ja rauhallinen tekoälyhahmo mökkitilan äärellä.",
    addedAt: "2026-07-23",
    tags: ["Hero", "Avatar", "Companion"],
    isHero: true
  },
  {
    id: "asset-ac-ui-1",
    projectId: "proj-aurora-core",
    projectName: "Aurora Core",
    title: "Project Brain & Smart Project Timeline Console",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    category: "UI Images",
    description: "Projektiaivojen ja älykkään aikajanan käyttöliittymänäkymä.",
    addedAt: "2026-07-23",
    tags: ["UI", "ProjectBrain", "Console"]
  },
  {
    id: "asset-ac-env-1",
    projectId: "proj-aurora-core",
    projectName: "Aurora Core",
    title: "Lopen Mökki Workdesk & Fireplace Glow FX",
    url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80",
    category: "Environment Images",
    description: "Lopen rantamökin rauhallinen työpöytämiljöö takkatulen loimussa.",
    addedAt: "2026-07-21",
    tags: ["Environment", "Cabin", "Fireplace"]
  },
  {
    id: "asset-ac-doc-1",
    projectId: "proj-aurora-core",
    projectName: "Aurora Core",
    title: "Aurora Core Architecture & Memory Engine Spec v4",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
    category: "Documents",
    description: "Persistentin muistin ja proaktiivisen tekoälyohjaimen arkkitehtuurispesifikaatio.",
    addedAt: "2026-07-15",
    tags: ["Architecture", "Specification"]
  },

  // Aurora Home
  {
    id: "asset-ah-hero-1",
    projectId: "proj-aurora-home",
    projectName: "Aurora Home",
    title: "Virtuaalisen 3D-Mökkiympäristön Renderöinti",
    url: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80",
    category: "Hero image",
    description: "3D Three.js -mallinnettu interaktiivinen mökkiympäristö.",
    addedAt: "2026-07-22",
    tags: ["3D", "Hero", "Render"],
    isHero: true
  },
  {
    id: "asset-ah-env-1",
    projectId: "proj-aurora-home",
    projectName: "Aurora Home",
    title: "Lopen Järvimaisema Auringonlaskun Aikaan",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    category: "Environment Images",
    description: "Valaistus- ja äänimaisemamallinnus iltarutiineja varten.",
    addedAt: "2026-07-20",
    tags: ["Environment", "Sunset", "Lakeside"]
  },

  // Järven Vartijat
  {
    id: "asset-jv-hero-1",
    projectId: "proj-jarven-vartijat",
    projectName: "Järven Vartijat",
    title: "Myyttinen Suojelija – Konseptikuvitus",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    category: "Hero image",
    description: "Pohjoisen vedenhengen ja järvensuojelijan pääkonseptikuva.",
    addedAt: "2026-07-21",
    tags: ["Hero", "Concept", "Mythology"],
    isHero: true
  },
  {
    id: "asset-jv-concept-1",
    projectId: "proj-jarven-vartijat",
    projectName: "Järven Vartijat",
    title: "Muinaiset Riimukivet & Suojeluvoimat",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
    category: "Concept Art",
    description: "Suojelijoiden voimariimut ja magiamekaniikkojen hahmotelmat.",
    addedAt: "2026-07-19",
    tags: ["Concept", "Runes", "Lore"]
  },

  // Qvick Games
  {
    id: "asset-qg-hero-1",
    projectId: "proj-qvick-games",
    projectName: "Qvick Games",
    title: "Qvick Games Virallinen Studiobrändi & Logo",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    category: "Hero image",
    description: "Itsenäisen pelistudion ja portfolion virallinen visuaalinen ilme.",
    addedAt: "2026-07-23",
    tags: ["Brand", "Studio", "Logo"],
    isHero: true
  },
  {
    id: "asset-qg-doc-1",
    projectId: "proj-qvick-games",
    projectName: "Qvick Games",
    title: "Xamk 21 op Opintosuoritusote & Microsoft C# Sertifikaatit",
    url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80",
    category: "Documents",
    description: "Virallinen e-allekirjoitettu opintosuoritusote (Xamk) sekä Google PM & C# todistukset.",
    addedAt: "2026-07-23",
    tags: ["Certificates", "Xamk", "Education"]
  }
];

class ProjectVisualMemoryEngine {
  private STORAGE_KEY = "aurora_project_visual_assets_v1";
  private assets: ProjectVisualAsset[] = [];

  constructor() {
    this.loadAssets();
  }

  private loadAssets() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed: ProjectVisualAsset[] = JSON.parse(stored);
        if (parsed.length > 0) {
          this.assets = parsed;
          return;
        }
      }
      this.assets = [...DEFAULT_VISUAL_ASSETS];
      this.saveAssets();
    } catch (e) {
      this.assets = [...DEFAULT_VISUAL_ASSETS];
    }
  }

  public saveAssets() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.assets));
    } catch (e) {
      // Graceful fallback
    }
  }

  public getAllAssets(): ProjectVisualAsset[] {
    return this.assets;
  }

  public getAssetsByProject(projectNameOrId: string): ProjectVisualAsset[] {
    const q = projectNameOrId.toLowerCase().trim();
    return this.assets
      .filter(a => 
        a.projectId.toLowerCase() === q || 
        a.projectName.toLowerCase() === q ||
        a.projectName.toLowerCase().includes(q) ||
        q.includes(a.projectName.toLowerCase())
      )
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
  }

  public getHeroImage(projectName: string): ProjectVisualAsset | undefined {
    const projectAssets = this.getAssetsByProject(projectName);
    const hero = projectAssets.find(a => a.isHero || a.category === 'Hero image');
    return hero || projectAssets[0];
  }

  public getAssetsByCategory(projectName: string, category: ProjectVisualCategory | 'All'): ProjectVisualAsset[] {
    const projectAssets = this.getAssetsByProject(projectName);
    if (category === 'All') return projectAssets;
    return projectAssets.filter(a => a.category === category);
  }

  /**
   * Smart Image Recognition & Auto-Attachment
   * Categorizes uploaded image/file, attaches it to the project, updates timeline & memory
   */
  public processAndAttachAsset(params: {
    title: string;
    url: string;
    projectName?: string;
    description?: string;
    mimeType?: string;
    tags?: string[];
    forcedCategory?: ProjectVisualCategory;
  }): ProjectVisualAsset {
    const activeProjectName = params.projectName || "Murhamysteeri Mökillä";
    const proj = projectIdentityEngine.getProjectByName(activeProjectName);
    const projectId = proj?.id || `proj-${activeProjectName.toLowerCase().replace(/\s+/g, '-')}`;

    // Auto classify category
    const titleLower = params.title.toLowerCase();
    const descLower = (params.description || "").toLowerCase();
    const mime = (params.mimeType || "").toLowerCase();

    let category: ProjectVisualCategory = params.forcedCategory || 'Screenshots';

    if (!params.forcedCategory) {
      if (titleLower.includes("hero") || titleLower.includes("cover") || titleLower.includes("banner") || titleLower.includes("poster")) {
        category = 'Hero image';
      } else if (titleLower.includes("character") || titleLower.includes("person") || titleLower.includes("suspect") || titleLower.includes("avatar")) {
        category = 'Character Images';
      } else if (titleLower.includes("concept") || titleLower.includes("sketch") || titleLower.includes("drawing") || titleLower.includes("art")) {
        category = 'Concept Art';
      } else if (titleLower.includes("env") || titleLower.includes("cabin") || titleLower.includes("lake") || titleLower.includes("landscape") || titleLower.includes("fire")) {
        category = 'Environment Images';
      } else if (titleLower.includes("ui") || titleLower.includes("hud") || titleLower.includes("menu") || titleLower.includes("dash") || titleLower.includes("screen") || titleLower.includes("board")) {
        category = 'UI Images';
      } else if (mime.includes("pdf") || mime.includes("word") || titleLower.includes("doc") || titleLower.includes("spec") || titleLower.includes("gdd") || titleLower.includes("transcript")) {
        category = 'Documents';
      } else if (mime.includes("video") || titleLower.includes("trailer") || titleLower.includes("vid") || titleLower.includes("mp4")) {
        category = 'Videos';
      } else if (titleLower.includes("ref") || titleLower.includes("mood") || titleLower.includes("inspire")) {
        category = 'Reference Images';
      }
    }

    const newAsset: ProjectVisualAsset = {
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      projectId,
      projectName: proj?.name || activeProjectName,
      title: params.title,
      url: params.url,
      category,
      description: params.description || `Visuaalinen muisto lisätty projektiin ${proj?.name || activeProjectName}.`,
      addedAt: new Date().toISOString().split('T')[0],
      tags: params.tags || [category, "Visual Memory"],
      isHero: category === 'Hero image'
    };

    // If it's a hero image, un-hero older ones
    if (newAsset.isHero) {
      this.assets.forEach(a => {
        if (a.projectName.toLowerCase() === newAsset.projectName.toLowerCase()) {
          a.isHero = false;
        }
      });
    }

    this.assets.unshift(newAsset);
    this.saveAssets();

    // Auto-update memory engine
    auroraMemoryEngine.saveMemory(
      `Visuaalinen muisto [${category}] lisätty projektiin ${newAsset.projectName}: "${newAsset.title}".`,
      'Projects'
    );

    return newAsset;
  }

  /**
   * Generates chronological Visual Timeline combining milestones & media additions
   */
  public getVisualTimeline(projectName: string): ProjectVisualTimelineEvent[] {
    const proj = projectIdentityEngine.getProjectByName(projectName);
    const assets = this.getAssetsByProject(projectName);
    const events: ProjectVisualTimelineEvent[] = [];

    // Project Started Event
    events.push({
      id: `timeline-start-${projectName}`,
      projectId: proj?.id || "proj-unknown",
      projectName: proj?.name || projectName,
      date: proj?.lastUpdated || "2026-07-01",
      title: `Hankkeen aloitus & visio: ${proj?.name || projectName}`,
      type: 'Project Started',
      description: proj?.description || "Projekti luotu Qvick Games -ekosysteemiin."
    });

    // Completed Milestones Events
    if (proj?.completedMilestones) {
      proj.completedMilestones.forEach((m, idx) => {
        events.push({
          id: `timeline-ms-${idx}`,
          projectId: proj.id,
          projectName: proj.name,
          date: "2026-07-22",
          title: `Saavutettu etappi: ${m}`,
          type: 'Major Milestone',
          description: `Hyväksytysti valmis virstanpylväs hankeversiossa ${proj.status}.`
        });
      });
    }

    // Visual Asset Events
    assets.forEach((asset) => {
      let eventType: ProjectVisualTimelineEvent['type'] = 'Visual Asset Added';
      if (asset.category === 'Screenshots') eventType = 'Latest Screenshot';
      else if (asset.category === 'Concept Art') eventType = 'Newest Concept Art';
      else if (asset.category === 'Documents') eventType = 'Latest Documentation';

      events.push({
        id: `timeline-asset-${asset.id}`,
        projectId: asset.projectId,
        projectName: asset.projectName,
        date: asset.addedAt,
        title: `${asset.category}: ${asset.title}`,
        type: eventType,
        description: asset.description,
        assetUrl: asset.url,
        category: asset.category
      });
    });

    // Sort newest first
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Context generator for conversation with Aurora
   */
  public getVisualMemoryContext(projectName: string): string {
    const assets = this.getAssetsByProject(projectName);
    if (assets.length === 0) return "";

    const hero = this.getHeroImage(projectName);
    const latest3 = assets.slice(0, 3);

    const categoriesCount = assets.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const catsSummary = Object.entries(categoriesCount)
      .map(([cat, count]) => `${cat}: ${count} kpl`)
      .join(", ");

    return `[Visuaalinen muisto - ${projectName}: Yhteensä ${assets.length} visualisointia (${catsSummary}). Hero: "${hero?.title || 'Ei asetettu'}". Tuoreimmat lisäykset: ${latest3.map(a => `"${a.title}" [${a.category}]`).join(", ")}]`;
  }
}

export const projectVisualMemoryEngine = new ProjectVisualMemoryEngine();
