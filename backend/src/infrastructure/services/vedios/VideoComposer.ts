import { VideoRepository } from '../../repositories/video/VideoRepository';
import { GetVideosUseCase, GetVideoByIdUseCase, CreateVideoUseCase, UpdateVideoUseCase, DeleteVideoUseCase } from '../../../application/video/useCases/VideoUseCases';

export class VideoComposer {
    static compose() {
        const videoRepository = new VideoRepository();
        
        const getVideosUseCase = new GetVideosUseCase(videoRepository);
        const getVideoByIdUseCase = new GetVideoByIdUseCase(videoRepository);
        const createVideoUseCase = new CreateVideoUseCase(videoRepository);
        const updateVideoUseCase = new UpdateVideoUseCase(videoRepository);
        const deleteVideoUseCase = new DeleteVideoUseCase(videoRepository);

        return {
            getVideosUseCase,
            getVideoByIdUseCase,
            createVideoUseCase,
            updateVideoUseCase,
            deleteVideoUseCase,
        };
    }
} 