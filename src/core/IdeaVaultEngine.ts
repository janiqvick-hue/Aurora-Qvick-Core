import { IdeaCategory, IdeaItem } from "../types";

export const PRESET_IDEAS: IdeaItem[] = [
  {
    id: "idea-1",
    title: "Kalevalainen Mytologiapeli - Järven Vartijat UE5-moottorilla",
    category: "Game Ideas",
    description: "Ensimmäisen persoonan mysteeriseikkailu, jossa hyödynnetään Pohjolan mytologiaa, loitsurunoja ja Unreal Engine 5 Nanite/Lumen -teknologiaa.",
    tags: ["#GameIdea", "#UE5", "#Kalevala", "#Mythology", "#C++"],
    createdAt: "2026-07-20",
    status: "Approved",
    impact: "High"
  },
  {
    id: "idea-2",
    title: "Aurora Voice Assistant - Offline Speech Synthesis & Dynamic Pitching",
    category: "Aurora Ideas",
    description: "Lisätään Auroralle paikallinen lausuntamoottori suomen kielen orgaanista äänensävyä varten.",
    tags: ["#Aurora", "#AI", "#Speech", "#TTS", "#WebAudio"],
    createdAt: "2026-07-22",
    status: "In Evaluation",
    impact: "High"
  },
  {
    id: "idea-3",
    title: "Qvick Games Indie Publishing & Steam Direct Pipeline",
    category: "Business Ideas",
    description: "Valmistellaan 'Murhamysteeri Mökillä' ja 'Järven Vartijat' Steam-kauppasivut sekä mobiiliprototyypit.",
    tags: ["#Business", "#Publishing", "#Steam", "#QvickGames"],
    createdAt: "2026-07-15",
    status: "Draft",
    impact: "High"
  },
  {
    id: "idea-4",
    title: "Tekoälypohjainen Vuorovaikutus Pelikäsikirjoituksissa (LLM Procedural Dialogue)",
    category: "Research",
    description: "Tutkitaan miten Gemini 3.6 Flash voi generoida ei-lineaarisia epäilyksenalaisia vastauksia salapoliisipeleissä ilman rikkoontuvia juoniaukkoja.",
    tags: ["#Research", "#AI", "#Gemini", "#GameDesign", "#LLM"],
    createdAt: "2026-07-18",
    status: "Approved",
    impact: "Medium"
  },
  {
    id: "idea-5",
    title: "Projektin Automaattinen GitHub Release & Build Pipeline (CI/CD)",
    category: "Future Features",
    description: "Automaattiset versiointiskriptit, jotka julkaisevat Aurora Core Alpha -jakeluvedokset GitHubiin napin painalluksella.",
    tags: ["#FutureFeatures", "#GitHub", "#DevOps", "#Automation"],
    createdAt: "2026-07-21",
    status: "Draft",
    impact: "Medium"
  }
];

class IdeaVaultEngine {
  private ideas: IdeaItem[] = [];

  constructor() {
    this.loadIdeas();
  }

  private loadIdeas() {
    try {
      const stored = localStorage.getItem("aurora_idea_vault_v1");
      if (stored) {
        this.ideas = JSON.parse(stored);
      } else {
        this.ideas = [...PRESET_IDEAS];
        this.saveIdeas();
      }
    } catch (e) {
      this.ideas = [...PRESET_IDEAS];
    }
  }

  private saveIdeas() {
    try {
      localStorage.setItem("aurora_idea_vault_v1", JSON.stringify(this.ideas));
    } catch (e) {
      // Graceful fallback
    }
  }

  public getAllIdeas(): IdeaItem[] {
    return this.ideas;
  }

  public getIdeasByCategory(category: IdeaCategory): IdeaItem[] {
    return this.ideas.filter(i => i.category === category);
  }

  public addIdea(title: string, category: IdeaCategory, description: string, impact: 'High' | 'Medium' | 'Low' = 'Medium'): IdeaItem {
    // Automatic tagging
    const tags: string[] = [`#${category.replace(/\s+/g, '')}`];
    const lower = (title + " " + description).toLowerCase();
    
    if (lower.includes("ai") || lower.includes("tekoäly") || lower.includes("gemini")) tags.push("#AI");
    if (lower.includes("game") || lower.includes("peli") || lower.includes("unity")) tags.push("#GameDesign");
    if (lower.includes("c#") || lower.includes("code") || lower.includes("react")) tags.push("#Programming");
    if (lower.includes("aurora") || lower.includes("os")) tags.push("#AuroraOS");
    if (lower.includes("xamk") || lower.includes("opinto")) tags.push("#Studies");
    if (lower.includes("business") || lower.includes("steam")) tags.push("#Business");

    const newIdea: IdeaItem = {
      id: `idea-${Date.now()}`,
      title,
      category,
      description,
      tags,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Draft',
      impact
    };

    this.ideas.unshift(newIdea);
    this.saveIdeas();
    return newIdea;
  }

  public updateIdeaStatus(id: string, status: IdeaItem['status']) {
    const item = this.ideas.find(i => i.id === id);
    if (item) {
      item.status = status;
      this.saveIdeas();
    }
  }
}

export const ideaVaultEngine = new IdeaVaultEngine();
