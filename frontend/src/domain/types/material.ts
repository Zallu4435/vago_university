export interface Material {
    id: string;
    title: string;
    description: string;
    subject: string;
    course: string;
    semester: string;
    type: 'pdf' | 'video';
    fileUrl: string;
    thumbnailUrl: string;
    tags: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedTime: string;
    isNewMaterial: boolean;
    isRestricted: boolean;
    uploadedBy: string;
    uploadedAt: string;
    views: number;
    downloads: number;
    rating: number;
  }