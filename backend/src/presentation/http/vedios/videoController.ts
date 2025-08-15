import { 
    IGetVideosUseCase,
    IGetVideoByIdUseCase,
    ICreateVideoUseCase,
    IUpdateVideoUseCase,
    IDeleteVideoUseCase
  } from '../../../application/video/useCases/VideoUseCases';
  import { GetVideosRequestDTO, GetVideoByIdRequestDTO, CreateVideoRequestDTO, UpdateVideoRequestDTO, DeleteVideoRequestDTO } from '../../../domain/video/dtos/VideoRequestDTOs';
  import { IHttpRequest, IHttpResponse, IVideoController, HttpSuccess, HttpErrors } from '../IHttp';
  
  export class VideoController implements IVideoController {
      private httpSuccess: HttpSuccess;
      private httpErrors: HttpErrors;
  
      constructor(
          private readonly getVideosUseCase: IGetVideosUseCase,
          private readonly getVideoByIdUseCase: IGetVideoByIdUseCase,
          private readonly createVideoUseCase: ICreateVideoUseCase,
          private readonly updateVideoUseCase: IUpdateVideoUseCase,
          private readonly deleteVideoUseCase: IDeleteVideoUseCase,
      ) {
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
              const errorMsg = (result.data as { error?: string })?.error || 'Bad request';
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
          const { title, duration, module, status, description, videoUrl, category } = httpRequest.body;
          const videoFile = httpRequest.file;
          console.log('🎯 [Controller] updateVideo called', {
            id,
            hasFile: !!videoFile,
            bodyKeys: Object.keys(httpRequest.body || {}),
            contentType: httpRequest.headers?.['content-type']
          });
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
              category,
              videoFile
          };
          console.log('🧾 [Controller] updateVideo requestDTO', {
            id: requestDTO.id,
            module: requestDTO.module,
            status: requestDTO.status,
            hasVideoFile: !!requestDTO.videoFile,
            hasVideoUrl: !!requestDTO.videoUrl,
            category: requestDTO.category
          });
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
  