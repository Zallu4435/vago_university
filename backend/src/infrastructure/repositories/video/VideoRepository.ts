import { IVideoRepository } from '../../../application/video/repositories/IVideoRepository';
import { GetVideosRequestDTO, GetVideoByIdRequestDTO, CreateVideoRequestDTO, UpdateVideoRequestDTO, DeleteVideoRequestDTO } from '../../../domain/video/dtos/VideoRequestDTOs';
import { GetVideosResponseDTO, GetVideoByIdResponseDTO, CreateVideoResponseDTO, UpdateVideoResponseDTO } from '../../../domain/video/dtos/VideoResponseDTOs';
import { Video as VideoModel } from '../../database/mongoose/models/video.model';
import { Diploma } from '../../database/mongoose/models/diploma.model';

export class VideoRepository implements IVideoRepository {
    async getVideos(params: GetVideosRequestDTO): Promise<GetVideosResponseDTO> {
        const { category, page, limit, status, search, dateRange, startDate, endDate } = params;
        
        // Debug logging
        console.log('Video backend received filter values:', { page, limit, status, category, search, dateRange, startDate, endDate });
        
        let query: any = {};
        
        // Handle category filter
        if (category && category !== 'all') {
            const diploma = await Diploma.findOne({ category });
            if (!diploma) throw new Error('Diploma not found for this category');
            query.diplomaId = diploma._id;
        }
        
        // Handle status filter
        if (status && status !== 'all') {
            query.status = status;
        }
        
        // Handle date range filter
        if (dateRange && dateRange !== 'all') {
            const now = new Date();
            if (dateRange === 'last_week') {
                query.uploadedAt = {
                    $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                };
            } else if (dateRange === 'last_month') {
                query.uploadedAt = {
                    $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
                };
            } else if (dateRange === 'last_3_months') {
                query.uploadedAt = {
                    $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
                };
            } else if (dateRange === 'custom' && startDate && endDate) {
                console.log('Processing custom date range:', { startDate, endDate });
                const startDateTime = new Date(startDate);
                const endDateTime = new Date(endDate);
                
                // Set end date to end of day (23:59:59.999)
                endDateTime.setHours(23, 59, 59, 999);
                
                console.log('Processed dates:', { 
                    startDateTime: startDateTime.toISOString(), 
                    endDateTime: endDateTime.toISOString() 
                });
                
                query.uploadedAt = {
                    $gte: startDateTime,
                    $lte: endDateTime,
                };
            }
        }
        
        // Add search functionality
        if (search && search.trim()) {
            query.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        console.log('Video backend final query object:', query);
        
        const [videos, totalItems] = await Promise.all([
            VideoModel.find(query)
                .populate('diplomaId', 'title category')
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
                description: video.description,
                diplomaId: video.diplomaId?._id?.toString() || video.diplomaId?.toString() || '',
                diploma: video.diplomaId ? {
                    id: video.diplomaId._id?.toString() || video.diplomaId.toString(),
                    title: video.diplomaId.title,
                    category: video.diplomaId.category
                } : undefined
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
        if (!video) return null;
        return { video };
    }

    async createVideo(params: CreateVideoRequestDTO): Promise<CreateVideoResponseDTO> {
        const video = await VideoModel.create({
            ...params,
            uploadedAt: new Date(),
        });
        return { video };
    }

    async updateVideo(params: UpdateVideoRequestDTO): Promise<UpdateVideoResponseDTO | null> {
        const { id, ...updateData } = params;
        const video = await VideoModel.findByIdAndUpdate(
            id,
            { $set: { ...updateData, updatedAt: new Date() } },
            { new: true, upsert: false }
        ).lean();
        if (!video) return null;
        return { video };
    }

    async deleteVideo(params: DeleteVideoRequestDTO): Promise<void> {
        const { id } = params;
        await VideoModel.findByIdAndDelete(id);
    }

    async findDiplomaByCategory(category: string) {
        return Diploma.findOne({ category });
    }
    async findDiplomaById(id: string) {
        return Diploma.findById(id);
    }
    async addVideoToDiploma(diplomaId: string, videoId: string) {
        await Diploma.findByIdAndUpdate(diplomaId, { $push: { videoIds: videoId } });
    }
    async removeVideoFromDiploma(diplomaId: string, videoId: string) {
        await Diploma.findByIdAndUpdate(diplomaId, { $pull: { videoIds: videoId } });
    }
} 