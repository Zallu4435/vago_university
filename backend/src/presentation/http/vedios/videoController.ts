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
        console.log('VideoController: getVideoById called with params:', httpRequest.params);
        try {
            const { id } = httpRequest.params;
            const requestDTO: GetVideoByIdRequestDTO = { id };
            console.log('VideoController: getVideoById DTO:', requestDTO);

            const result = await this.getVideoByIdUseCase.execute(requestDTO);
            console.log('VideoController: getVideoById result:', result);

            if (!result.success) {
                console.error('VideoController: getVideoById failed');
                return this.httpErrors.error_400();
            }
            return this.httpSuccess.success_200(result.data);
        } catch (error: any) {
            console.error('VideoController: getVideoById error:', error);
            return this.httpErrors.error_500();
        }
    }

    async createVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        console.log('\n=== Create Video Request ===');
        console.log('1. Raw Request:', {
            headers: httpRequest.headers,
            body: httpRequest.body,
            params: httpRequest.params,
            query: httpRequest.query,
            file: httpRequest.file,
            files: httpRequest.files,
            user: httpRequest.user
        });

        try {
            const { title, category, module, status, description, duration } = httpRequest.body;
            const videoFile = httpRequest.file;
            const categoryParam = httpRequest.params.category;

            console.log('2. Extracted Data:', {
                title,
                category,
                module,
                status,
                description,
                duration,
                videoFile,
                categoryParam
            });

            if (!videoFile) {
                console.error('VideoController: createVideo - No video file provided');
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
            console.log('VideoController: createVideo DTO:', requestDTO);

            const result = await this.createVideoUseCase.execute(requestDTO);
            console.log('VideoController: createVideo result:', result);

            if (!result.success) {
                console.error('VideoController: createVideo failed:', result);
                return this.httpErrors.error_400();
            }
            return this.httpSuccess.success_201(result.data);
        } catch (error: any) {
            console.error('VideoController: createVideo error:', error);
            return this.httpErrors.error_500();
        }
    }

    async updateVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        console.log('VideoController: updateVideo called with:', {
            params: httpRequest.params,
            body: httpRequest.body,
            file: httpRequest.file
        });
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
            console.log('VideoController: updateVideo DTO:', requestDTO);

            const result = await this.updateVideoUseCase.execute(requestDTO);
            console.log('VideoController: updateVideo result:', result);

            if (!result.success) {
                console.error('VideoController: updateVideo failed:', result);
                return this.httpErrors.error_400();
            }
            return this.httpSuccess.success_200(result.data);
        } catch (error: any) {
            console.error('VideoController: updateVideo error:', error);
            return this.httpErrors.error_500();
        }
    }

    async deleteVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        console.log('VideoController: deleteVideo called with params:', httpRequest.params);
        try {
            const { id } = httpRequest.params;
            const requestDTO: DeleteVideoRequestDTO = { id };
            console.log('VideoController: deleteVideo DTO:', requestDTO);

            const result = await this.deleteVideoUseCase.execute(requestDTO);
            console.log('VideoController: deleteVideo result:', result);

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