import { qvickGamesEcosystemEngine } from "./QvickGamesEcosystemEngine";
import { auroraMemoryEngine } from "./AuroraMemoryEngine";

export interface ProactiveSuggestion {
  id: string;
  category: 'project' | 'study' | 'github' | 'diary' | 'reminder';
  title: string;
  description: string;
  actionLabel: string;
  priority: 'High' | 'Medium' | 'Low';
  relatedProjectName?: string;
  suggestedActionType?: 'openProject' | 'openDiary' | 'openMemory' | 'openStudioOS' | 'openBrain';
}

export interface SessionSummary {
  id: string;
  timestamp: string;
  projectsWorkedOn: string[];
  completedMilestones: string[];
  updatedMemoriesCount: number;
  recommendedNextTask: string;
  durationMinutes: number;
}

export interface WeeklyProgressReview {
  weekLabel: string;
  completedMilestones: string[];
  currentPriorities: string[];
  mostActiveProjects: { name: string; hoursOrPercentage: string }[];
  inactiveProjects: { name: string; idleTime: string; suggestion: string }[];
  learningProgress: { title: string; detail: string }[];
  certificatesCount: number;
  summaryInsight: string;
}

export interface WorkspaceInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'celebration' | 'reminder';
  message: string;
  timestamp: string;
}

class ProactiveIntelligenceEngine {
  private sessionStartTime: number = Date.now();

  constructor() {
    this.sessionStartTime = Date.now();
  }

  /**
   * Evaluates current workspace state and returns 2-4 meaningful, prioritized suggestions.
   */
  public getProactiveSuggestions(activeProjectName?: string): ProactiveSuggestion[] {
    const suggestions: ProactiveSuggestion[] = [];
    const currentProj = activeProjectName || "Murhamysteeri Mökillä";

    // 1. Unfinished project close to milestone / Released flagship recommendations
    if (currentProj.includes("Murhamysteeri")) {
      suggestions.push({
        id: "sug-murha-released",
        category: "project",
        title: "Murhamysteeri Mökillä - Markkinointi & Steam",
        description: "Murhamysteeri Mökillä on virallisesti julkaistu (100% valmis). Suositellaan Steam-kauppasivun, trailerin ja markkinointimateriaalien hienosäätöä.",
        actionLabel: "Avaa Projektin Aivot",
        priority: "High",
        relatedProjectName: "Murhamysteeri Mökillä",
        suggestedActionType: "openBrain"
      });
    }

    // 2. Recently inactive project
    suggestions.push({
      id: "sug-jarven-40",
      category: "project",
      title: "Palaa Järven Vartijat -konseptiin",
      description: "Järven Vartijat (konseptivaihe 40%) ei ole saanut päivityksiä 8 päivään. Suositellaan 15 minuutin katsausta pohjoisen mytologian muistiinpanoihin.",
      actionLabel: "Avaa Studio OS",
      priority: "Medium",
      relatedProjectName: "Järven Vartijat",
      suggestedActionType: "openStudioOS"
    });

    // 3. Diary check
    const journalStored = localStorage.getItem("aurora_journal_v1");
    const hasTodayEntry = journalStored && journalStored.includes(new Date().toISOString().split('T')[0]);
    if (!hasTodayEntry) {
      suggestions.push({
        id: "sug-diary-today",
        category: "diary",
        title: "Päivitä kehityspäiväkirja",
        description: "Tälle päivälle ei ole vielä tallennettu ilta-reflektiota tai kehitysoivallusta.",
        actionLabel: "Kirjoita Päiväkirjaan",
        priority: "Medium",
        suggestedActionType: "openDiary"
      });
    }

    // 4. Study & Certification opportunity
    suggestions.push({
      id: "sug-study-master",
      category: "study",
      title: "Hyödynnä Xamk 21 op & Microsoft C# -osaamista",
      description: "21 op suoritettu virallisesti (BD). Seuraava looginen askel on Unreal Engine 5 C++ -rajapintojen syventäminen Järven Vartijat -prototyyppiin.",
      actionLabel: "Katso Opinnot",
      priority: "Low",
      suggestedActionType: "openStudioOS"
    });

    return suggestions;
  }

  /**
   * Generates a concise and professional summary of the work session.
   */
  public generateSessionSummary(overrideDurationMinutes?: number): SessionSummary {
    const elapsedMinutes = overrideDurationMinutes || Math.max(1, Math.round((Date.now() - this.sessionStartTime) / 60000));
    const memories = auroraMemoryEngine.getMemories();

    const summary: SessionSummary = {
      id: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
      projectsWorkedOn: ["Murhamysteeri Mökillä (v1.0 Julkaistu)", "Aurora Qvick Core Alpha 0.8"],
      completedMilestones: [
        "Murhamysteeri Mökillä -virallinen julkaisu ja 100% valmiustason saavuttaminen",
        "Proactive Intelligence Engine ja sielun muistikanta päivitetty julkaisutilaan",
        "Työtilan tilastot ja Qvick Games -ekosysteemin viikkokatsaus päivitetty"
      ],
      updatedMemoriesCount: memories.length,
      recommendedNextTask: "Suunnittele Murhamysteeri Mökillä -pelin Steam-traileri, päivitä qvickgames.fi-portfolio ja jatka uuden Järven Vartijat -pelin esituotantoa.",
      durationMinutes: elapsedMinutes
    };

    try {
      const stored = localStorage.getItem("aurora_session_summaries_v1");
      const list: SessionSummary[] = stored ? JSON.parse(stored) : [];
      list.unshift(summary);
      localStorage.setItem("aurora_session_summaries_v1", JSON.stringify(list.slice(0, 10)));
    } catch (e) {
      // Graceful fallback
    }

    return summary;
  }

