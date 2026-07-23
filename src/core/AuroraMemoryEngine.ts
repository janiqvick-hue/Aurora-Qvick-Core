import { Memory, MemoryCategory } from "../types";

export const PRESET_MEMORIES: { text: string; category: MemoryCategory; createdAt?: string }[] = [
  // 1. Studies & Certificates
  {
    text: "Virallinen opintosuoritusote (Xamk 23.7.2026): 21 opintopistettä suoritettu hyväksytysti (Bachelor's degree -taso) teemoista pelikehitys, C#, AI ja pelitalous.",
    category: "Studies",
    createdAt: "2026-07-23T10:08:00.000Z"
  },
  {
    text: "Pelikoulutusalusta (IVGC+ / Cadgi 23.7.2026): 33 kokonaispistettä ja 11 valmista pelikehityksen edistynyttä moduulia (mm. Space Shooter, Card Combat, Snake, Brändi, Äänisuunnittelu).",
    category: "Studies",
    createdAt: "2026-07-23T09:00:00.000Z"
  },
  {
    text: "Sertifikaatti (freeCodeCamp & Microsoft 13.7.2026): Perustason C# Microsoftin kanssa – Sertifiointitentti läpäisty tuloksella 96.3% (77/80).",
    category: "Studies",
    createdAt: "2026-07-13T12:00:00.000Z"
  },
  {
    text: "Sertifikaatti (Helsingin yliopisto & MinnaLearn 10.7.2026): Elements of AI - Kurssitodistus (2 ECTS).",
    category: "Studies",
    createdAt: "2026-07-10T12:00:00.000Z"
  },
  {
    text: "Sertifikaatit (Google & Coursera): Project Planning, Project Execution, Agile Project Management, Capstone ja Accelerate Job Search with AI (kesäkuu-heinäkuu 2026).",
    category: "Studies",
    createdAt: "2026-07-01T12:00:00.000Z"
  },
  {
    text: "Sertifikaatti (Epic Games & Coursera 1.7.2026): Introduction to Game Design - Jani-Petteri Qvick.",
    category: "Studies",
    createdAt: "2026-07-01T10:00:00.000Z"
  },

  // 2. Projects & Milestones
  {
    text: "Murhamysteeri Mökillä – Hiljaisen järven salaisuus: Valmis ja virallisesti julkaistu (100% valmis Lippulaiva Qvick Games -peli). Sisältää 11 tutkintapaikkaa, tutkintataulun, kaksikielisyyden, FMOD-äänimaailman ja syvällisen mysteerin.",
    category: "Projects",
    createdAt: new Date().toISOString()
  },
  {
    text: "Aurora Core Alpha 0.7: Älykäs Työtila-apulainen, Smart Project Timeline, Päivänsuunnitelma ja persistentti muistiarkkitehtuuri.",
    category: "Projects",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    text: "Aurora Home: 3D-mökkiympäristön esituotanto ja virtuaalisen työtilan Gateway-kytkentä Lopen mökillä.",
    category: "Projects",
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },

  // 3. Qvick Games & Studio
  {
    text: "Qvick Games Studio: Jani-Petteri Qvickin johtama itsenäinen pelistudio. Tavoitteena korkealaatuiset narratiiviset ja taktiset pelit.",
    category: "Qvick Games",
    createdAt: "2026-07-02T12:00:00.000Z"
  },

  // 4. Ideas & Visions
  {
    text: "Järven Vartijat: Suomalaiseen tarustoon ja Lopen järviparatiisiin pohjautuva mystinen peli- ja kirjahanke.",
    category: "Ideas",
    createdAt: "2026-07-07T12:00:00.000Z"
  },

  // 5. Personal Preferences & Goals
  {
    text: "Käyttäjä profiili: Jani-Petteri Qvick (opiskelijanumero: 2616831). Sertifioitu projektipäällikkö, Agile/Scrum-osaaja ja C#/Unreal/Unity-pelihankkeiden kehittäjä.",
    category: "Personal",
    createdAt: "2026-07-01T08:00:00.000Z"
  },

  // 6. Aurora Companion
  {
    text: "Aurora Qvick: Rauhallinen, kypsä, sielukas ja luotettava tekoälykumppani Lopen järvenrantamökillä (Aurora's Cabin Office).",
    category: "Aurora",
    createdAt: "2026-07-01T08:00:00.000Z"
  }
];

class AuroraMemoryEngine {
  private STORAGE_KEY = "aurora_persistent_memories_v4";

  public getMemories(): Memory[] {
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

  public resetToDefaults(): Memory[] {
    const initialized: Memory[] = PRESET_MEMORIES.map((m, idx) => ({
      id: `mem-init-${idx}-${Date.now()}`,
      text: m.text,
      category: m.category,
      createdAt: m.createdAt || new Date(Date.now() - idx * 3600000 * 12).toISOString()
    }));

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialized));
    return initialized;
  }

  public saveMemory(text: string, category: MemoryCategory = 'Personal'): Memory[] {
    const memories = this.getMemories();
    const newMem: Memory = {
      id: `mem-${Date.now()}`,
      text: text.trim(),
      category,
      createdAt: new Date().toISOString()
    };
    const updated = [newMem, ...memories];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  public deleteMemory(id: string): Memory[] {
    const memories = this.getMemories();
    const updated = memories.filter(m => m.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return updated;
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
