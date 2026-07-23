import { ProjectDocSummary } from "../types";
import { qvickGamesEcosystemEngine } from "./QvickGamesEcosystemEngine";

class DocumentationAssistantEngine {
  /**
   * Generates a formal, structured documentation summary for any given project.
   */
  public generateProjectDocSummary(projectName: string): ProjectDocSummary {
    const projects = qvickGamesEcosystemEngine.getEcosystemProjects();
    const found = projects.find(p => p.name.toLowerCase().includes(projectName.toLowerCase())) || projects[0];

    if (found.name.includes("Murhamysteeri")) {
      return {
        projectName: "Murhamysteeri Mökillä – Hiljaisen järven salaisuus",
        status: "Julkaistu v1.0 (Flagship Release)",
        progressPercentage: 100,
        progressSummary: "Qvick Gamesin valmistunut ja virallisesti julkaistu elokuvallinen suomalainen murhamysteeri. Täysi peli sisältää 11 tutkintapaikkaa, interaktiivisen tutkintataulun, epäiltyjen kuulustelut, todisteinventaarion ja FMOD-äänimaailman.",
        completedFeatures: [
          "Elokuvallinen päävalikko, suomi & englanti lokalisaatio ja tallennusjärjestelmä",
          "11 tutkintapaikkaa (Olohuone, Keittiö, Antin huone, Vierashuone, Sauna, Venevaja, Vanha varasto, Laituri, Metsäpolku, Rantapolku, Autopaikka)",
          "Interaktiivinen tutkintataulu, todisteinventaario ja vihjeiden kytkennät",
          "Epäiltyjen haastattelut, ristiriita-analyysi ja loppujatko",
          "FMOD-ambienssit, binauraalinen äänisuunnittelu ja Qvick Games -brändäys"
        ],
        remainingWork: [
          "Steam-sivun & trailerin markkinointimateriaalit",
          "Pelaajapalautteen keruu ja mahdolliset patch-päivitykset",
          "Seuraavien Qvick Games -hankkeiden esituotanto"
        ],
        nextMilestone: "Steam Direct & Portfolion päivitys (qwickgames.fi)",
        techStack: found.techStack,
        lastUpdated: found.lastUpdated
      };
    }

    if (found.name.includes("Aurora")) {
      return {
        projectName: "Aurora Qvick Core",
        status: "Alpha 0.9 (Development OS)",
        progressPercentage: 92,
        progressSummary: "Aurora Core toimii Qvick Gamesin tekoälykäyttöjärjestelmänä. Se tarjoaa proaktiivisen työtila-analyysin, monikanavaisen haun (Diary, Memory, Brain, KB, Ideas) sekä syvällisen opinto- ja projektimatriisin.",
        completedFeatures: [
          "Proactive Intelligence Engine & Työskentelyistunnon yhteenveto",
          "Intelligent Cross-System Search (Diary, Memory, KB, Ideas, Docs)",
          "Idea Vault automaattisilla tägeillä ja vaikuttavuusluokituksella",
          "Development Knowledge Library 10 kategorialla",
          "Virallisten Xamk (21 op) ja sertifikaattien integrointi"
        ],
        remainingWork: [
          "Local TTS Voice Synthesis dynamic pitch Control",
          "Automaattinen GitHub Release Pipeline",
          "2D/3D Canvas visualisoinnin syventäminen"
        ],
        nextMilestone: "Aurora Core Alpha 1.0 Candidate",
        techStack: found.techStack,
        lastUpdated: found.lastUpdated
      };
    }

    return {
      projectName: found.name,
      status: found.status + " (" + found.version + ")",
      progressPercentage: found.progress,
      progressSummary: found.description,
      completedFeatures: found.keyFeatures,
      remainingWork: [
        "Jatkonäytösten ja peli-integraatioiden hienosäätö",
        "Dokumentaation ja koodiarkkitehtuurin kattava auditointi"
      ],
      nextMilestone: `Versio ${found.version} virstanpylvään saavuttaminen`,
      techStack: found.techStack,
      lastUpdated: found.lastUpdated
    };
  }
}

export const documentationAssistantEngine = new DocumentationAssistantEngine();
