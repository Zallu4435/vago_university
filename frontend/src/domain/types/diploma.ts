export interface Video {
    _id: string;
    title: string;
    duration: string;
    uploadedAt: string;
    module: number;
    status: 'Draft' | 'Published';
    diplomaId: string;
    description: string;
  }
  
  export interface Diploma {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    thumbnail: string;
    duration: string;
    prerequisites: string[];
    status: boolean;
    createdAt: string;
    updatedAt: string;
    videoIds: string[]; // References to video IDs
  }