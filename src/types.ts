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
  title?: string;
  category?: MemoryCategory;
  tags?: string[];
  isPinned?: boolean;
  importance?: number;
  projectId?: string | null;
  syncStatus?: 'local_only' | 'pending_sync' | 'synced' | 'conflict' | 'sync_error';
  localUpdatedAt?: string;
  cloudUpdatedAt?: string;
  lastSyncedAt?: string | null;
  isArchived?: boolean;
  isDeleted?: boolean;
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

export type ProjectStatus = 
  | 'Planning' 
  | 'Prototype' 
  | 'In Development' 
  | 'Testing' 
  | 'Released' 
  | 'Maintenance' 
  | 'Archived';

export type ProjectPriority = 
  | 'Low' 
  | 'Normal' 
  | 'High' 
  | 'Critical' 
  | 'Completed';

export type ProjectCategory = 
  | 'Game' 
  | 'AI' 
  | 'Website' 
  | 'Research' 
  | 'Education' 
  | 'Portfolio' 
  | 'Internal Tool';

export type EcosystemRole = 
  | 'Main Project' 
  | 'Sub Project' 
  | 'Related Project' 
  | 'Completed Project' 
  | 'Future Project' 
  | 'Support Project';

export interface ProjectIdentity {
  id: string;
  name: string;
  codeName?: string;
  type: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  subProgress?: ProjectSubProgress;
  description: string;
  category: ProjectCategory;
  roleInEcosystem?: EcosystemRole;
  relationshipType?: string;
  supportsProjects?: string[];
  dependsOnProjects?: string[];
  recommendedFocus?: string[];
  technologies: string[];
  platform: string[];
  repository?: string;
  website?: string;
  portfolio?: string;
  relatedProjects: string[];
  currentPhase: string;
  nextMilestone: string;
  completedMilestones: string[];
  currentGoals: string[];
  futurePlans: string[];
  documentation?: string[];
  visualAssets?: string[];
  lastUpdated: string;
  isActive?: boolean;
}

export type ProjectVisualCategory = 
  | 'Hero image' 
  | 'Screenshots' 
  | 'Concept Art' 
  | 'Character Images' 
  | 'Environment Images' 
  | 'UI Images' 
  | 'Documents' 
  | 'Videos' 
  | 'Reference Images';

export interface ProjectVisualAsset {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  url: string;
  category: ProjectVisualCategory;
  description: string;
  addedAt: string;
  tags: string[];
  milestoneTag?: string;
  isHero?: boolean;
}

export interface ProjectVisualTimelineEvent {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  title: string;
  type: 'Project Started' | 'Major Milestone' | 'Latest Screenshot' | 'Newest Concept Art' | 'Latest Documentation' | 'Visual Asset Added';
  description: string;
  assetUrl?: string;
  category?: ProjectVisualCategory;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  type?: string;
  status?: string;
  priority?: string;
  category?: string;
  roleInEcosystem?: EcosystemRole;
  relationshipType?: string;
  supportsProjects?: string[];
  dependsOnProjects?: string[];
  recommendedFocus?: string[];
  progress?: number;
  subProgress?: ProjectSubProgress;
  lastModified?: string;
  lastUpdated?: string;
  activeTasks?: string[];
  completedMilestones?: string[];
  notes?: string;
  technologies?: string[];
  platform?: string[];
  relatedProjects?: string[];
  currentPhase?: string;
  nextMilestone?: string;
  currentGoals?: string[];
  futurePlans?: string[];
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

