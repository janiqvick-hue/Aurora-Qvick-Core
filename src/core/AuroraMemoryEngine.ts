import { Memory, MemoryCategory } from "../types";
import { cloudMemorySyncAdapter } from "./CloudMemorySyncAdapter";

export const AURORA_MEMORY_STORAGE_KEY = "aurora_persistent_memories_v4";

export const PRESET_MEMORIES: { text: string; category: MemoryCategory; createdAt?: string; projectId?: string | null; title?: string }[] = [
  // 1. Studies & Certificates
  {
    title: "Xamk Opintosuoritusote (21 op)",
    text: "Virallinen opintosuoritusote (Xamk 23.7.2026): 21 opintopistettä suoritettu hyväksytysti (Bachelor's degree -taso) teemoista pelikehitys, C#, AI ja pelitalous.",
    category: "Studies",
    createdAt: "2026-07-23T10:08:00.000Z"
  },
  {
    title: "IVGC+ / Cadgi Suoritukset",
    text: "Pelikoulutusalusta (IVGC+ / Cadgi 23.7.2026): 33 kokonaispistettä ja 11 valmista pelikehityksen edistynyttä moduulia (mm. Space Shooter, Card Combat, Snake, Brändi, Äänisuunnittelu).",
    category: "Studies",
    createdAt: "2026-07-23T09:00:00.000Z"
  },
  {
    title: "Foundational C# (freeCodeCamp & Microsoft)",
    text: "Sertifikaatti (freeCodeCamp & Microsoft 13.7.2026): Perustason C# Microsoftin kanssa – Sertifiointitentti läpäisty tuloksella 96.3% (77/80).",
    category: "Studies",
    createdAt: "2026-07-13T12:00:00.000Z"
  },
  {
    title: "Elements of AI (HY & MinnaLearn)",
    text: "Sertifikaatti (Helsingin yliopisto & MinnaLearn 10.7.2026): Elements of AI - Kurssitodistus (2 ECTS).",
    category: "Studies",
    createdAt: "2026-07-10T12:00:00.000Z"
  },
  {
    title: "Google Project Management",
    text: "Sertifikaatit (Google & Coursera): Project Planning, Project Execution, Agile Project Management, Capstone ja Accelerate Job Search with AI (kesäkuu-heinäkuu 2026).",
    category: "Studies",
    createdAt: "2026-07-01T12:00:00.000Z"
  },
  {
    title: "Introduction to Game Design (Epic Games)",
    text: "Sertifikaatti (Epic Games & Coursera 1.7.2026): Introduction to Game Design - Jani-Petteri Qvick.",
    category: "Studies",
    createdAt: "2026-07-01T10:00:00.000Z"
  },

  // 2. Projects & Milestones
  {
    title: "Murhamysteeri Mökillä - Julkaisu",
    text: "Murhamysteeri Mökillä – Hiljaisen järven salaisuus: Valmis ja virallisesti julkaistu (100% valmis Lippulaiva Qvick Games -peli). Sisältää 11 tutkintapaikkaa, tutkintataulun, kaksikielisyyden, FMOD-äänimaailman ja syvällisen mysteerin.",
    category: "Projects",
    projectId: "proj-murhamysteeri",
    createdAt: new Date().toISOString()
  },
  {
    title: "Aurora Core Alpha 0.7",
    text: "Aurora Core Alpha 0.7: Älykäs Työtila-apulainen, Smart Project Timeline, Päivänsuunnitelma ja persistentti muistiarkkitehtuuri.",
    category: "Projects",
    projectId: "proj-aurora-core",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    title: "Aurora Home Esituotanto",
    text: "Aurora Home: 3D-mökkiympäristön esituotanto ja virtuaalisen työtilan Gateway-kytkentä Lopen mökillä.",
    category: "Projects",
    projectId: "proj-aurora-home",
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },

  // 3. Qvick Games & Studio
  {
    title: "Qvick Games Studio",
    text: "Qvick Games Studio: Jani-Petteri Qvickin johtama itsenäinen pelistudio. Tavoitteena korkealaatuiset narratiiviset ja taktiset pelit.",
    category: "Projects",
    projectId: "proj-qvick-games",
    createdAt: "2026-07-02T12:00:00.000Z"
  },

  // 4. Ideas & Visions
  {
    title: "Järven Vartijat Concept",
    text: "Järven Vartijat: Suomalaiseen tarustoon ja Lopen järviparatiisiin pohjautuva mystinen peli- ja kirjahanke.",
    category: "Ideas",
    projectId: "proj-jarven-vartijat",
    createdAt: "2026-07-07T12:00:00.000Z"
  },

  // 5. Personal Preferences & Goals
  {
    title: "Jani-Petteri Qvick Profiili",
    text: "Käyttäjä profiili: Jani-Petteri Qvick (opiskelijanumero: 2616831). Sertifioitu projektipäällikkö, Agile/Scrum-osaaja ja C#/Unreal/Unity-pelihankkeiden kehittäjä.",
    category: "Personal",
    createdAt: "2026-07-01T08:00:00.000Z"
  },

  // 6. Aurora Companion
  {
    title: "Aurora Qvick Identiteetti",
    text: "Aurora Qvick: Rauhallinen, kypsä, sielukas ja luotettava tekoälykumppani Lopen järvenrantamökillä (Aurora's Cabin Office).",
    category: "Aurora",
    createdAt: "2026-07-01T08:00:00.000Z"
  }
];

