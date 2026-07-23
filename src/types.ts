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
  | 'Education'
  | 'Certificates'
  | 'Qvick Games'
  | 'Aurora'
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

