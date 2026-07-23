import { KnowledgeArticle, KnowledgeCategory } from "../types";

export const PRESET_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: "kb-proj-1",
    title: "Murhamysteeri Mökillä - Arkkitehtuuri & Peli-integraatio",
    category: "Projects",
    summary: "Qvick Gamesin virallisesti julkaistu elokuvallinen suomalainen murhamysteeri (100% valmis lippulaivapeli).",
    content: "Murhamysteeri Mökillä – Hiljaisen järven salaisuus on Qvick Gamesin valmistunut ja virallisesti julkaistu lippulaivapeli. Pelissä tutkitaan 11 virallista tutkintapaikkaa: Olohuone (Living Room), Keittiö (Kitchen), Antin huone (Antti's Room), Vierashuone (Guest Room), Sauna, Venevaja (Boat Shed), Vanha varasto (Old Storage Building), Laituri (Dock), Metsäpolku (Forest Path), Rantapolku (Shore Path) ja Autopaikka (Parking Area). Pelaajat keräävät vihjeitä, hyödyntävät interaktiivista tutkintataulua ja inventaariota, kuulustelevat epäiltyjä ja ratkaisevat mysteerin elokuvallisessa suomalaisessa mökkitunnelmassa.",
    tags: ["Murhamysteeri", "React", "FMOD", "Narrative"],
    lastUpdated: "2026-07-23",
    author: "Jani-Petteri Qvick"
  },
  {
    id: "kb-proj-2",
    title: "Qvick Games Ecosystem Hierarchy & Dependency Relationships",
    category: "Projects",
    summary: "Ekosysteemin rakenne: Murhamysteeri Mökillä → Qvick Games Portfolio → Aurora Core → Aurora Home → Future Projects.",
    content: "Qvick Games -ekosysteemin projekti-identiteetit ja riippuvuudet muodostavat saumattoman ketjun. Lippulaivapeli Murhamysteeri Mökillä syöttää brändiarvoa Qvick Games Portfoliolle. Portfolio tuki Aurora Core -alustan kehitystä. Aurora Core puolestaan syöttää älykkyyttä Aurora Home -ympäristölle sekä tuleville pelihankkeille kuten Järven Vartijat ja Lumottu Kymi. Aurora antaa myös tilakohtaiset suositukset (esim. julkaistulle Murhamysteerille: Marketing, Portfolio, Updates, Community).",
    tags: ["Ecosystem", "Architecture", "Dependencies", "ProjectBrain", "QvickGames"],
    lastUpdated: "2026-07-23",
    author: "Jani-Petteri Qvick"
  },
  {
    id: "kb-prog-1",
    title: "Foundational C# Architecture & Event Dispatching",
    category: "Programming",
    summary: "Microsoft-sertifioidut C#-parhaat käytännöt (96.3% tentti) olio-ohjelmointiin ja async-säikeistykseen.",
    content: "C#-kielen vahvuudet pelimoottoreissa pohjaavat tyypitykseen, LINQ-kyselyihin, delegaatteihin ja async/await-kuvioihin. Qvick Games hyödyntää C#-arkkitehtuuria Unity- ja custom-työkaluissa.",
    tags: ["C#", "Microsoft", "OOP", "LINQ"],
    lastUpdated: "2026-07-13",
    author: "Jani-Petteri Qvick"
  },
  {
    id: "kb-unity-1",
    title: "Unity Space Shooter & Card Combat Game Engine Architecture",
    category: "Unity",
    summary: "Opintokokonaisuus (Xamk 7 op) - Fysiikkamoottorit, partikkeliefektit ja korttikamppailun tilakoneet.",
    content: "Space Shooter Part 6.1 & 6.3 käsittelee partikkelijärjestelmiä, spritetiedostojen optimointia ja vihollisen tekoälykäyttäytymistä. Card Combat (4 op) hyödyntää ScriptableObject-korttipakkoja ja vuoropohjaista tilakonetta.",
    tags: ["Unity", "SpaceShooter", "CardCombat", "ScriptableObject"],
    lastUpdated: "2026-07-19",
    author: "Jani-Petteri Qvick"
  },
  {
    id: "kb-react-1",
    title: "React 18 + Vite + Tailwind CSS Architecture in Aurora Companion",
    category: "React",
    summary: "Modularisoitu single-page state engine, Motion-animaatiot ja custom UI -komponentit.",
    content: "Aurora Qvick Core pohjautuu reaktiiviseen reititykseen, memoituihin komponentteihin (LivingCabinRoom) ja Tailwind-pohjaiseen tummaan mökkiteemaan. HMR on optimoitu pitoilmaisimin.",
    tags: ["React", "TypeScript", "TailwindCSS", "Vite"],
    lastUpdated: "2026-07-23",
    author: "Jani-Petteri Qvick"
  },
  {
    id: "kb-gamedesign-1",
    title: "Game Concept Design & Pelattavuuden Psykologia",
    category: "Game Design",
    summary: "Epic Games & Xamk (Module 18 & 32): Pelimekaniikat, pelaajakoukut ja peli-innovaatiot.",
    content: "Pelisuunnittelussa keskeistä on pelaajan autonomian, kyvykkyyden ja sosiaalisen/narratiivisen liitoksen vahvistaminen. Valinnat tuottavat merkityksellisiä seurauksia.",
    tags: ["GameDesign", "EpicGames", "Mechanics", "UX"],
    lastUpdated: "2026-07-01",
    author: "Jani-Petteri Qvick"
  },
  {
    id: "kb-sound-1",
    title: "Videopelien Äänisuunnittelu & FMOD Audio Synthesizer",
    category: "Sound",
    summary: "IVGC+ M9.3 Äänisuunnittelu: Tausta-ambienssit, binauraalinen tilaääni ja syntetisaattorisilmukat.",
    content: "Äänimaisema luo 50% pelin ilmapiiristä. Suomalaisessa mökkimiljöössä takkatulen ritinä, tuulen ulvonta ja sade ikkunalasiin vaativat saumatonta dynaamista äänensekoitusta.",
    tags: ["Audio", "FMOD", "SoundDesign", "IVGC+"],
    lastUpdated: "2026-07-19",
    author: "Jani-Petteri Qvick"
  },
  {
    id: "kb-gfx-1",
    title: "3D Visuals & Atmosphere Rendering in Aurora Home",
    category: "Graphics",
    summary: "Three.js & Canvas-pohjainen valaistus, hiukkassimulaatio ja mökkipintojen materiaalimallinnus.",
    content: "Visualisoinnissa käytetään pehmeitä orgaanisia valolähteitä (takkatuli, aamuainko) ja syvyysterävyyttä. 2D- ja 3D-elementtien saumaton fuusio.",
    tags: ["Graphics", "Three.js", "Lighting", "UI"],
    lastUpdated: "2026-07-20",
    author: "Jani-Petteri Qvick"
  },
  {
    id: "kb-ai-1",
    title: "Artificial Intelligence for Games & Gemini 3.6 Flash LLM Integration",
    category: "Artificial Intelligence",
    summary: "Xamk Module 16 (2 op) & Elements of AI (2 ECTS): NPC-tekoäly, reitinhaku ja LLM-sielunohjaus.",
    content: "Tekoäly peleissä ulottuu fysiikkapohjaisista A*-reitinhauista monimutkaisiin LLM-pohjaisiin keskustelukaavoihin. Aurora edustaa kontekstitietoista Living Presence Engine -tekoälyä.",
    tags: ["AI", "Gemini", "ElementsOfAI", "Xamk"],
    lastUpdated: "2026-07-23",
    author: "Jani-Petteri Qvick"
  },
  {
    id: "kb-studies-1",
    title: "Xamk Avoin AMK (21 op BD) & Cadgi IVGC+ (33 p) Viralliset Rekisterimerkinnät",
    category: "Studies",
    summary: "Opintosuoritusote 23.7.2026: 11 opintojaksoa Xamkissa ja 11 pelimoduulia Cadgissa.",
    content: "Täydelliset tiedot: Xamk opiskelijanumero 2616831 (Jani-Petteri Qvick). Opintojaksot sisältävät Space Shooterin (7 op), Card Combatin (4 op), AI for Games (2 op), Game Concept Design (2 op) ja teollisuusanalyysit.",
    tags: ["Xamk", "IVGC+", "Certificates", "Transcripts"],
    lastUpdated: "2026-07-23",
    author: "Jani-Petteri Qvick"
  },
  {
    id: "kb-notes-1",
    title: "Lopen Mökin Kehityslabra & Agiilit Sprinttirutiinit",
    category: "Personal Notes",
    summary: "Jani-Petteri Qvickin työtilamuistiinpanot, hiljentymishetket ja pelistudion arvot.",
    content: "Mökki edustaa rauhaa, keskittymistä ja luontoa. Työtahti nojaa Agiiliin sprinttisuunnitteluun (Google PM Cert -sertifiointi) ja laadukkaaseen lopputulokseen ilman hätiköintiä.",
    tags: ["Personal", "Agile", "Workspace", "Cabin"],
    lastUpdated: "2026-07-23",
    author: "Jani-Petteri Qvick"
  }
];

