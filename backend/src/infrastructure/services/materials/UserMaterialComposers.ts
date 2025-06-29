import { UserMaterialController } from '../../../presentation/http/materials/UserMaterialController';
import { UserMaterialsRepository } from '../../repositories/materials/UserMaterialsRepository';
import { 
  GetUserMaterialsUseCase,
  GetUserMaterialByIdUseCase,
  ToggleBookmarkUseCase,
  ToggleLikeUseCase,
  DownloadMaterialUseCase,
} from '../../../application/materials/useCases/UserMaterialUseCases';

// Placeholder use cases for unused dependencies
class GetUserBookmarkedMaterialsUseCase {
  constructor(private repo: any) {}
  async execute(params: any): Promise<any> {
    return { materials: [], totalPages: 0 };
  }
}

class GetUserLikedMaterialsUseCase {
  constructor(private repo: any) {}
  async execute(params: any): Promise<any> {
    return { materials: [], totalPages: 0 };
  }
}

export const makeUserMaterialController = () => {
  const repository = new UserMaterialsRepository();
  
  const getMaterialsUseCase = new GetUserMaterialsUseCase(repository);
  const getMaterialByIdUseCase = new GetUserMaterialByIdUseCase(repository);
  const toggleBookmarkUseCase = new ToggleBookmarkUseCase(repository);
  const toggleLikeUseCase = new ToggleLikeUseCase(repository);
  const downloadMaterialUseCase = new DownloadMaterialUseCase(repository);
  const getBookmarkedMaterialsUseCase = new GetUserBookmarkedMaterialsUseCase(repository);
  const getLikedMaterialsUseCase = new GetUserLikedMaterialsUseCase(repository);

  return new UserMaterialController(
    getMaterialsUseCase,
    getMaterialByIdUseCase,
    toggleBookmarkUseCase,
    toggleLikeUseCase,
    downloadMaterialUseCase
  );
}; 