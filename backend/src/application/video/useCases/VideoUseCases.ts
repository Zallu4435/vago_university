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
import mongoose from "mongoose";
import { cloudinary } from '../../../config/cloudinary.config';
import { IDiploma } from '../repositories/IVideoRepository';
import {
    InvalidVideoIdError,
    VideoNotFoundError,
    InvalidDiplomaIdError,
    DomainError
} from '../../../domain/video/errors/VideoErrors';

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
    constructor(private videoRepository: IVideoRepository) { }

    async execute(params: GetVideosRequestDTO): Promise<ResponseDTO<GetVideosResponseDTO>> {
        if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
            throw new DomainError("Invalid page or limit parameters");
        }
        let diploma: IDiploma | null = null;
        if (params.category && params.category !== 'all') {
            diploma = await this.videoRepository.findDiplomaByCategory(params.category);
            if (!diploma) {
                throw new InvalidDiplomaIdError();
            }
        }
        const result = await this.videoRepository.getVideos(params);
        return { data: result, success: true };
    }
}

export class GetVideoByIdUseCase implements IGetVideoByIdUseCase {
    constructor(private videoRepository: IVideoRepository) { }

    async execute(params: GetVideoByIdRequestDTO): Promise<ResponseDTO<GetVideoByIdResponseDTO>> {
        if (!mongoose.isValidObjectId(params.id)) {
            throw new InvalidVideoIdError();
        }
        const result = await this.videoRepository.getVideoById(params);
        if (!result || !result.video) {
            throw new VideoNotFoundError();
        }
        const video = result.video as any;
        let diplomaInfo = undefined;
        let diplomaId = video.diplomaId;
        if (typeof diplomaId === 'object' && diplomaId !== null) {
            diplomaId = diplomaId.id || diplomaId._id || '';
        }
        if (diplomaId) {
            const diploma = await this.videoRepository.findDiplomaById(String(diplomaId));
            if (diploma) {
                diplomaInfo = {
                    id: diploma._id.toString(),
                    title: diploma.title,
                    category: diploma.category
                };
            }
        }
        const videoEntity = new Video({
            id: video._id?.toString() || video.id,
            title: video.title,
            duration: video.duration,
            uploadedAt: video.uploadedAt,
            module: video.module,
            status: video.status,
            diplomaId: video.diplomaId?.toString() || '',
            description: video.description,
            videoUrl: video.videoUrl,
            diploma: diplomaInfo
        });
        return { data: { video: videoEntity }, success: true };
    }
}

export class CreateVideoUseCase implements ICreateVideoUseCase {
    constructor(private videoRepository: IVideoRepository) { }

    async execute(params: CreateVideoRequestDTO): Promise<ResponseDTO<CreateVideoResponseDTO>> {
        if (!params.category) {
            throw new InvalidDiplomaIdError();
        }
        if (!params.description || params.description.trim() === '') {
            throw new DomainError('Description is required');
        }
        const diploma = await this.videoRepository.findDiplomaByCategory(params.category);
        if (!diploma) {
            throw new InvalidDiplomaIdError();
        }
        let videoUrl = '';
        if (params.videoFile) {
            try {
                const result = await cloudinary.uploader.upload(params.videoFile.path, {
                    resource_type: 'video',
                    folder: 'videos',
                    quality: 'auto'
                });
                videoUrl = result.secure_url;
            } catch (error: any) {
                throw new DomainError('Failed to upload video to Cloudinary');
            }
        }
        const videoData = {
            ...params,
            diplomaId: diploma._id,
            uploadedAt: new Date(),
            videoUrl
        };
        const created = await this.videoRepository.createVideo(videoData as any);
        await this.videoRepository.addVideoToDiploma(diploma._id, (created.video as any)._id);
        const videoEntity = new Video({
            id: (created.video as any)._id?.toString() || (created.video as any).id,
            title: (created.video as any).title,
            duration: (created.video as any).duration,
            uploadedAt: (created.video as any).uploadedAt,
            module: (created.video as any).module,
            status: (created.video as any).status,
            diplomaId: (created.video as any).diplomaId?.toString() || '',
            description: (created.video as any).description,
            videoUrl: (created.video as any).videoUrl
        });
        return { data: { video: videoEntity }, success: true };
    }
}

export class UpdateVideoUseCase implements IUpdateVideoUseCase {
    constructor(private videoRepository: IVideoRepository) { }

    async execute(params: UpdateVideoRequestDTO): Promise<ResponseDTO<UpdateVideoResponseDTO>> {
        if (!mongoose.isValidObjectId(params.id)) {
            throw new InvalidVideoIdError();
        }
        const result = await this.videoRepository.getVideoById({ id: params.id });
        const existingVideo = result?.video;
        if (!existingVideo) {
            throw new VideoNotFoundError();
        }
        let updateData: any = { ...params };
        if (params.videoFile) {
            if (existingVideo.videoUrl) {
                try {
                    const publicId = existingVideo.videoUrl.split('/').pop()?.split('.')[0];
                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                    }
                } catch (deleteError: any) {
                }
            }
            try {
                const result = await cloudinary.uploader.upload(params.videoFile.path, {
                    resource_type: 'video',
                    folder: 'content',
                    quality: 'auto',
                    timeout: 60000
                });
                updateData.videoUrl = result.secure_url;
            } catch (error: any) {
                throw new DomainError('Failed to upload video to Cloudinary');
            }
        } else {
            if (params.videoUrl) {
                if (!params.videoUrl.trim() || !params.videoUrl.startsWith('http')) {
                    updateData.videoUrl = existingVideo.videoUrl;
                } else {
                    updateData.videoUrl = params.videoUrl;
                }
            } else {
                updateData.videoUrl = existingVideo.videoUrl;
            }
        }
        const updated = await this.videoRepository.updateVideo({ ...updateData, id: params.id });
        if (!updated || !updated.video) {
            throw new VideoNotFoundError();
        }
        const videoEntity = new Video({
            id: (updated.video as any)._id?.toString() || (updated.video as any).id,
            title: (updated.video as any).title,
            duration: (updated.video as any).duration,
            uploadedAt: (updated.video as any).uploadedAt,
            module: (updated.video as any).module,
            status: (updated.video as any).status,
            diplomaId: (updated.video as any).diplomaId?.toString() || '',
            description: (updated.video as any).description,
            videoUrl: (updated.video as any).videoUrl
        });
        return { data: { video: videoEntity }, success: true };
    }
}

export class DeleteVideoUseCase implements IDeleteVideoUseCase {
    constructor(private videoRepository: IVideoRepository) { }

    async execute(params: DeleteVideoRequestDTO): Promise<ResponseDTO<{ message: string }>> {
        if (!mongoose.isValidObjectId(params.id)) {
            throw new InvalidVideoIdError();
        }
        const result = await this.videoRepository.getVideoById({ id: params.id });
        const video = result?.video;
        if (!video) {
            throw new VideoNotFoundError();
        }
        if (video.videoUrl) {
            try {
                const publicId = video.videoUrl.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                }
            } catch (error: any) {
            }
        }
        await this.videoRepository.removeVideoFromDiploma(video.diplomaId, video.id);
        await this.videoRepository.deleteVideo(params);
        return { data: { message: "Video deleted successfully" }, success: true };
    }
} 