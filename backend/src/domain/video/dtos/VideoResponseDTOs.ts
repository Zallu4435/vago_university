import { Video } from '../entities/Video';
import { VideoStatus } from '../enums/VideoStatus';

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
}

export interface GetVideosResponseDTO extends PaginatedResponseDTO<VideoSummaryDTO> {}

export interface GetVideoByIdResponseDTO {
    video: Video;
}

export interface CreateVideoResponseDTO {
    video: Video;
}

export interface UpdateVideoResponseDTO {
    video: Video;
} 