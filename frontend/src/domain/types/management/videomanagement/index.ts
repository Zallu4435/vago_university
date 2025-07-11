// Video management types

export interface Video {
  id: string;
  title: string;
  duration: string;
  uploadedAt: string;
  module: number;
  status: 'Published' | 'Draft';
  diplomaId: string;
  description: string;
  videoUrl: string;
  createdAt?: string;
  updatedAt?: string;
  diploma?: {
    id: string;
    title: string;
    category: string;
  };
}

export interface VideoForEdit {
  _id: string;
  title: string;
  duration: string;
  uploadedAt: string;
  module: number;
  status: 'Published' | 'Draft';
  diplomaId: string;
  description: string;
  videoFile?: File;
  videoUrl: string;
}

export interface Diploma {
  _id: string;
  title: string;
  category: string;
  videoIds: string[];
}

export interface Filters {
  status: string;
  category: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | undefined;
}

export interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoForEdit | null;
}

export interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo: Video | null;
  onSave: (videoData: FormData | Partial<Video>) => void;
  categories: string[];
}

// VideoFormInputs is inferred from zod schema, but define it for type sharing
export interface VideoFormInputs {
  title: string;
  category: string;
  module: string;
  order?: string;
  description: string;
  status: 'Draft' | 'Published';
} 