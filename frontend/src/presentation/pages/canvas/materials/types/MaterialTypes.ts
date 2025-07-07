export interface MaterialData {
    id: string;
    title: string;
    description: string;
    subject: string;
    course: string;
    semester: number;
    type: string;
    fileUrl: string;
    thumbnailUrl: string;
    tags: string[];
    difficulty: string;
    estimatedTime: string;
    isNew: boolean;
    isRestricted: boolean;
    uploadedBy: string;
    uploadedAt: string;
    views: number;
    downloads: number;
    rating: number;
    isBookmarked: boolean;
    isLiked: boolean;
}

export interface Material {
    props?: MaterialData;
    id: string;
    title: string;
    description: string;
    subject: string;
    course: string;
    semester: number;
    type: string;
    fileUrl: string;
    thumbnailUrl: string;
    tags: string[];
    difficulty: string;
    estimatedTime: string;
    isNew: boolean;
    isRestricted: boolean;
    uploadedBy: string;
    uploadedAt: string;
    views: number;
    downloads: number;
    rating: number;
    isBookmarked: boolean;
    isLiked: boolean;
}

export type ViewMode = 'grid' | 'table';
export type SortOption = 'newest' | 'oldest' | 'downloads' | 'views' | 'rating' | 'title'; 