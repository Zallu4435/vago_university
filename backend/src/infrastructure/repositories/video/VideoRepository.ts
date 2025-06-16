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
                console.error('VideoRepository: Diploma not found for category:', category);
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
        console.log('VideoRepository: getVideoById called with params:', params);
        const { id } = params;
        const video = await VideoModel.findById(id).lean();
        
        if (!video) {
            console.error('VideoRepository: Video not found with id:', id);
            return null;
        }

        console.log('VideoRepository: Found video:', video);
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
        console.log('VideoRepository: createVideo called with params:', {
            ...params,
            videoFile: params.videoFile ? 'File present' : 'No file'
        });

        const { category, ...videoData } = params;

        // First find the diploma by category
        console.log('VideoRepository: Finding diploma for category:', category);
        const diploma = await Diploma.findOne({ category });
        if (!diploma) {
            console.error('VideoRepository: Diploma not found for category:', category);
            throw new Error('Diploma not found for this category');
        }

        // Upload video to Cloudinary if file is provided
        let videoUrl = '';
        if (params.videoFile) {
            console.log('VideoRepository: Uploading video to Cloudinary');
            try {
                const result = await cloudinary.uploader.upload(params.videoFile.path, {
                    resource_type: 'video',
                    folder: 'videos',
                    quality: 'auto'
                });
                videoUrl = result.secure_url;
                console.log('VideoRepository: Video uploaded successfully, URL:', videoUrl);
            } catch (error) {
                console.error('VideoRepository: Failed to upload video to Cloudinary:', error);
                throw new Error('Failed to upload video to Cloudinary');
            }
        } else {
            console.log('VideoRepository: No video file provided for upload');
        }

        console.log('VideoRepository: Creating video in database');
        const video = await VideoModel.create({
            ...videoData,
            diplomaId: diploma._id,
            uploadedAt: new Date(),
            videoUrl
        });

        // Update diploma's videoIds array
        console.log('VideoRepository: Updating diploma with new video ID');
        await Diploma.findByIdAndUpdate(
            diploma._id,
            { $push: { videoIds: video._id } }
        );

        console.log('VideoRepository: Video created successfully:', video);
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
        console.log('VideoRepository: updateVideo called with params:', {
            ...params,
            videoFile: params.videoFile ? 'File present' : 'No file'
        });

        const { id, ...updateData } = params;

        // If new video file is provided, upload it to Cloudinary
        if (params.videoFile) {
            console.log('VideoRepository: Uploading new video to Cloudinary');
            try {
                const result = await cloudinary.uploader.upload(params.videoFile.path, {
                    resource_type: 'video',
                    folder: 'videos',
                    quality: 'auto'
                });
                updateData.videoUrl = result.secure_url;
                console.log('VideoRepository: New video uploaded successfully, URL:', result.secure_url);
            } catch (error) {
                console.error('VideoRepository: Failed to upload new video to Cloudinary:', error);
                throw new Error('Failed to upload video to Cloudinary');
            }
        }

        console.log('VideoRepository: Updating video in database');
        const video = await VideoModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).lean();

        if (!video) {
            console.error('VideoRepository: Video not found for update, id:', id);
            return null;
        }

        console.log('VideoRepository: Video updated successfully:', video);
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
        console.log('VideoRepository: deleteVideo called with params:', params);
        const { id } = params;
        const video = await VideoModel.findById(id);
        
        if (!video) {
            console.error('VideoRepository: Video not found for deletion, id:', id);
            throw new Error('Video not found');
        }

        // Delete video from Cloudinary if it exists
        if (video.videoUrl) {
            console.log('VideoRepository: Deleting video from Cloudinary');
            try {
                const publicId = video.videoUrl.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                    console.log('VideoRepository: Video deleted from Cloudinary successfully');
                }
            } catch (error) {
                console.error('VideoRepository: Failed to delete video from Cloudinary:', error);
            }
        }

        // Remove video from diploma's videoIds array
        console.log('VideoRepository: Removing video from diploma');
        await Diploma.findByIdAndUpdate(
            video.diplomaId,
            { $pull: { videoIds: video._id } }
        );

        console.log('VideoRepository: Deleting video from database');
        await VideoModel.findByIdAndDelete(id);
        console.log('VideoRepository: Video deleted successfully');
    }
} 