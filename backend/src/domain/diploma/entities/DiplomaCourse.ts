import { Chapter } from "./Chapter";

export interface DiplomaCourse {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  instructor: string;
  department: string;
  chapters: Chapter[];
  createdAt: Date;
  updatedAt: Date;
} 