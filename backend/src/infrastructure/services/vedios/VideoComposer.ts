import { VideoController } from '../../../presentation/http/vedios/videoController';
import { VideoRepository } from '../../repositories/video/VideoRepository';
import { IVideoRepository } from '../../../application/video/repositories/IVideoRepository';
import { 
  IGetVideosUseCase,
  IGetVideoByIdUseCase,
  ICreateVideoUseCase,
  IUpdateVideoUseCase,
  IDeleteVideoUseCase,
} from '../../../application/video/useCases/IVideoUseCases';
import {
  GetVideosUseCase, 
  GetVideoByIdUseCase, 
  CreateVideoUseCase, 
  UpdateVideoUseCase, 
  DeleteVideoUseCase 
} from '../../../application/video/useCases/VideoUseCases';
import { IVideoController } from '../../../presentation/http/IHttp';

export function getVideoComposer(): IVideoController {
  const repository: IVideoRepository = new VideoRepository();
  
  const getVideosUseCase: IGetVideosUseCase = new GetVideosUseCase(repository);
  const getVideoByIdUseCase: IGetVideoByIdUseCase = new GetVideoByIdUseCase(repository);
  const createVideoUseCase: ICreateVideoUseCase = new CreateVideoUseCase(repository);
  const updateVideoUseCase: IUpdateVideoUseCase = new UpdateVideoUseCase(repository);
  const deleteVideoUseCase: IDeleteVideoUseCase = new DeleteVideoUseCase(repository);

  return new VideoController(
    getVideosUseCase,
    getVideoByIdUseCase,
    createVideoUseCase,
    updateVideoUseCase,
    deleteVideoUseCase
  );
}
