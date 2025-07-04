import { ISessionRepository } from '../../../application/session/repositories/ISessionRepository';
import { SessionRepository } from '../../repositories/session/SessionRepository';
import { CreateVideoSessionUseCase, JoinVideoSessionUseCase, GetVideoSessionUseCase, DeleteVideoSessionUseCase, UpdateVideoSessionUseCase, GetAllVideoSessionsUseCase } from '../../../application/session/useCases/VideoSessionUseCases';
import { VideoSessionController } from '../../../presentation/http/session/VideoSessionController';
import { IVideoSessionController } from '../../../presentation/http/IHttp';

export function getVideoSessionComposer(): IVideoSessionController {
  const repository: ISessionRepository = new SessionRepository();
  const createUseCase = new CreateVideoSessionUseCase(repository);
  const joinUseCase = new JoinVideoSessionUseCase(repository);
  const getUseCase = new GetVideoSessionUseCase(repository);
  const updateUseCase = new UpdateVideoSessionUseCase(repository);
  const deleteUseCase = new DeleteVideoSessionUseCase(repository);
  const getAllUseCase = new GetAllVideoSessionsUseCase(repository);
  return new VideoSessionController(createUseCase, joinUseCase, getUseCase, updateUseCase, deleteUseCase, getAllUseCase);
} 