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
    UpdateVideoResponseDTO,
    ResponseDTO
} from '../../../domain/video/dtos/VideoResponseDTOs';

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
