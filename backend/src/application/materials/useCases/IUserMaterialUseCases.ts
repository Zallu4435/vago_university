
import {
    GetUserMaterialsRequestDTO,
    GetUserMaterialByIdRequestDTO,
    ToggleBookmarkRequestDTO,
    ToggleLikeRequestDTO,
    DownloadMaterialRequestDTO,
} from '../../../domain/materials/dtos/UserMaterialRequestDTOs';
import { GetUserMaterialsResponseDTO } from '../../../domain/materials/dtos/UserMaterialResponseDTOs';


export interface IGetUserMaterialsUseCase {
    execute(params: GetUserMaterialsRequestDTO): Promise<GetUserMaterialsResponseDTO>;
}

export interface IGetUserMaterialByIdUseCase {
    execute(params: GetUserMaterialByIdRequestDTO): Promise<GetUserMaterialsResponseDTO>;
}

export interface IToggleBookmarkUseCase {
    execute(params: ToggleBookmarkRequestDTO): Promise<void>;
}

export interface IToggleLikeUseCase {
    execute(params: ToggleLikeRequestDTO): Promise<void>;
}

export interface IDownloadMaterialUseCase {
    execute(params: DownloadMaterialRequestDTO): Promise<string>;
}