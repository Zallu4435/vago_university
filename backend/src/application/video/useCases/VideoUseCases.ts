import { IVideoRepository, IRepoDiploma } from '../repositories/IVideoRepository';
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
        // Validation
        if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
            throw new DomainError("Invalid page or limit parameters");
        }

        // Build query object
        const query = await this.buildQuery(params);

        // Get data from repository
        const [videos, totalItems] = await Promise.all([
            this.videoRepository.findVideos(query, params.page, params.limit),
            this.videoRepository.countVideos(query)
        ]);

        // Map and transform data
        const mappedVideos = this.mapVideosToDTO(videos);
        const totalPages = Math.ceil(totalItems / params.limit);

        const result: GetVideosResponseDTO = {
            data: mappedVideos,
            totalItems,
            totalPages,
            currentPage: params.page,
        };

        return { data: result, success: true };
    }

    private async buildQuery(params: GetVideosRequestDTO) {
        const { category, status, dateRange, startDate, endDate, search } = params;
        let query: any = {};

        // Handle category filter
        if (category && category !== 'all') {
            const diploma = await this.videoRepository.findDiplomaByCategory(category);
            if (!diploma) {
                throw new InvalidDiplomaIdError();
            }
            query.diplomaId = diploma._id;
        }

        // Handle status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Handle date range filter
        if (dateRange && dateRange !== 'all') {
            query.uploadedAt = this.buildDateRangeQuery(dateRange, startDate, endDate);
        }

        // Handle search filter
        if (search && search.trim()) {
            query.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        return query;
    }

    private buildDateRangeQuery(dateRange: string, startDate?: string, endDate?: string) {
        const now = new Date();

        switch (dateRange) {
            case 'last_week':
                return {
                    $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                };
            case 'last_month':
                return {
                    $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
                };
            case 'last_3_months':
                return {
                    $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
                };
            case 'custom':
                if (startDate && endDate) {
                    const startDateTime = new Date(startDate);
                    const endDateTime = new Date(endDate);
                    endDateTime.setHours(23, 59, 59, 999);

                    return {
                        $gte: startDateTime,
                        $lte: endDateTime,
                    };
                }
                break;
        }
        return undefined;
    }

    private mapVideosToDTO(videos) {
        return videos.map(video => ({
            id: video._id?.toString() || video.id,
            title: video.title,
            duration: video.duration,
            module: video.module,
            status: video.status,
            uploadedAt: video.uploadedAt,
            videoUrl: video.videoUrl,
            description: video.description,
            diplomaId: video.diplomaId?._id?.toString() || video.diplomaId?.toString() || '',
            diploma: this.mapDiplomaToDTO(video.diplomaId)
        }));
    }

    private mapDiplomaToDTO(diplomaId) {
        if (diplomaId && typeof diplomaId === 'object' && 'title' in diplomaId) {
            return {
                id: diplomaId._id?.toString() || diplomaId.toString(),
                title: diplomaId.title,
                category: diplomaId.category
            };
        }
        return undefined;
    }
}


export class GetVideoByIdUseCase implements IGetVideoByIdUseCase {
    constructor(private videoRepository: IVideoRepository) { }

    async execute(params: GetVideoByIdRequestDTO): Promise<ResponseDTO<GetVideoByIdResponseDTO>> {
        if (!mongoose.isValidObjectId(params.id)) {
            throw new InvalidVideoIdError();
        }
        const video = await this.videoRepository.getVideoById(params.id);
        if (!video) {
            throw new VideoNotFoundError();
        }
        let diplomaInfo = undefined;
        let diplomaId = video.diplomaId;
        
        // Handle populated diplomaId object
        if (diplomaId && typeof diplomaId === 'object' && diplomaId !== null) {
            // If it's a populated object, extract the _id
            if ('_id' in diplomaId) {
                diplomaId = (diplomaId as IRepoDiploma)._id?.toString() || '';
            } else {
                diplomaId = '';
            }
        } else if (diplomaId && diplomaId !== null) {
            // If it's already a string, use it as is
            diplomaId = diplomaId.toString();
        } else {
            diplomaId = '';
        }
        
        if (diplomaId && diplomaId !== '') {
            // Since we already have the populated data, we can construct diplomaInfo directly
            if (video.diplomaId && typeof video.diplomaId === 'object' && '_id' in video.diplomaId) {
                const populatedDiploma = video.diplomaId as IRepoDiploma;
                diplomaInfo = {
                    id: populatedDiploma._id?.toString() || '',
                    title: populatedDiploma.title || '',
                    category: populatedDiploma.category || ''
                };
            } else {
                // Fallback to fetching diploma data
                const diploma = await this.videoRepository.findDiplomaById(diplomaId);
                if (diploma) {
                    diplomaInfo = {
                        id: diploma._id.toString(),
                        title: diploma.title,
                        category: diploma.category
                    };
                }
            }
        }
        const videoEntity = new Video({
            id: video._id?.toString() || video.id,
            title: video.title,
            duration: video.duration,
            uploadedAt: video.uploadedAt,
            module: video.module,
            status: video.status,
            diplomaId: video.diplomaId && typeof video.diplomaId === 'object' && video.diplomaId !== null && '_id' in video.diplomaId 
                ? (video.diplomaId as any)._id?.toString() || ''
                : (video.diplomaId?.toString() || ''),
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
            } catch (error) {
                throw new DomainError('Failed to upload video to Cloudinary');
            }
        }
        const videoData = {
            ...params,
            diplomaId: diploma._id,
            uploadedAt: new Date(),
            videoUrl
        };
        const created = await this.videoRepository.createVideo(videoData);
        await this.videoRepository.addVideoToDiploma(diploma._id, created._id);
        const videoEntity = new Video({
            id: created._id?.toString() || created.id,
            title: created.title,
            duration: created.duration,
            uploadedAt: created.uploadedAt,
            module: created.module,
            status: created.status,
            diplomaId: created.diplomaId?.toString() || '',
            description: created.description,
            videoUrl: created.videoUrl
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
        const existingVideo = await this.videoRepository.getVideoById(params.id);
        if (!existingVideo) {
            throw new VideoNotFoundError();
        }
        let updateData = { ...params };
        if (params.videoFile) {
            if (existingVideo.videoUrl) {
                try {
                    const publicId = existingVideo.videoUrl.split('/').pop()?.split('.')[0];
                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                    }
                } catch (deleteError) {
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
            } catch (error) {
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
        const updated = await this.videoRepository.updateVideo(params.id, { ...updateData });
        if (!updated) {
            throw new VideoNotFoundError();
        }
        const videoEntity = new Video({
            id: updated._id?.toString() || updated.id,
            title: updated.title,
            duration: updated.duration,
            uploadedAt: updated.uploadedAt,
            module: updated.module,
            status: updated.status,
            diplomaId: updated.diplomaId?.toString() || '',
            description: updated.description,
            videoUrl: updated.videoUrl
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
        const video = await this.videoRepository.getVideoById(params.id);
        if (!video) {
            throw new VideoNotFoundError();
        }
        if (video.videoUrl) {
            try {
                const publicId = video.videoUrl.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                }
            } catch (error) {
            }
        }
        const diplomaId = typeof video.diplomaId === 'string' ? video.diplomaId : video.diplomaId?._id?.toString() || '';
        await this.videoRepository.removeVideoFromDiploma(diplomaId, video.id);
        await this.videoRepository.deleteVideo(params.id);
        return { data: { message: "Video deleted successfully" }, success: true };
    }
} 