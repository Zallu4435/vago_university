import { IRepoDiploma, IRepoVideo, IVideoRepository } from '../../../application/video/repositories/IVideoRepository';
import { Video as VideoModel } from '../../database/mongoose/models/video.model';
import { Diploma as DiplomaModel } from '../../database/mongoose/models/diploma.model';
type WithStringId<T> = Omit<T, "_id"> & { _id: string };


export class VideoRepository implements IVideoRepository {
    async findVideos(query: any, page: number, limit: number) {
        const videos = await VideoModel.find(query)
            .populate('diplomaId', 'title category')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ module: 1, uploadedAt: -1 })
            .lean();

        return videos.map((video: any) => ({
            ...video,
            _id: video._id.toString(),
            diplomaId: video.diplomaId?.toString?.() ?? video.diplomaId,
        }));
    }

    async countVideos(query: any) {
        return VideoModel.countDocuments(query);
    }

    async findDiplomaByCategory(category: string) {
        return DiplomaModel.findOne({ category })
        .lean<WithStringId<IRepoDiploma>>({ getters: true });   // 👈 generic added
    }

    async getVideoById(id: string): Promise<IRepoVideo | null> {
        const video = await VideoModel.findById(id)
            .populate('diplomaId', 'title category')
            .lean();
        return video
            ? {
                ...video,
                _id: video._id.toString(),
                diplomaId: video.diplomaId ? video.diplomaId.toString() : "",
            }
            : null;
    }

    async createVideo(video: any): Promise<IRepoVideo> {
        const created = await VideoModel.create({
            ...video,
            uploadedAt: new Date(),
        });
        const obj = created.toObject();
        return {
            ...obj,
            _id: obj._id.toString(),
            diplomaId: obj.diplomaId ? obj.diplomaId.toString() : "",
        };
    }

    async updateVideo(id: string, video: any): Promise<IRepoVideo | null> {
        const updated = await VideoModel.findByIdAndUpdate(
            id,
            { $set: { ...video, updatedAt: new Date() } },
            { new: true, upsert: false }
        ).lean();
        return updated
            ? {
                ...updated,
                _id: updated._id.toString(),
                diplomaId: updated.diplomaId ? updated.diplomaId.toString() : "",
            }
            : null;
    }

    async deleteVideo(id: string) {
        await VideoModel.findByIdAndDelete(id);
    }


    async findDiplomaById(id: string) {
        return DiplomaModel.findById(id)
        .lean<WithStringId<IRepoDiploma>>({ getters: true });   // 👈 generic added
    }
    
    async addVideoToDiploma(diplomaId: string, videoId: string) {
        await DiplomaModel.findByIdAndUpdate(diplomaId, { $push: { videoIds: videoId } });
    }
    async removeVideoFromDiploma(diplomaId: string, videoId: string) {
        await DiplomaModel.findByIdAndUpdate(diplomaId, { $pull: { videoIds: videoId } });
    }
} 