class KnowledgeLibraryEngine {
  private articles: KnowledgeArticle[] = [];

  constructor() {
    this.loadArticles();
  }

  private loadArticles() {
    try {
      const stored = localStorage.getItem("aurora_knowledge_library_v1");
      if (stored) {
        this.articles = JSON.parse(stored);
      } else {
        this.articles = [...PRESET_KNOWLEDGE_ARTICLES];
        this.saveArticles();
      }
    } catch (e) {
      this.articles = [...PRESET_KNOWLEDGE_ARTICLES];
    }
  }

  private saveArticles() {
    try {
      localStorage.setItem("aurora_knowledge_library_v1", JSON.stringify(this.articles));
    } catch (e) {
      // Graceful fallback
    }
  }

  public getAllArticles(): KnowledgeArticle[] {
    this.loadArticles();
    return this.articles.filter(a => !(a as any).isDeleted);
  }

  public getArticlesByCategory(category: KnowledgeCategory): KnowledgeArticle[] {
    return this.getAllArticles().filter(a => a.category === category);
  }

  public addArticle(article: Omit<KnowledgeArticle, 'id' | 'lastUpdated'>): KnowledgeArticle {
    const newArt: KnowledgeArticle = {
      ...article,
      id: `kb-art-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    this.articles.unshift(newArt);
    this.saveArticles();
    return newArt;
  }

  public updateArticle(id: string, updates: Partial<KnowledgeArticle>): KnowledgeArticle | null {
    this.loadArticles();
    const idx = this.articles.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.articles[idx] = {
        ...this.articles[idx],
        ...updates,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      this.saveArticles();
      return this.articles[idx];
    }
    return null;
  }

  public archiveArticle(id: string) {
    this.updateArticle(id, { isArchived: true } as any);
  }

  public restoreArticle(id: string) {
    this.updateArticle(id, { isArchived: false, isDeleted: false } as any);
  }

  public softDeleteArticle(id: string) {
    this.updateArticle(id, { isDeleted: true } as any);
  }

  public searchArticles(query: string): KnowledgeArticle[] {
    const q = query.toLowerCase().trim();
    const active = this.getAllArticles();
    if (!q) return active;
    return active.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  }
}

export const knowledgeLibraryEngine = new KnowledgeLibraryEngine();
