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
        console.log('\n🎬 === VIDEO REPOSITORY - GET VIDEO BY ID START ===');
        console.log('📋 Request params:', params);
        
        const { id } = params;
        
        console.log('🔍 Searching for video with ID:', id);
        const video = await VideoModel.findById(id)
            .populate('diplomaId', 'title category')
            .lean();
        
        if (!video) {
            console.error('❌ Video not found with id:', id);
            return null;
        }

        console.log('✅ Video found:', {
            id: video._id,
            title: video.title,
            duration: video.duration,
            module: video.module,
            status: video.status,
            diplomaId: video.diplomaId,
            description: video.description,
            videoUrl: video.videoUrl,
            uploadedAt: video.uploadedAt,
            createdAt: video.createdAt,
            updatedAt: video.updatedAt
        });

        console.log('🎬 === VIDEO REPOSITORY - GET VIDEO BY ID SUCCESS ===');
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
                    id: video.diplomaId._id.toString(),
                    title: video.diplomaId.title,
                    category: video.diplomaId.category
                }
            ),
        };
        console.log('📤 Returning video with diploma info:', response);
        return response;
    }

    async createVideo(params: CreateVideoRequestDTO): Promise<CreateVideoResponseDTO> {
        console.log('\n🎬 === VIDEO REPOSITORY - CREATE VIDEO START ===');
        console.log('📋 Input params:', {
            title: params.title,
            duration: params.duration,
            module: params.module,
            status: params.status,
            description: params.description,
            category: params.category,
            diplomaId: params.diplomaId,
            videoFile: params.videoFile ? {
                originalname: params.videoFile.originalname,
                mimetype: params.videoFile.mimetype,
                size: params.videoFile.size,
                path: params.videoFile.path
            } : 'No file'
        });

        const { category, ...videoData } = params;

        // First find the diploma by category
        console.log('🔍 Finding diploma for category:', category);
        const diploma = await Diploma.findOne({ category });
        if (!diploma) {
            console.error('❌ Diploma not found for category:', category);
            throw new Error('Diploma not found for this category');
        }
        console.log('✅ Diploma found:', {
            id: diploma._id,
            title: diploma.title,
            category: diploma.category
        });

        // Upload video to Cloudinary if file is provided
        let videoUrl = '';
        if (params.videoFile) {
            console.log('☁️ Uploading video to Cloudinary...');
            console.log('📁 File details:', {
                path: params.videoFile.path,
                originalname: params.videoFile.originalname,
                mimetype: params.videoFile.mimetype,
                size: params.videoFile.size
            });
            
            try {
                const result = await cloudinary.uploader.upload(params.videoFile.path, {
                    resource_type: 'video',
                    folder: 'videos',
                    quality: 'auto'
                });
                videoUrl = result.secure_url;
                console.log('✅ Video uploaded successfully to Cloudinary');
                console.log('🔗 Video URL:', videoUrl);
                console.log('📊 Cloudinary result:', {
                    public_id: result.public_id,
                    format: result.format,
                    resource_type: result.resource_type,
                    bytes: result.bytes
                });
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

        console.log('💾 Creating video in database...');
        console.log('📝 Video data to save:', {
            ...videoData,
            diplomaId: diploma._id,
            uploadedAt: new Date(),
            videoUrl
        });

        const video = await VideoModel.create({
            ...videoData,
            diplomaId: diploma._id,
            uploadedAt: new Date(),
            videoUrl
        });

        console.log('✅ Video created in database:', {
            id: video._id,
            title: video.title,
            videoUrl: video.videoUrl
        });

        // Update diploma's videoIds array
        console.log('🔄 Updating diploma with new video ID...');
        await Diploma.findByIdAndUpdate(
            diploma._id,
            { $push: { videoIds: video._id } }
        );
        console.log('✅ Diploma updated with video ID:', video._id);

        console.log('🎬 === VIDEO REPOSITORY - CREATE VIDEO SUCCESS ===');
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
        console.log('📤 Returning response:', response);
        return response;
    }

    async updateVideo(params: UpdateVideoRequestDTO): Promise<UpdateVideoResponseDTO | null> {
        console.log('\n🎬 === VIDEO REPOSITORY - UPDATE VIDEO START ===');
        console.log('📋 Update params:', {
            id: params.id,
            title: params.title,
            duration: params.duration,
            module: params.module,
            status: params.status,
            description: params.description,
            videoUrl: params.videoUrl,
            videoFile: params.videoFile ? {
                originalname: params.videoFile.originalname,
                mimetype: params.videoFile.mimetype,
                size: params.videoFile.size
            } : 'No file'
        });

        const { id, ...updateData } = params;

        // First check if video exists
        console.log('🔍 Checking if video exists:', id);
        const existingVideo = await VideoModel.findById(id);
        
        if (!existingVideo) {
            console.error('❌ Video not found for update, id:', id);
            return null;
        }

        console.log('✅ Video found:', {
            id: existingVideo._id,
            title: existingVideo.title,
            videoUrl: existingVideo.videoUrl
        });

        // Check if this is a video file update or metadata-only update
        if (params.videoFile) {
            console.log('🎬 === VIDEO FILE UPDATE DETECTED ===');
            console.log('☁️ Uploading new video to Cloudinary...');
            console.log('📁 New file details:', {
                path: params.videoFile.path,
                originalname: params.videoFile.originalname,
                mimetype: params.videoFile.mimetype,
                size: params.videoFile.size
            });
            
            try {
                // Delete old video from Cloudinary if it exists
                if (existingVideo.videoUrl) {
                    console.log('🗑️ Deleting old video from Cloudinary');
                    try {
                        const publicId = existingVideo.videoUrl.split('/').pop()?.split('.')[0];
                        if (publicId) {
                            await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                            console.log('✅ Old video deleted from Cloudinary');
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
                console.log('✅ New video uploaded successfully to Cloudinary');
                console.log('🔗 New video URL:', result.secure_url);
                console.log('📊 Cloudinary result:', {
                    public_id: result.public_id,
                    format: result.format,
                    resource_type: result.resource_type,
                    bytes: result.bytes
                });
            } catch (error) {
                console.error('❌ Failed to upload new video to Cloudinary:', error);
                console.error('❌ Error details:', {
                    message: error.message,
                    stack: error.stack
                });
                throw new Error('Failed to upload video to Cloudinary');
            }
        } else {
            console.log('🎬 === METADATA-ONLY UPDATE DETECTED ===');
            console.log('📝 No new video file provided - skipping Cloudinary upload');
            
            // Handle videoUrl for metadata-only updates with validation
            if (params.videoUrl) {
                console.log('🔗 Using provided existing video URL from request:', params.videoUrl);
                
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
                console.log('🔗 No videoUrl provided in request, keeping existing video URL from database:', existingVideo.videoUrl);
                updateData.videoUrl = existingVideo.videoUrl;
            }
            
            console.log('✅ Cloudinary upload skipped - existing video file preserved');
            console.log('✅ Final videoUrl to be saved:', updateData.videoUrl);
        }

        // Update the video in database with upsert
        console.log('💾 Updating video in database...');
        console.log('📝 Update data:', updateData);
        
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
                upsert: false // Don't create if doesn't exist, we already checked
            }
        ).lean();

        if (!video) {
            console.error('❌ Failed to update video in database');
            return null;
        }

        console.log('✅ Video updated successfully in database:', {
            id: video._id,
            title: video.title,
            videoUrl: video.videoUrl,
            updatedAt: video.updatedAt
        });

        console.log('🎬 === VIDEO REPOSITORY - UPDATE VIDEO SUCCESS ===');
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
        console.log('📤 Returning updated video:', response);
        return response;
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