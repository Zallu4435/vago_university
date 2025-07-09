import { IVideoRepository } from '../../../application/video/repositories/IVideoRepository';
import { GetVideosRequestDTO, GetVideoByIdRequestDTO, CreateVideoRequestDTO, UpdateVideoRequestDTO, DeleteVideoRequestDTO } from '../../../domain/video/dtos/VideoRequestDTOs';
import { GetVideosResponseDTO, GetVideoByIdResponseDTO, CreateVideoResponseDTO, UpdateVideoResponseDTO } from '../../../domain/video/dtos/VideoResponseDTOs';
import { Video as VideoModel } from '../../database/mongoose/models/video.model';
import { Diploma } from '../../database/mongoose/models/diploma.model';

export class VideoRepository implements IVideoRepository {
    async getVideos(params: GetVideosRequestDTO): Promise<GetVideosResponseDTO> {
        const { category, page, limit, status } = params;
        let query: any = {};
        if (category && category !== 'all') {
            const diploma = await Diploma.findOne({ category });
            if (!diploma) throw new Error('Diploma not found for this category');
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