class AuroraMemoryEngine {
  private STORAGE_KEY = AURORA_MEMORY_STORAGE_KEY;

  public getAllRawMemories(): Memory[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Memory[] = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        // Fallback
      }
    }
    return this.resetToDefaults();
  }

  public getMemories(includeArchived = false, includeDeleted = false): Memory[] {
    const all = this.getAllRawMemories();
    return all.filter(m => {
      if (!includeDeleted && (m as any).isDeleted) return false;
      if (!includeArchived && (m as any).isArchived) return false;
      return true;
    });
  }

  private notifyUpdated(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora_memories_updated'));
    }
  }

  public resetToDefaults(): Memory[] {
    const initialized: Memory[] = PRESET_MEMORIES.map((m, idx) => ({
      id: `mem-init-${idx}-${Date.now()}`,
      title: m.title || undefined,
      text: m.text,
      category: m.category,
      projectId: m.projectId || null,
      createdAt: m.createdAt || new Date(Date.now() - idx * 3600000 * 12).toISOString(),
      syncStatus: 'local_only',
      localUpdatedAt: new Date().toISOString(),
      isPinned: false,
      importance: 3,
      isArchived: false,
      isDeleted: false,
      tags: []
    }));

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialized));
    this.notifyUpdated();
    return initialized;
  }

  public saveMemory(
    text: string, 
    category: MemoryCategory = 'Personal',
    tags: string[] = [],
    isPinned: boolean = false,
    title?: string,
    projectId?: string | null,
    importance?: number
  ): Memory[] {
    const allRaw = this.getAllRawMemories();
    const nowIso = new Date().toISOString();
    const newMem: Memory = {
      id: `mem-${Date.now()}`,
      text: text.trim(),
      title: title?.trim() || undefined,
      category,
      tags: Array.isArray(tags) ? tags : [],
      isPinned: !!isPinned,
      importance: typeof importance === 'number' ? importance : 3,
      projectId: projectId || null,
      createdAt: nowIso,
      syncStatus: 'pending_sync',
      localUpdatedAt: nowIso,
      isArchived: false,
      isDeleted: false
    };

    const updatedRaw = [newMem, ...allRaw];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRaw));

    // Non-blocking dual-write trigger
    cloudMemorySyncAdapter.queueMemoryCreate(newMem);
    this.notifyUpdated();

    return this.getMemories();
  }

  public updateMemory(id: string, text: string, category?: MemoryCategory): Memory[] {
    return this.updateMemoryDetails(id, { text, category });
  }

  public updateMemoryDetails(id: string, updates: Partial<Memory>): Memory[] {
    const allRaw = this.getAllRawMemories();
    const nowIso = new Date().toISOString();
    let updatedMem: Memory | null = null;

    const updatedRaw = allRaw.map(m => {
      if (m.id === id) {
        updatedMem = {
          ...m,
          ...updates,
          text: updates.text !== undefined ? updates.text.trim() : m.text,
          title: updates.title !== undefined ? updates.title?.trim() || undefined : m.title,
          syncStatus: 'pending_sync',
          localUpdatedAt: nowIso
        };
        return updatedMem;
      }
      return m;
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRaw));

    if (updatedMem) {
      cloudMemorySyncAdapter.queueMemoryUpdate(id, updatedMem);
    }
    this.notifyUpdated();

    return this.getMemories();
  }

  public togglePin(id: string): Memory[] {
    const allRaw = this.getAllRawMemories();
    const target = allRaw.find(m => m.id === id);
    if (!target) return this.getMemories();

    return this.updateMemoryDetails(id, { isPinned: !target.isPinned });
  }

  public archiveMemory(id: string): Memory[] {
    const allRaw = this.getAllRawMemories();
    const nowIso = new Date().toISOString();

    const updatedRaw = allRaw.map(m => {
      if (m.id === id) {
        return {
          ...m,
          isArchived: true,
          syncStatus: 'pending_sync',
          localUpdatedAt: nowIso
        };
      }
      return m;
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRaw));

    // Non-blocking background queueing
    cloudMemorySyncAdapter.queueMemoryArchive(id);
    this.notifyUpdated();

    return this.getMemories();
  }

  public restoreMemory(id: string): Memory[] {
    const allRaw = this.getAllRawMemories();
    const nowIso = new Date().toISOString();

    const updatedRaw = allRaw.map(m => {
      if (m.id === id) {
        return {
          ...m,
          isArchived: false,
          isDeleted: false,
          syncStatus: 'pending_sync',
          localUpdatedAt: nowIso
        };
      }
      return m;
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRaw));

    // Non-blocking background queueing
    cloudMemorySyncAdapter.queueMemoryRestore(id);
    this.notifyUpdated();

    return this.getMemories();
  }

  public deleteMemory(id: string): Memory[] {
    const allRaw = this.getAllRawMemories();
    const nowIso = new Date().toISOString();

    // Mark soft deleted in raw list to preserve sync record
    const updatedRaw = allRaw.map(m => {
      if (m.id === id) {
        return {
          ...m,
          isDeleted: true,
          syncStatus: 'pending_sync',
          localUpdatedAt: nowIso
        };
      }
      return m;
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRaw));

    // Non-blocking background queueing
    cloudMemorySyncAdapter.queueMemorySoftDelete(id);
    this.notifyUpdated();

    return this.getMemories();
  }

  public searchMemories(query: string, category?: string): Memory[] {
    const memories = this.getMemories();
    const cleanQuery = query.trim().toLowerCase();

    return memories.filter(m => {
      const matchCat = !category || category === 'All' || m.category === category;
      const matchText = !cleanQuery || m.text.toLowerCase().includes(cleanQuery);
      return matchCat && matchText;
    });
  }

  public getGroupedByTimeline(memoriesList?: Memory[]) {
    const list = memoriesList || this.getMemories();
    const now = new Date();

    const today: Memory[] = [];
    const thisWeek: Memory[] = [];
    const thisMonth: Memory[] = [];
    const older: Memory[] = [];

    list.forEach(m => {
      const d = new Date(m.createdAt);
      const diffHours = (now.getTime() - d.getTime()) / (1000 * 3600);

      if (diffHours <= 24 && d.getDate() === now.getDate()) {
        today.push(m);
      } else if (diffHours <= 24 * 7) {
        thisWeek.push(m);
      } else if (diffHours <= 24 * 30) {
        thisMonth.push(m);
      } else {
        older.push(m);
      }
    });

    return { today, thisWeek, thisMonth, older };
  }

  public retrieveRelevantContext(queryText: string): string {
    const memories = this.getMemories();
    if (!queryText.trim() || memories.length === 0) return "";

    const keywords = queryText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    if (keywords.length === 0) return "";

    const matched = memories.filter(m => {
      const text = m.text.toLowerCase();
      return keywords.some(kw => text.includes(kw));
    });

    if (matched.length === 0) return "";

    const topMatches = matched.slice(0, 4);
    return `[Muistoista haettu konteksti: ${topMatches.map(m => m.text).join(" | ")}]`;
  }
}

export const auroraMemoryEngine = new AuroraMemoryEngine();

