export interface Material {
    id: number;
    title: string;
    subject: string;
    course: string;
    semester: string;
    type: string;
    uploadedBy: string;
    uploadDate: string;
    downloads: number;
    views: number;
    fileSize: string;
    description: string;
    isNew: boolean;
    isRestricted: boolean;
    rating: number;
    tags: string[];
    thumbnail: string;
    difficulty: string;
    estimatedTime: string;
    isBookmarked: boolean;
    isLiked: boolean;
}

export type ViewMode = 'grid' | 'table';
export type SortOption = 'newest' | 'oldest' | 'downloads' | 'views' | 'rating' | 'title'; 