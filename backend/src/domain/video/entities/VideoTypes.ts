import { VideoStatus } from '../enums/VideoStatus';

export interface IVideoBase {
  id?: string;
  title: string;
  duration: string;
  module: number;
  status: VideoStatus;
  description: string;
  videoUrl?: string;
  uploadedAt?: Date;
  category?: string;
  diplomaId?: string; // Use string, not mongoose.Types.ObjectId
}

export interface IDiplomaInfo {
  id: string;
  title: string;
  category: string;
}

export interface IVideo extends IVideoBase {
  diploma?: IDiplomaInfo;
} 