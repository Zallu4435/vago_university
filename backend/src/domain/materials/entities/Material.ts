export enum MaterialType {
  PDF = "pdf",
  VIDEO = "video"
}

export enum MaterialDifficulty {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced"
}

export interface MaterialProps {
  id?: string;
  title: string;
  description: string;
  subject: string;
  course: string;
  semester: number;
  type: MaterialType;
  fileUrl: string;
  thumbnailUrl: string;
  tags: string[];
  difficulty: MaterialDifficulty;
  estimatedTime: string;
  isNewMaterial: boolean;
  isRestricted: boolean;
  uploadedBy: string;
  uploadedAt: string;
  views: number;
  downloads: number;
  rating: number;
}

export class Material {
  constructor(public props: MaterialProps) {}
  get id() { return this.props.id; }
  // ...add getters as needed
} 