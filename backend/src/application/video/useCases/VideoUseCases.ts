import { IVideoRepository } from '../repositories/IVideoRepository';
import { Video } from '../../../domain/video/entities/Video';
import {
    GetVideosRequestDTO,
    GetVideoByIdRequestDTO,
    CreateVideoRequestDTO,
    UpdateVideoRequestDTO,
    DeleteVideoRequestDTO
} from '../../../domain/video/dtos/VideoRequestDTOs';
import {
    GetVideosResponseDTO,
    GetVideoByIdResponseDTO,
    CreateVideoResponseDTO,
    UpdateVideoResponseDTO
} from '../../../domain/video/dtos/VideoResponseDTOs';
import { VideoErrorType } from "../../../domain/video/enums/VideoErrorType";
import mongoose from "mongoose";

interface ResponseDTO<T> {
    data: T | { error: string };
    success: boolean;
}

export interface IGetVideosUseCase {
    execute(params: GetVideosRequestDTO): Promise<ResponseDTO<GetVideosResponseDTO>>;
}

export interface IGetVideoByIdUseCase {
    execute(params: GetVideoByIdRequestDTO): Promise<ResponseDTO<GetVideoByIdResponseDTO>>;
}

export interface ICreateVideoUseCase {
    execute(params: CreateVideoRequestDTO): Promise<ResponseDTO<CreateVideoResponseDTO>>;
}

export interface IUpdateVideoUseCase {
    execute(params: UpdateVideoRequestDTO): Promise<ResponseDTO<UpdateVideoResponseDTO>>;
}

export interface IDeleteVideoUseCase {
    execute(params: DeleteVideoRequestDTO): Promise<ResponseDTO<{ message: string }>>;
}

export class GetVideosUseCase implements IGetVideosUseCase {
    constructor(private videoRepository: IVideoRepository) {}

    async execute(params: GetVideosRequestDTO): Promise<ResponseDTO<GetVideosResponseDTO>> {
        try {
            if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
                return { data: { error: "Invalid page or limit parameters" }, success: false };
            }

            const result = await this.videoRepository.getVideos(params);
            return { data: result, success: true };
        } catch (error: any) {
            return { data: { error: error.message }, success: false };
        }
    }
}

export class GetVideoByIdUseCase implements IGetVideoByIdUseCase {
    constructor(private videoRepository: IVideoRepository) {}

    async execute(params: GetVideoByIdRequestDTO): Promise<ResponseDTO<GetVideoByIdResponseDTO>> {
        try {
            if (!mongoose.isValidObjectId(params.id)) {
                return { data: { error: VideoErrorType.InvalidVideoId }, success: false };
            }
            const result = await this.videoRepository.getVideoById(params);
            if (!result) {
                return { data: { error: VideoErrorType.VideoNotFound }, success: false };
            }
            return { data: result, success: true };
        } catch (error: any) {
            return { data: { error: error.message }, success: false };
        }
    }
}

export class CreateVideoUseCase implements ICreateVideoUseCase {
    constructor(private videoRepository: IVideoRepository) {}

    async execute(params: CreateVideoRequestDTO): Promise<ResponseDTO<CreateVideoResponseDTO>> {
        try {
            if (!mongoose.isValidObjectId(params.diplomaId)) {
                return { data: { error: VideoErrorType.InvalidDiplomaId }, success: false };
            }
            const video = Video.create(params);
            const result = await this.videoRepository.createVideo(params);
            return { data: result, success: true };
        } catch (error: any) {
            return { data: { error: error.message }, success: false };
        }
    }
}

export class UpdateVideoUseCase implements IUpdateVideoUseCase {
    constructor(private videoRepository: IVideoRepository) {}

    async execute(params: UpdateVideoRequestDTO): Promise<ResponseDTO<UpdateVideoResponseDTO>> {
        try {
            if (!mongoose.isValidObjectId(params.id)) {
                return { data: { error: VideoErrorType.InvalidVideoId }, success: false };
            }
            const result = await this.videoRepository.updateVideo(params);
            if (!result) {
                return { data: { error: VideoErrorType.VideoNotFound }, success: false };
            }
            return { data: result, success: true };
        } catch (error: any) {
            return { data: { error: error.message }, success: false };
        }
    }
}

export class DeleteVideoUseCase implements IDeleteVideoUseCase {
    constructor(private videoRepository: IVideoRepository) {}

    async execute(params: DeleteVideoRequestDTO): Promise<ResponseDTO<{ message: string }>> {
        try {
            if (!mongoose.isValidObjectId(params.id)) {
                return { data: { error: VideoErrorType.InvalidVideoId }, success: false };
            }
            await this.videoRepository.deleteVideo(params);
            return { data: { message: "Video deleted successfully" }, success: true };
        } catch (error: any) {
            return { data: { error: error.message }, success: false };
        }
    }
} 