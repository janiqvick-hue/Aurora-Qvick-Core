export interface Message {
  id: string;
  sender: 'user' | 'aurora';
  text: string;
  timestamp: string;
}

export interface Memory {
  id: string;
  text: string;
  createdAt: string;
  category?: MemoryCategory;
  tags?: string[];
}

export type MemoryCategory = 
  | 'Projects'
  | 'Studies'
  | 'Ideas'
  | 'Personal'
  | 'Aurora'
  | 'Qvick Games'
  | 'Certificates'
  | 'Education'
  | 'Personal Milestones';

export interface ProjectSubProgress {
  visual: number;
  story: number;
  audio: number;
  testing: number;
  code: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  status?: string;
  progress?: number;
  subProgress?: ProjectSubProgress;
  lastModified?: string;
  activeTasks?: string[];
  completedMilestones?: string[];
  notes?: string;
}

export interface JournalEntry {
  id: string;
  text: string;
  timestamp: string;
  category?: 'Observation' | 'Reflection' | 'Idea' | 'Milestone';
  relatedProject?: string;
}

export type EmotionState = 'Calm' | 'Thinking' | 'Creative' | 'Learning' | 'Working' | 'Evening';

export interface MorningBriefing {
  greeting: string;
  currentProjectName: string;
  statusSummary: string;
  suggestedActionPoints: string[];
}

export interface DailySummaryData {
  todayProgress: string[];
  recommendedNextStep: string;
  date: string;
}

export interface IdleActivity {
  id: string;
  label: string;
  description: string;
  activePhrase: string;
  iconName: string;
}

export type KnowledgeCategory = 
  | 'Projects'
  | 'Programming'
  | 'Unity'
  | 'React'
  | 'Game Design'
  | 'Sound'
  | 'Graphics'
  | 'Artificial Intelligence'
  | 'Studies'
  | 'Personal Notes';

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: KnowledgeCategory;
  summary: string;
  content: string;
  tags: string[];
  lastUpdated: string;
  author?: string;
}

export type IdeaCategory = 
  | 'Game Ideas'
  | 'Aurora Ideas'
  | 'Business Ideas'
  | 'Research'
  | 'Future Features';

export interface IdeaItem {
  id: string;
  title: string;
  category: IdeaCategory;
  description: string;
  tags: string[];
  createdAt: string;
  status: 'Draft' | 'In Evaluation' | 'Approved' | 'Archived';
  impact: 'High' | 'Medium' | 'Low';
}

export interface SearchResultItem {
  id: string;
  sourceType: 'Diary' | 'Memory' | 'Project Brain' | 'Knowledge' | 'Idea' | 'Documentation';
  title: string;
  snippet: string;
  timestamp?: string;
  category?: string;
  tags?: string[];
  linkId?: string;
}

export interface ProjectDocSummary {
  projectName: string;
  status: string;
  progressPercentage: number;
  progressSummary: string;
  completedFeatures: string[];
  remainingWork: string[];
  nextMilestone: string;
  techStack: string[];
  lastUpdated: string;
}

