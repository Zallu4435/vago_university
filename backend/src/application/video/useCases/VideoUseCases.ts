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
        console.log('\n🎬 === GET VIDEO BY ID USE CASE START ===');
        console.log('📋 Request params:', params);

        try {
            console.log('🔍 Validating video ID:', params.id);
            if (!mongoose.isValidObjectId(params.id)) {
                console.error('❌ Invalid video ID format:', params.id);
                return { data: { error: VideoErrorType.InvalidVideoId }, success: false };
            }
            console.log('✅ Video ID validation passed');

            console.log('🎬 === CALLING VIDEO REPOSITORY ===');
            const result = await this.videoRepository.getVideoById(params);
            
            if (!result) {
                console.error('❌ Video not found in repository');
                return { data: { error: VideoErrorType.VideoNotFound }, success: false };
            }
            
            console.log('✅ Repository result:', result);
            console.log('🎬 === GET VIDEO BY ID USE CASE SUCCESS ===');
            return { data: result, success: true };
        } catch (error: any) {
            console.error('❌ GetVideoByIdUseCase error:', error);
            console.error('❌ Error stack:', error.stack);
            return { data: { error: error.message }, success: false };
        }
    }
}

export class CreateVideoUseCase implements ICreateVideoUseCase {
    constructor(private videoRepository: IVideoRepository) {}

    async execute(params: CreateVideoRequestDTO): Promise<ResponseDTO<CreateVideoResponseDTO>> {
        console.log('\n🎬 === CREATE VIDEO USE CASE START ===');
        console.log('📋 Input params:', {
            title: params.title,
            duration: params.duration,
            module: params.module,
            status: params.status,
            description: params.description,
            category: params.category,
            videoFile: params.videoFile ? {
                originalname: params.videoFile.originalname,
                mimetype: params.videoFile.mimetype,
                size: params.videoFile.size
            } : 'No file'
        });

        try {
            console.log('🔍 Validating category:', params.category);
            if (!params.category) {
                console.error('❌ Category is required');
                return { data: { error: 'Category is required' }, success: false };
            }
            console.log('✅ Category validation passed');

            console.log('🎬 === CALLING VIDEO REPOSITORY ===');
            const result = await this.videoRepository.createVideo(params);
            console.log('✅ Repository result:', result);
            
            console.log('🎬 === CREATE VIDEO USE CASE SUCCESS ===');
            return { data: result, success: true };
        } catch (error: any) {
            console.error('❌ CreateVideoUseCase error:', error);
            console.error('❌ Error stack:', error.stack);
            return { data: { error: error.message }, success: false };
        }
    }
}

export class UpdateVideoUseCase implements IUpdateVideoUseCase {
    constructor(private videoRepository: IVideoRepository) {}

    async execute(params: UpdateVideoRequestDTO): Promise<ResponseDTO<UpdateVideoResponseDTO>> {
        console.log('\n🎬 === UPDATE VIDEO USE CASE START ===');
        console.log('📋 Update params:', {
            id: params.id,
            title: params.title,
            duration: params.duration,
            module: params.module,
            status: params.status,
            description: params.description,
            videoFile: params.videoFile ? {
                originalname: params.videoFile.originalname,
                mimetype: params.videoFile.mimetype,
                size: params.videoFile.size
            } : 'No file'
        });

        try {
            console.log('🔍 Validating video ID:', params.id);
            if (!mongoose.isValidObjectId(params.id)) {
                console.error('❌ Invalid video ID:', params.id);
                return { data: { error: VideoErrorType.InvalidVideoId }, success: false };
            }
            console.log('✅ Video ID validation passed');

            console.log('🎬 === CALLING VIDEO REPOSITORY ===');
            const result = await this.videoRepository.updateVideo(params);
            
            if (!result) {
                console.error('❌ Video not found for update');
                return { data: { error: VideoErrorType.VideoNotFound }, success: false };
            }
            
            console.log('✅ Repository update result:', result);
            console.log('🎬 === UPDATE VIDEO USE CASE SUCCESS ===');
            return { data: result, success: true };
        } catch (error: any) {
            console.error('❌ UpdateVideoUseCase error:', error);
            console.error('❌ Error stack:', error.stack);
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