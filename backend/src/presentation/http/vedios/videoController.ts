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
                return this.httpErrors.error_400();
            }
            return this.httpSuccess.success_200(result.data);
        } catch (error: any) {
            return this.httpErrors.error_500();
        }
    }

    async getVideoById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { id } = httpRequest.params;
            const requestDTO: GetVideoByIdRequestDTO = { id };

            const result = await this.getVideoByIdUseCase.execute(requestDTO);
            if (!result.success) {
                return this.httpErrors.error_400();
            }
            return this.httpSuccess.success_200(result.data);
        } catch (error: any) {
            return this.httpErrors.error_500();
        }
    }

    async createVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { category } = httpRequest.params;
            const { title, duration, module, status, description } = httpRequest.body;
            const videoFile = httpRequest.file;

            if (!videoFile) {
                return this.httpErrors.error_400('Video file is required');
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
                return this.httpErrors.error_400();
            }
            return this.httpSuccess.success_201(result.data);
        } catch (error: any) {
            return this.httpErrors.error_500();
        }
    }

    async updateVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { id } = httpRequest.params;
            const { title, duration, module, status, description } = httpRequest.body;
            const videoFile = httpRequest.file;

            const requestDTO: UpdateVideoRequestDTO = {
                id,
                title,
                duration,
                module: module ? Number(module) : undefined,
                status,
                description,
                videoFile
            };

            const result = await this.updateVideoUseCase.execute(requestDTO);
            if (!result.success) {
                return this.httpErrors.error_400();
            }
            return this.httpSuccess.success_200(result.data);
        } catch (error: any) {
            return this.httpErrors.error_500();
        }
    }

    async deleteVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { id } = httpRequest.params;
            const requestDTO: DeleteVideoRequestDTO = { id };

            const result = await this.deleteVideoUseCase.execute(requestDTO);
            if (!result.success) {
                return this.httpErrors.error_400();
            }
            return this.httpSuccess.success_200(result.data);
        } catch (error: any) {
            return this.httpErrors.error_500();
        }
    }
} 