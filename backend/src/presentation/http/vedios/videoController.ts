import { VideoComposer } from '../../../infrastructure/services/vedios/VideoComposer';
import { GetVideosRequestDTO, GetVideoByIdRequestDTO, CreateVideoRequestDTO, UpdateVideoRequestDTO, DeleteVideoRequestDTO } from '../../../domain/video/dtos/VideoRequestDTOs';
import { IHttpRequest, IHttpResponse, IVideoController, HttpSuccess, HttpErrors } from '../IHttp';

export class VideoController implements IVideoController {
    private getVideosUseCase;
    private getVideoByIdUseCase;
    private createVideoUseCase;
    private updateVideoUseCase;
    private deleteVideoUseCase;
    private httpSuccess: HttpSuccess;
    private httpErrors: HttpErrors;

    constructor() {
        const {
            getVideosUseCase,
            getVideoByIdUseCase,
            createVideoUseCase,
            updateVideoUseCase,
            deleteVideoUseCase,
        } = VideoComposer.compose();

        this.getVideosUseCase = getVideosUseCase;
        this.getVideoByIdUseCase = getVideoByIdUseCase;
        this.createVideoUseCase = createVideoUseCase;
        this.updateVideoUseCase = updateVideoUseCase;
        this.deleteVideoUseCase = deleteVideoUseCase;
        this.httpSuccess = new HttpSuccess();
        this.httpErrors = new HttpErrors();
    }

    async getVideos(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { page = 1, limit = 10, status, category } = httpRequest.query;

            const requestDTO: GetVideosRequestDTO = {
                category,
                page: Number(page),
                limit: Number(limit),
                status: status as string | undefined,
            };
            const result = await this.getVideosUseCase.execute(requestDTO);

            if (!result.success) {
                console.error('VideoController: getVideos failed');
                return this.httpErrors.error_400();
            }
            return this.httpSuccess.success_200(result.data);
        } catch (error: any) {
            console.error('VideoController: getVideos error:', error);
            return this.httpErrors.error_500();
        }
    }

    async getVideoById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { id } = httpRequest.params;

            if (!id) {
                console.error('Video ID is required');
                return this.httpErrors.error_400();
            }

            const requestDTO: GetVideoByIdRequestDTO = { id };
            const result = await this.getVideoByIdUseCase.execute(requestDTO);

            if (!result.success) {
                console.error('VideoController: getVideoById failed:', result);
                return this.httpErrors.error_400();
            }

            return this.httpSuccess.success_200(result.data);
        } catch (error: any) {
            console.error('VideoController: getVideoById error:', error);
            console.error('Error stack:', error.stack);
            return this.httpErrors.error_500();
        }
    }

    async createVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            console.log('🎬 [CONTROLLER] Handling video upload (createVideo)');
            const { title, category, module, status, description, duration } = httpRequest.body;
            const videoFile = httpRequest.file;
            const categoryParam = httpRequest.params.category;

            if (!videoFile) {
                console.error('VideoController: createVideo - No video file provided');
                return this.httpErrors.error_400();
            }

            const requestDTO: CreateVideoRequestDTO = {
                title,
                duration,
                module: Number(module),
                status,
                description,
                category,
                videoFile
            };

            const result = await this.createVideoUseCase.execute(requestDTO);

            if (!result.success) {
                console.error('VideoController: createVideo failed:', result);
                return this.httpErrors.error_400();
            }
            return this.httpSuccess.success_201(result.data);
        } catch (error: any) {
            console.error('VideoController: createVideo error:', error);
            console.error('Error stack:', error.stack);
            return this.httpErrors.error_500();
        }
    }

    async updateVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            console.log('🎬 [CONTROLLER] Handling video update (updateVideo)');
            const { id } = httpRequest.params;
            const { title, duration, module, status, description, videoUrl } = httpRequest.body;
            const videoFile = httpRequest.file;

            if (!id) {
                console.error('Video ID is required for updates');
                return this.httpErrors.error_400();
            }

            if (videoFile) {
            } else {
                if (videoUrl) {
                    console.log('🔗 Preserving existing video URL:', videoUrl);
                }
            }

            const requestDTO: UpdateVideoRequestDTO = {
                id,
                title,
                duration,
                module: module ? Number(module) : undefined,
                status,
                description,
                videoUrl,
                videoFile
            };

            const result = await this.updateVideoUseCase.execute(requestDTO);

            if (!result.success) {
                console.error('VideoController: updateVideo failed:', result);
                return this.httpErrors.error_400();
            }

            return this.httpSuccess.success_200(result.data);
        } catch (error: any) {
            console.error('VideoController: updateVideo error:', error);
            console.error('Error stack:', error.stack);
            return this.httpErrors.error_500();
        }
    }

    async deleteVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { id } = httpRequest.params;
            const requestDTO: DeleteVideoRequestDTO = { id };

            const result = await this.deleteVideoUseCase.execute(requestDTO);

            if (!result.success) {
                console.error('VideoController: deleteVideo failed:', result);
                return this.httpErrors.error_400();
            }
            return this.httpSuccess.success_200(result.data);
        } catch (error: any) {
            console.error('VideoController: deleteVideo error:', error);
            return this.httpErrors.error_500();
        }
    }
} 