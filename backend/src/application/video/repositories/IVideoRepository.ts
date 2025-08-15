import { IVideoBase, IVideo } from "../../../domain/video/entities/VideoTypes";

export interface IRepoVideo extends Omit<IVideo, 'diplomaId'> {
    _id?: string;
    diplomaId?: string | IRepoDiploma;
}

export interface IRepoDiploma {
    _id?: string;
    title: string;
    description: string;
    price: number;
    category: string;
    thumbnail: string;
    duration: string;
    prerequisites: string[];
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    videoIds: string[];
    students?: string[];
}

export interface IVideoRepository {
    findVideos(query, page: number, limit: number);
    countVideos(query): Promise<number>;
    findDiplomaByCategory(category: string): Promise<IRepoDiploma | null>;
    getVideoById(id: string): Promise<IRepoVideo | null>;
    createVideo(video: IVideoBase & { diplomaId: string; videoFile?: Express.Multer.File }): Promise<IRepoVideo>;
    updateVideo(id: string, video: Partial<IVideoBase> & { diplomaId?: string; videoFile?: Express.Multer.File }): Promise<IRepoVideo | null>;
    deleteVideo(id: string): Promise<void>;
    findDiplomaById(id: string): Promise<IRepoDiploma | null>;
    addVideoToDiploma(diplomaId: string, videoId: string): Promise<void>;
    removeVideoFromDiploma(diplomaId: string, videoId: string): Promise<void>;
} 