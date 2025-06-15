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

export interface IUserMaterialsRepository {
  getUserMaterials(params: GetUserMaterialsRequestDTO): Promise<GetUserMaterialsResponseDTO>;
  getUserMaterialById(params: GetUserMaterialByIdRequestDTO): Promise<GetUserMaterialsResponseDTO>;
  toggleBookmark(params: ToggleBookmarkRequestDTO): Promise<void>;
  toggleLike(params: ToggleLikeRequestDTO): Promise<void>;
  downloadMaterial(params: DownloadMaterialRequestDTO): Promise<string>;
  getUserBookmarkedMaterials(params: GetUserBookmarkedMaterialsRequestDTO): Promise<GetUserMaterialsResponseDTO>;
  getUserLikedMaterials(params: GetUserLikedMaterialsRequestDTO): Promise<GetUserMaterialsResponseDTO>;
} 