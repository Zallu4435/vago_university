import { IconType } from 'react-icons';

export interface Chapter {
  id: string;
  _id?: string; // Backend field
  title: string;
  duration: string;
  videoUrl: string;
  notes: string;
  type: 'video' | 'interactive' | 'quiz' | 'project';
}

export interface DiplomaCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  locked: boolean;
  difficulty: string;
  rating: number;
  students: number;
  icon: string;
  color: string;
  bgColor: string;
  completionRate: number;
  chapters: Chapter[];
  videoCount?: number;
  completedVideoCount?: number;
  status?: string;
}

export interface VideoProgress {
  chapterId: string;
  progress: number;
  completed: boolean;
}

export type ViewMode = 'courses' | 'details' | 'chapter';
export type ChapterType = 'video' | 'interactive' | 'quiz' | 'project'; 