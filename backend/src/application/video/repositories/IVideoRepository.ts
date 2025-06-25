import { GetVideosRequestDTO, GetVideoByIdRequestDTO, CreateVideoRequestDTO, UpdateVideoRequestDTO, DeleteVideoRequestDTO } from "../../../domain/video/dtos/VideoRequestDTOs";
import { GetVideosResponseDTO, GetVideoByIdResponseDTO, CreateVideoResponseDTO, UpdateVideoResponseDTO } from "../../../domain/video/dtos/VideoResponseDTOs";

export interface IVideoRepository {
    getVideos(params: GetVideosRequestDTO): Promise<GetVideosResponseDTO>;
    getVideoById(params: GetVideoByIdRequestDTO): Promise<GetVideoByIdResponseDTO | null>;
    createVideo(params: CreateVideoRequestDTO): Promise<CreateVideoResponseDTO>;
    updateVideo(params: UpdateVideoRequestDTO): Promise<UpdateVideoResponseDTO | null>;
    deleteVideo(params: DeleteVideoRequestDTO): Promise<void>;
} 