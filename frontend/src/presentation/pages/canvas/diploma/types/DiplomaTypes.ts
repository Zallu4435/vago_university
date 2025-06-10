import { IconType } from 'react-icons';

export interface Chapter {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  notes: string;
  type: 'video' | 'interactive' | 'quiz' | 'project';
}

export interface DiplomaCourse {
  id: number;
  title: string;
  description: string;
  duration: string;
  locked: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  icon: IconType;
  color: string;
  bgColor: string;
  completionRate: number;
  chapters: Chapter[];
}

export type ViewMode = 'courses' | 'details' | 'chapter';
export type ChapterType = 'video' | 'interactive' | 'quiz' | 'project'; 