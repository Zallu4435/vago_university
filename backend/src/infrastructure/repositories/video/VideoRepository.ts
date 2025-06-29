import { IVideoRepository } from '../../../application/video/repositories/IVideoRepository';
import { GetVideosRequestDTO, GetVideoByIdRequestDTO, CreateVideoRequestDTO, UpdateVideoRequestDTO, DeleteVideoRequestDTO } from '../../../domain/video/dtos/VideoRequestDTOs';
import { GetVideosResponseDTO, GetVideoByIdResponseDTO, CreateVideoResponseDTO, UpdateVideoResponseDTO } from '../../../domain/video/dtos/VideoResponseDTOs';
import { Video as VideoModel } from '../../database/mongoose/models/video.model';
import { Diploma } from '../../database/mongoose/models/diploma.model';
import { Video } from '../../../domain/video/entities/Video';
import { cloudinary } from '../../../config/cloudinary.config';

export class VideoRepository implements IVideoRepository {
    async getVideos(params: GetVideosRequestDTO): Promise<GetVideosResponseDTO> {
        const { category, page, limit, status } = params;

        let query: any = {};

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
        const { id } = params;

        const video = await (VideoModel as any).findById(id)
            .populate('diplomaId', 'title category')
            .lean();

        if (!video) {
            console.error('❌ Video not found with id:', id);
            return null;
        }

        const response = {
            video: new Video(
                video._id.toString(),
                video.title,
                video.duration,
                video.uploadedAt,
                video.module,
                video.status,
                video.diplomaId.toString(),
                video.description,
                video.videoUrl,
                {
                    id: (video.diplomaId as any)._id.toString(),
                    title: (video.diplomaId as any).title,
                    category: (video.diplomaId as any).category
                }
            ),
        };
        return response;
    }

    async createVideo(params: CreateVideoRequestDTO): Promise<CreateVideoResponseDTO> {
        const { category, ...videoData } = params;

        const diploma = await Diploma.findOne({ category });
        if (!diploma) {
            console.error('❌ Diploma not found for category:', category);
            throw new Error('Diploma not found for this category');
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
                console.error('❌ Failed to upload video to Cloudinary:', error);
                console.error('❌ Error details:', {
                    message: error.message,
                    stack: error.stack
                });
                throw new Error('Failed to upload video to Cloudinary');
            }
        } else {
            console.log('⚠️ No video file provided for upload');
        }


        const video = await VideoModel.create({
            ...videoData,
            diplomaId: diploma._id,
            uploadedAt: new Date(),
            videoUrl
        });


        await Diploma.findByIdAndUpdate(
            diploma._id,
            { $push: { videoIds: video._id } }
        );

        const response = {
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
        return response;
    }

    async updateVideo(params: UpdateVideoRequestDTO): Promise<UpdateVideoResponseDTO | null> {


        const { id, ...updateData } = params;

        const existingVideo = await VideoModel.findById(id);

        if (!existingVideo) {
            console.error('❌ Video not found for update, id:', id);
            return null;
        }


        if (params.videoFile) {


            try {
                // Delete old video from Cloudinary if it exists
                if (existingVideo.videoUrl) {
                    try {
                        const publicId = existingVideo.videoUrl.split('/').pop()?.split('.')[0];
                        if (publicId) {
                            await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                        }
                    } catch (deleteError) {
                        console.warn('⚠️ Failed to delete old video from Cloudinary:', deleteError.message);
                    }
                }

                // Upload new video
                const result = await cloudinary.uploader.upload(params.videoFile.path, {
                    resource_type: 'video',
                    folder: 'content',
                    quality: 'auto',
                    timeout: 60000 // 1 minute timeout
                });

                updateData.videoUrl = result.secure_url;

            } catch (error) {
                console.error('❌ Failed to upload new video to Cloudinary:', error);
                console.error('❌ Error details:', {
                    message: error.message,
                    stack: error.stack
                });
                throw new Error('Failed to upload video to Cloudinary');
            }
        } else {

            if (params.videoUrl) {

                // Validate the provided videoUrl
                if (!params.videoUrl.trim()) {
                    console.warn('⚠️ Empty videoUrl provided, falling back to database value');
                    updateData.videoUrl = existingVideo.videoUrl;
                } else if (!params.videoUrl.startsWith('http')) {
                    console.warn('⚠️ Invalid videoUrl format provided, falling back to database value');
                    updateData.videoUrl = existingVideo.videoUrl;
                } else {
                    updateData.videoUrl = params.videoUrl;
                }
            } else {
                updateData.videoUrl = existingVideo.videoUrl;
            }

        }



        const video = await VideoModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            },
            {
                new: true,
                upsert: false
            }
        ).lean();

        if (!video) {
            console.error('❌ Failed to update video in database');
            return null;
        }



        const response = {
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
        return response;
    }

    async deleteVideo(params: DeleteVideoRequestDTO): Promise<void> {
        const { id } = params;
        const video = await VideoModel.findById(id);

        if (!video) {
            console.error('VideoRepository: Video not found for deletion, id:', id);
            throw new Error('Video not found');
        }

        if (video.videoUrl) {
            try {
                const publicId = video.videoUrl.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                }
            } catch (error) {
                console.error('VideoRepository: Failed to delete video from Cloudinary:', error);
            }
        }

        await Diploma.findByIdAndUpdate(
            video.diplomaId,
            { $pull: { videoIds: video._id } }
        );

        await VideoModel.findByIdAndDelete(id);
    }
} 