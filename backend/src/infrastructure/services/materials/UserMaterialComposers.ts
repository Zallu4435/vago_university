import { UserMaterialController } from '../../../presentation/http/materials/UserMaterialController';
import { UserMaterialsRepository } from '../../repositories/materials/UserMaterialsRepository';
import { 
  GetUserMaterialsUseCase,
  GetUserMaterialByIdUseCase,
  ToggleBookmarkUseCase,
  ToggleLikeUseCase,
  DownloadMaterialUseCase,
  IGetUserMaterialsUseCase,
  IGetUserMaterialByIdUseCase,
  IToggleBookmarkUseCase,
  IToggleLikeUseCase,
  IDownloadMaterialUseCase
} from '../../../application/materials/useCases/UserMaterialUseCases';

class GetUserBookmarkedMaterialsUseCase {
  constructor(private repo) {}
  async execute(params){
    return { materials: [], totalPages: 0 };
  }
}

class GetUserLikedMaterialsUseCase {
  constructor(private repo) {}
  async execute(params){
    return { materials: [], totalPages: 0 };
  }
}

export const makeUserMaterialController = () => {
  const repository = new UserMaterialsRepository();
  
  const getMaterialsUseCase: IGetUserMaterialsUseCase = new GetUserMaterialsUseCase(repository);
  const getMaterialByIdUseCase: IGetUserMaterialByIdUseCase = new GetUserMaterialByIdUseCase(repository);
  const toggleBookmarkUseCase: IToggleBookmarkUseCase = new ToggleBookmarkUseCase(repository);
  const toggleLikeUseCase: IToggleLikeUseCase = new ToggleLikeUseCase(repository);
  const downloadMaterialUseCase: IDownloadMaterialUseCase = new DownloadMaterialUseCase(repository);
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