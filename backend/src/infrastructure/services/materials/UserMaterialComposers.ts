import { UserMaterialController } from '../../../presentation/http/materials/UserMaterialController';
import { UserMaterialsRepository } from '../../repositories/materials/UserMaterialsRepository';
import { 
  GetUserMaterialsUseCase,
  GetUserMaterialByIdUseCase,
  ToggleBookmarkUseCase,
  ToggleLikeUseCase,
  DownloadMaterialUseCase,
  GetUserBookmarkedMaterialsUseCase,
  GetUserLikedMaterialsUseCase
} from '../../../application/materials/useCases/UserMaterialUseCases';
import { MaterialModel } from '../../database/mongoose/material/MaterialModel';

export const makeUserMaterialController = () => {
  const repository = new UserMaterialsRepository();
  
  const getMaterialsUseCase = new GetUserMaterialsUseCase(repository);
  const getMaterialByIdUseCase = new GetUserMaterialByIdUseCase(repository);
  const toggleBookmarkUseCase = new ToggleBookmarkUseCase(repository);
  const toggleLikeUseCase = new ToggleLikeUseCase(repository);
  const downloadMaterialUseCase = new DownloadMaterialUseCase(repository);

  return new UserMaterialController(
    getMaterialsUseCase,
    getMaterialByIdUseCase,
    toggleBookmarkUseCase,
    toggleLikeUseCase,
    downloadMaterialUseCase
  );
}; 