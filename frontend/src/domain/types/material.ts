export interface Material {
    _id: string;
    title: string;
    description: string;
    subject: string;
    course: string;
    semester: number;
    type: 'pdf' | 'video';
    fileUrl: string;
    thumbnailUrl: string;
    tags: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedTime: string;
    isNew: boolean;
    isRestricted: boolean;
    uploadedBy: string;
    uploadedAt: string;
    views: number;
    downloads: number;
    rating: number;
  }