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

            // console.log('🔍 Extracted video ID:', id);

            if (!id) {
                console.error('❌ Video ID is required');
                return this.httpErrors.error_400();
            }

            const requestDTO: GetVideoByIdRequestDTO = { id };
            // console.log('📝 VideoController: getVideoById DTO:', requestDTO);
            // console.log('🎬 === CALLING GET VIDEO BY ID USE CASE ===');

            const result = await this.getVideoByIdUseCase.execute(requestDTO);
            // console.log('✅ VideoController: getVideoById result:', result);

            if (!result.success) {
                console.error('❌ VideoController: getVideoById failed:', result);
                return this.httpErrors.error_400();
            }

            // console.log('🎬 === VIDEO CONTROLLER - GET VIDEO BY ID SUCCESS ===');
            return this.httpSuccess.success_200(result.data);
        } catch (error: any) {
            console.error('❌ VideoController: getVideoById error:', error);
            console.error('❌ Error stack:', error.stack);
            return this.httpErrors.error_500();
        }
    }

    async createVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        // console.log('\n🎬 === VIDEO CONTROLLER - CREATE VIDEO START ===');
        // console.log('📋 Raw Request Data:', {
        //     headers: httpRequest.headers,
        //     body: httpRequest.body,
        //     params: httpRequest.params,
        //     query: httpRequest.query,
        //     file: httpRequest.file ? {
        //         fieldname: httpRequest.file.fieldname,
        //         originalname: httpRequest.file.originalname,
        //         mimetype: httpRequest.file.mimetype,
        //         size: httpRequest.file.size
        //     } : 'No file',
        //     files: httpRequest.files,
        //     user: httpRequest.user
        // });

        try {
            const { title, category, module, status, description, duration } = httpRequest.body;
            const videoFile = httpRequest.file;
            const categoryParam = httpRequest.params.category;

            // console.log('🔍 Extracted Data:', {
            //     title,
            //     category,
            //     module,
            //     status,
            //     description,
            //     duration,
            //     videoFile: videoFile ? {
            //         originalname: videoFile.originalname,
            //         mimetype: videoFile.mimetype,
            //         size: videoFile.size
            //     } : 'No file',
            //     categoryParam
            // });

            if (!videoFile) {
                console.error('❌ VideoController: createVideo - No video file provided');
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
            // console.log('📝 VideoController: createVideo DTO:', requestDTO);
            // console.log('🎬 === CALLING CREATE VIDEO USE CASE ===');

            const result = await this.createVideoUseCase.execute(requestDTO);
            // console.log('✅ VideoController: createVideo result:', result);

            if (!result.success) {
                console.error('❌ VideoController: createVideo failed:', result);
                return this.httpErrors.error_400();
            }
            // console.log('🎬 === VIDEO CONTROLLER - CREATE VIDEO SUCCESS ===');
            return this.httpSuccess.success_201(result.data);
        } catch (error: any) {
            console.error('❌ VideoController: createVideo error:', error);
            console.error('❌ Error stack:', error.stack);
            return this.httpErrors.error_500();
        }
    }

    async updateVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        // console.log('\n🎬 === VIDEO CONTROLLER - UPDATE VIDEO START ===');
        // console.log('📋 Update request details:', {
        //     params: httpRequest.params,
        //     body: httpRequest.body,
        //     file: httpRequest.file ? {
        //         originalname: httpRequest.file.originalname,
        //         mimetype: httpRequest.file.mimetype,
        //         size: httpRequest.file.size
        //     } : 'No file'
        // });

        try {
            const { id } = httpRequest.params;
            const { title, duration, module, status, description, videoUrl } = httpRequest.body;
            const videoFile = httpRequest.file;

            // console.log('🔍 Extracted update data:', {
            //     id,
            //     title,
            //     duration,
            //     module,
            //     status,
            //     description,
            //     videoUrl,
            //     hasNewVideoFile: !!videoFile
            // });

            // Validate video ID
            if (!id) {
                console.error('❌ Video ID is required for updates');
                return this.httpErrors.error_400();
            }

            if (videoFile) {
                // console.log('📁 Update includes new video file');
            } else {
                // console.log('📝 Update without new video file - will preserve existing video');
                if (videoUrl) {
                    console.log('🔗 Preserving existing video URL:', videoUrl);
                    // } else {
                    // console.log('⚠️ No videoUrl provided in request body');
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
            // console.log('📝 VideoController: updateVideo DTO:', requestDTO);
            // console.log('🎬 === CALLING UPDATE VIDEO USE CASE ===');

            const result = await this.updateVideoUseCase.execute(requestDTO);
            // console.log('✅ VideoController: updateVideo result:', result);

            if (!result.success) {
                console.error('❌ VideoController: updateVideo failed:', result);
                return this.httpErrors.error_400();
            }

            // console.log('🎬 === VIDEO CONTROLLER - UPDATE VIDEO SUCCESS ===');
            return this.httpSuccess.success_200(result.data);
        } catch (error: any) {
            console.error('❌ VideoController: updateVideo error:', error);
            console.error('❌ Error stack:', error.stack);
            return this.httpErrors.error_500();
        }
    }

    async deleteVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        // console.log('VideoController: deleteVideo called with params:', httpRequest.params);
        try {
            const { id } = httpRequest.params;
            const requestDTO: DeleteVideoRequestDTO = { id };
            // console.log('VideoController: deleteVideo DTO:', requestDTO);

            const result = await this.deleteVideoUseCase.execute(requestDTO);
            // console.log('VideoController: deleteVideo result:', result);

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