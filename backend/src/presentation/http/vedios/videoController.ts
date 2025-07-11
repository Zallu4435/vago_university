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
        const { page = 1, limit = 10, status, category, search, dateRange, startDate, endDate } = httpRequest.query;
        const requestDTO: GetVideosRequestDTO = {
            category,
            page: Number(page),
            limit: Number(limit),
            status: status as string | undefined,
            search: search as string | undefined,
            dateRange: dateRange as string | undefined,
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
        };
        const result = await this.getVideosUseCase.execute(requestDTO);
        if (!result.success) {
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(result.data);
    }

    async getVideoById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { id } = httpRequest.params;
        if (!id) {
            return this.httpErrors.error_400('Missing video ID');
        }
        const requestDTO: GetVideoByIdRequestDTO = { id };
        const result = await this.getVideoByIdUseCase.execute(requestDTO);
        if (!result.success) {
            // Pass through specific error message if available
            const errorMsg = (result.data as any)?.error || 'Bad request';
            if (errorMsg === 'InvalidVideoId') {
                return this.httpErrors.error_400('Invalid video ID format');
            }
            if (errorMsg === 'VideoNotFound') {
                return this.httpErrors.error_404('Video not found');
            }
            return this.httpErrors.error_400(errorMsg);
        }
        return this.httpSuccess.success_200(result.data);
    }

    async createVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { title, category, module, status, description, duration } = httpRequest.body;
        const videoFile = httpRequest.file;
        const categoryParam = httpRequest.params.category;
        if (!videoFile) {
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
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_201(result.data);
    }

    async updateVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { id } = httpRequest.params;
        const { title, duration, module, status, description, videoUrl } = httpRequest.body;
        const videoFile = httpRequest.file;
        if (!id) {
            return this.httpErrors.error_400();
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
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(result.data);
    }

    async deleteVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { id } = httpRequest.params;
        const requestDTO: DeleteVideoRequestDTO = { id };
        const result = await this.deleteVideoUseCase.execute(requestDTO);
        if (!result.success) {
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(result.data);
    }
} 