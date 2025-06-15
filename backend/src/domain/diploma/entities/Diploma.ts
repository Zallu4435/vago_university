export enum DiplomaStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
  COMPLETED = "completed"
}

export interface DiplomaProps {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  duration: string;
  prerequisites: string[];
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  videoIds?: string[];
}

export class Diploma {
  public readonly id?: string;
  public readonly title: string;
  public readonly description: string;
  public readonly price: number;
  public readonly category: string;
  public readonly thumbnail: string;
  public readonly duration: string;
  public readonly prerequisites: string[];
  public readonly status: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly videoIds?: string[];

  constructor(props: DiplomaProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.price = props.price;
    this.category = props.category;
    this.thumbnail = props.thumbnail;
    this.duration = props.duration;
    this.prerequisites = props.prerequisites;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.videoIds = props.videoIds;
  }
} 