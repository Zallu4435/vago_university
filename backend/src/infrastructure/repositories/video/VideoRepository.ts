import { IVideoRepository } from '../../../application/video/repositories/IVideoRepository';
import { GetVideosRequestDTO, GetVideoByIdRequestDTO, CreateVideoRequestDTO, UpdateVideoRequestDTO, DeleteVideoRequestDTO } from '../../../domain/video/dtos/VideoRequestDTOs';
import { GetVideosResponseDTO, GetVideoByIdResponseDTO, CreateVideoResponseDTO, UpdateVideoResponseDTO } from '../../../domain/video/dtos/VideoResponseDTOs';
import { Video as VideoModel } from '../../database/mongoose/models/video.model';
import { Diploma } from '../../database/mongoose/models/diploma.model';
import mongoose from 'mongoose';
import { Video } from '../../../domain/video/entities/Video';
import { cloudinary } from '../../../config/cloudinary.config';

export class VideoRepository implements IVideoRepository {
    async getVideos(params: GetVideosRequestDTO): Promise<GetVideosResponseDTO> {
        const { category, page, limit, status } = params;
        
        let query: any = {};
        
        // If category is provided and not 'all', find videos for that category
        if (category && category !== 'all') {
            const diploma = await Diploma.findOne({ category });
            if (!diploma) {
                throw new Error('Diploma not found for this category');
            }
            query.diplomaId = diploma._id;
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        const [videos, totalItems] = await Promise.all([
            VideoModel.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ module: 1, uploadedAt: -1 })
                .lean(),
            VideoModel.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: videos.map(video => ({
                id: video._id.toString(),
                title: video.title,
                duration: video.duration,
                module: video.module,
                status: video.status,
                uploadedAt: video.uploadedAt,
                videoUrl: video.videoUrl,
            })),
            totalItems,
            totalPages,
            currentPage: page,
        };
    }

    async getVideoById(params: GetVideoByIdRequestDTO): Promise<GetVideoByIdResponseDTO | null> {
        const { id } = params;
        const video = await VideoModel.findById(id).lean();
        
        if (!video) return null;

        return {
            video: new Video(
                video._id.toString(),
                video.title,
                video.duration,
                video.uploadedAt,
                video.module,
                video.status,
                video.diplomaId.toString(),
                video.description,
                video.videoUrl
            ),
        };
    }

    async createVideo(params: CreateVideoRequestDTO): Promise<CreateVideoResponseDTO> {
        const { category, ...videoData } = params;

        // First find the diploma by category
        const diploma = await Diploma.findOne({ category });
        if (!diploma) {
            throw new Error('Diploma not found for this category');
        }

        // Upload video to Cloudinary if file is provided
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
                throw new Error('Failed to upload video to Cloudinary');
            }
        }

        const video = await VideoModel.create({
            ...videoData,
            diplomaId: diploma._id,
            uploadedAt: new Date(),
            videoUrl
        });

        // Update diploma's videoIds array
        await Diploma.findByIdAndUpdate(
            diploma._id,
            { $push: { videoIds: video._id } }
        );

        return {
            video: new Video(
                video._id.toString(),
                video.title,
                video.duration,
                video.uploadedAt,
                video.module,
                video.status,
                video.diplomaId.toString(),
                video.description,
                video.videoUrl
            ),
        };
    }

    async updateVideo(params: UpdateVideoRequestDTO): Promise<UpdateVideoResponseDTO | null> {
        const { id, ...updateData } = params;

        // If new video file is provided, upload it to Cloudinary
        if (params.videoFile) {
            try {
                const result = await cloudinary.uploader.upload(params.videoFile.path, {
                    resource_type: 'video',
                    folder: 'videos',
                    quality: 'auto'
                });
                updateData.videoUrl = result.secure_url;
            } catch (error) {
                throw new Error('Failed to upload video to Cloudinary');
            }
        }

        const video = await VideoModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).lean();

        if (!video) return null;

        return {
            video: new Video(
                video._id.toString(),
                video.title,
                video.duration,
                video.uploadedAt,
                video.module,
                video.status,
                video.diplomaId.toString(),
                video.description,
                video.videoUrl
            ),
        };
    }

    async deleteVideo(params: DeleteVideoRequestDTO): Promise<void> {
        const { id } = params;
        const video = await VideoModel.findById(id);
        
        if (!video) {
            throw new Error('Video not found');
        }

        // Delete video from Cloudinary if it exists
        if (video.videoUrl) {
            try {
                const publicId = video.videoUrl.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                }
            } catch (error) {
                console.error('Failed to delete video from Cloudinary:', error);
            }
        }

        // Remove video from diploma's videoIds array
        await Diploma.findByIdAndUpdate(
            video.diplomaId,
            { $pull: { videoIds: video._id } }
        );

        await VideoModel.findByIdAndDelete(id);
    }
} 