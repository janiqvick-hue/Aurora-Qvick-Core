import { SearchResultItem } from "../types";
import { auroraMemoryEngine } from "./AuroraMemoryEngine";
import { knowledgeLibraryEngine } from "./KnowledgeLibraryEngine";
import { ideaVaultEngine } from "./IdeaVaultEngine";
import { qvickGamesEcosystemEngine } from "./QvickGamesEcosystemEngine";
import { projectIdentityEngine } from "./ProjectIdentityEngine";

class IntelligentSearchEngine {
  /**
   * Performs an intelligent cross-system search over Diary, Memory, Project Brain, Knowledge Library, Idea Vault, Documentation, and Project Identities.
   */
  public searchAll(query: string): SearchResultItem[] {
    const results: SearchResultItem[] = [];
    const q = query.toLowerCase().trim();
    if (!q) return results;

    // 0. Search Project Identity Engine
    const projectIdentities = projectIdentityEngine.searchProjects(q);
    projectIdentities.forEach(p => {
      results.push({
        id: `src-[#identity]-${p.id}`,
        sourceType: 'Project Brain',
        title: `Projekti-Identiteetti: ${p.name} (${p.status})`,
        snippet: `${p.type} • Tila: ${p.status} (${p.progress}%) • Teknologiat: ${p.technologies.join(", ")}. Seuraava virstanpylväs: ${p.nextMilestone}. ${p.description}`,
        timestamp: p.lastUpdated,
        category: p.category,
        tags: [...p.technologies, ...p.platform, ...p.relatedProjects],
        linkId: p.id
      });
    });

    // 1. Search Memory Engine
    const memories = auroraMemoryEngine.getMemories();
    memories.forEach(m => {
      if (m.text.toLowerCase().includes(q) || (m.category && m.category.toLowerCase().includes(q))) {
        results.push({
          id: `src-mem-${m.id}`,
          sourceType: 'Memory',
          title: `Sielun Muisto (${m.category || 'Yleinen'})`,
          snippet: m.text,
          timestamp: m.createdAt,
          category: m.category,
          tags: m.tags
        });
      }
    });

    // 2. Search Knowledge Library
    const articles = knowledgeLibraryEngine.searchArticles(q);
    articles.forEach(a => {
      results.push({
        id: `src-kb-${a.id}`,
        sourceType: 'Knowledge',
        title: a.title,
        snippet: a.summary + " — " + a.content.substring(0, 100) + "...",
        timestamp: a.lastUpdated,
        category: a.category,
        tags: a.tags,
        linkId: a.id
      });
    });

    // 3. Search Idea Vault
    const ideas = ideaVaultEngine.getAllIdeas();
    ideas.forEach(i => {
      if (
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q))
      ) {
        results.push({
          id: `src-idea-${i.id}`,
          sourceType: 'Idea',
          title: `Ideapankki: ${i.title}`,
          snippet: i.description,
          timestamp: i.createdAt,
          category: i.category,
          tags: i.tags,
          linkId: i.id
        });
      }
    });

    // 4. Search Diary (localStorage aurora_journal_v1)
    try {
      const storedJournal = localStorage.getItem("aurora_journal_v1");
      if (storedJournal) {
        const journalEntries: { id: string; text: string; timestamp: string; category?: string }[] = JSON.parse(storedJournal);
        journalEntries.forEach(j => {
          if (j.text.toLowerCase().includes(q)) {
            results.push({
              id: `src-journal-${j.id}`,
              sourceType: 'Diary',
              title: `Päiväkirjamerkintä (${new Date(j.timestamp).toLocaleDateString("fi-FI")})`,
              snippet: j.text,
              timestamp: j.timestamp,
              category: j.category
            });
          }
        });
      }
    } catch (e) {
      // Graceful fallback
    }

    // 5. Search Projects & Documentation (QvickGamesEcosystemEngine)
    const projects = qvickGamesEcosystemEngine.getEcosystemProjects();
    projects.forEach(p => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.techStack.some(t => t.toLowerCase().includes(q)) ||
        p.keyFeatures.some(f => f.toLowerCase().includes(q))
      ) {
        results.push({
          id: `src-proj-${p.id}`,
          sourceType: 'Documentation',
          title: `Hanke: ${p.name} (${p.version})`,
          snippet: `${p.description} Tech: ${p.techStack.join(", ")}. Ominaisuudet: ${p.keyFeatures.join(", ")}`,
          timestamp: p.lastUpdated,
          category: p.category,
          tags: p.techStack
        });
      }
    });

    return results;
  }
}

export const intelligentSearchEngine = new IntelligentSearchEngine();
