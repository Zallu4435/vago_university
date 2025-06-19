import { Chapter } from "./Chapter";
import { Video } from "../../video/entities/Video";

export interface DiplomaCourse {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  instructor: string;
  department: string;
  chapters: Chapter[];
  videos?: Video[];
  createdAt: Date;
  updatedAt: Date;
} 