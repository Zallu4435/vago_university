import { VideoStatus } from '../enums/VideoStatus';

interface VideoDataDTO {
    title: string;
    duration: string;
    module: number;
    status: VideoStatus;
    description: string;
}

export interface GetVideosRequestDTO {
    category?: string;
    page: number;
    limit: number;
    status?: string;
}

export interface GetVideoByIdRequestDTO {
    id: string;
}

export interface CreateVideoRequestDTO extends VideoDataDTO {
    category: string;
    videoFile?: Express.Multer.File;
}

export interface UpdateVideoRequestDTO extends Partial<VideoDataDTO> {
    id: string;
    videoFile?: Express.Multer.File;
}

export interface DeleteVideoRequestDTO {
    id: string;
}