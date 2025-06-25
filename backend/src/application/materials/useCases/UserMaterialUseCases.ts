import { IUserMaterialsRepository } from '../repositories/IUserMaterialsRepository';
import { 
  GetUserMaterialsRequestDTO, 
  GetUserMaterialByIdRequestDTO,
  ToggleBookmarkRequestDTO, 
  ToggleLikeRequestDTO, 
  DownloadMaterialRequestDTO,
  GetUserBookmarkedMaterialsRequestDTO,
  GetUserLikedMaterialsRequestDTO
} from '../../../domain/materials/dtos/UserMaterialRequestDTOs';
import { GetUserMaterialsResponseDTO } from '../../../domain/materials/dtos/UserMaterialResponseDTOs';

export class GetUserMaterialsUseCase {
  constructor(private repo: IUserMaterialsRepository) {}
  async execute(params: GetUserMaterialsRequestDTO): Promise<GetUserMaterialsResponseDTO> {
    return this.repo.getUserMaterials(params);
  }
}

export class GetUserMaterialByIdUseCase {
  constructor(private repo: IUserMaterialsRepository) {}
  async execute(params: GetUserMaterialByIdRequestDTO): Promise<GetUserMaterialsResponseDTO> {
    return this.repo.getUserMaterialById(params);
  }
}

export class ToggleBookmarkUseCase {
  constructor(private repo: IUserMaterialsRepository) {}
  async execute(params: ToggleBookmarkRequestDTO): Promise<void> {
    return this.repo.toggleBookmark(params);
  }
}

export class ToggleLikeUseCase {
  constructor(private repo: IUserMaterialsRepository) {}
  async execute(params: ToggleLikeRequestDTO): Promise<void> {
    return this.repo.toggleLike(params);
  }
}

export class DownloadMaterialUseCase {
  constructor(private repo: IUserMaterialsRepository) {}
  async execute(params: DownloadMaterialRequestDTO): Promise<string> {
    return this.repo.downloadMaterial(params);
  }
} 