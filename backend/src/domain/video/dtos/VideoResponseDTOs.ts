import { VideoStatus } from '../enums/VideoStatus';
import { IVideo } from '../entities/VideoTypes';

interface PaginatedResponseDTO<T> {
    data: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export interface VideoSummaryDTO {
    id: string;
    title: string;
    duration: string;       
    module: number;
    status: VideoStatus;
    uploadedAt: Date;
    videoUrl: string;
    description: string;
    diplomaId: string;
    diploma?: {
        id: string;
        title: string;
        category: string;
    };
}

export interface GetVideosResponseDTO extends PaginatedResponseDTO<VideoSummaryDTO> {}

export interface GetVideoByIdResponseDTO {
    video: IVideo;
}

export interface CreateVideoResponseDTO {
    video: IVideo;
}

export interface UpdateVideoResponseDTO {
    video: IVideo;
} 

export interface ResponseDTO<T> {
    data: T | { error: string };
    success: boolean;
}