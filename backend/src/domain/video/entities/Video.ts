import { VideoStatus } from '../enums/VideoStatus';
import { IVideo, IDiplomaInfo } from './VideoTypes';

export class Video implements IVideo {
    id: string;
    title: string;
    duration: string;
    uploadedAt: Date;
    module: number;
    status: VideoStatus;
    diplomaId: string;
    description: string;
    videoUrl: string;
    diploma?: IDiplomaInfo;

    constructor(props: IVideo) {
        this.id = props.id || new Date().getTime().toString();
        this.title = props.title;
        this.duration = props.duration;
        this.uploadedAt = props.uploadedAt || new Date();
        this.module = props.module;
        this.status = props.status;
        this.diplomaId = props.diplomaId || '';
        this.description = props.description;
        this.videoUrl = props.videoUrl || '';
        this.diploma = props.diploma;
    }

    static create(props: Omit<IVideo, 'id' | 'uploadedAt'>): Video {
        return new Video({
            ...props,
            id: new Date().getTime().toString(),
            uploadedAt: new Date(),
        });
    }
} 


export interface VideoFilter {
    diplomaId?: string; 
    status?: string;
    uploadedAt?: { $gte?: Date; $lte?: Date };
    $or?: Array<{
      title?: { $regex: string; $options: string };
      description?: { $regex: string; $options: string };
    }>;
    [key: string]: unknown;
  }
  