  /**
   * Retrieves past session summaries.
   */
  public getSessionSummaries(): SessionSummary[] {
    try {
      const stored = localStorage.getItem("aurora_session_summaries_v1");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // Fallback
    }
    return [this.generateSessionSummary(25)];
  }

  /**
   * Compiles data for the Weekly Progress Review dashboard.
   */
  public getWeeklyProgressReview(): WeeklyProgressReview {
    return {
      weekLabel: "Viikko 30 (Heinaskuu 2026)",
      completedMilestones: [
        "Murhamysteeri Mökillä - Hiljaisen järven salaisuus 100% julkaistu ja viimeistelty",
        "Xamk Avoin AMK virallinen opintosuoritusote vahvistettu: 21 op (BD)",
        "Cadgi IVGC+ 33 pistettä ja 11 pelikehitysmoduulia suoritettu",
        "Foundational C# with Microsoft sertifikaatti saavutettu 96,3% tuloksella",
        "Aurora Core Alpha 0.8 Proactive Intelligence Engine alustettu"
      ],
      currentPriorities: [
        "1. Murhamysteeri Mökillä - Steam-sivu, markkinointi & traileri",
        "2. Aurora Core AI Operating System -ohjaimen vakautus",
        "3. Järven Vartijat -mytologiapelin UE5-prototyypin alustus",
        "4. Qvick Games -portfolion päivitys (qvickgames.fi)"
      ],
      mostActiveProjects: [
        { name: "Murhamysteeri Mökillä (Julkaistu)", hoursOrPercentage: "40% työajasta (~16 h)" },
        { name: "Aurora Qvick Core", hoursOrPercentage: "38% työajasta (~15 h)" },
        { name: "Aurora Home 3D", hoursOrPercentage: "12% työajasta (~5 h)" },
        { name: "Qvick Games Portfolio", hoursOrPercentage: "10% työajasta (~4 h)" }
      ],
      inactiveProjects: [
        { 
          name: "Järven Vartijat", 
          idleTime: "8 päivää ilman koodipäivitystä", 
          suggestion: "Konseptivaihe (40%). Kannattaa järjestää 15 min sparraushetki Auroran kanssa kalevalaisesta mytologiasta." 
        }
      ],
      learningProgress: [
        { title: "Xamk Avoin AMK", detail: "21 op / 11 opintojaksoa (Space Shooter 7op, Card Combat 4op, AI 2op)" },
        { title: "Cadgi IVGC+", detail: "33 p / 11 moduulia (M25 Brand, M9.3 Audio, M5 Snake, M32 Game Design)" },
        { title: "Microsoft C# Certification", detail: "96,3% (77/80 oikein, 32 min)" },
        { title: "Google Project Management", detail: "Professional Certificate (Agile, Execution, Capstone)" }
      ],
      certificatesCount: 8,
      summaryInsight: "Viikon painopiste on ollut erittäin tuottava: akateeminen ja ammatillinen osaaminen on vahvistettu 100% virallisin todistein, ja studioinfrastruktuuri on saavuttanut Alpha 0.8 -tason."
    };
  }

  /**
   * Pattern recognition logic for intelligent recommendations based on active state.
   */
  public getIntelligentRecommendations(activeProjectName?: string): string[] {
    const proj = activeProjectName || "Murhamysteeri Mökillä";
    const recommendations: string[] = [];

    if (proj.includes("Murhamysteeri")) {
      recommendations.push("🎉 Lippulaivahanke Valmis (100%): Murhamysteeri Mökillä on virallisesti julkaistu. Keskity markkinointiin, traileriin, Steam-valmisteluun ja pelaajapalautteeseen.");
    }

    recommendations.push("🔄 Uudet Hankkeet: Valmistele Järven Vartijat -pelin Unreal Engine 5 -prototyyppiä ja Aurora Core & Home -kehitystä.");

    recommendations.push("🎓 Sertifikaattihyöty: Hyödynnä Microsoft C# -sertifiointiasi (96.3%) rakentamalla monisäikeisiä työkaluja uusiin peleihin.");

    return recommendations;
  }

  /**
   * Gentle, non-intrusive reminders.
   */
  public getGentleReminders(): string[] {
    return [
      "📌 Muista tallentaa kehityksen oivallukset päiväkirjaan ennen istunnon päätöstä.",
      "📌 Varmuuskopioi projektikoodi GitHubiin (main branch).",
      "📌 Xamk 21 opintopistettä ja sertifikaatit on linkitetty osaksi Auroran muistia."
    ];
  }

  /**
   * Generates contextual observations.
   */
  public getWorkspaceInsights(): WorkspaceInsight[] {
    return [
      {
        id: "ins-1",
        type: "celebration",
        message: "Xamk 21 opintopistettä ja 8 virallista sertifikaattia on vahvistettu ja tallennettu osaksi sielun muistia.",
        timestamp: "Juuri nyt"
      },
      {
        id: "ins-2",
        type: "celebration",
        message: "Murhamysteeri Mökillä on 100% valmis ja virallisesti julkaistu Qvick Games -lippulaivapeli!",
        timestamp: "Juuri nyt"
      },
      {
        id: "ins-3",
        type: "reminder",
        message: "Järven Vartijat -hanke kaipaa pientä konseptipäivitystä ylläpitääkseen vauhtia.",
        timestamp: "1 h sitten"
      }
    ];
  }
}

export const proactiveIntelligenceEngine = new ProactiveIntelligenceEngine();
