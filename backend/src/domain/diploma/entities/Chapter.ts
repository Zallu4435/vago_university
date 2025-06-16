export interface Chapter {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
} 