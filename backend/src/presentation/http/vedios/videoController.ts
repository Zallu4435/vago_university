import { 
    IGetVideosUseCase,
    IGetVideoByIdUseCase,
    ICreateVideoUseCase,
    IUpdateVideoUseCase,
    IDeleteVideoUseCase
  } from '../../../application/video/useCases/IVideoUseCases';
  import { GetVideosRequestDTO, GetVideoByIdRequestDTO, CreateVideoRequestDTO, UpdateVideoRequestDTO, DeleteVideoRequestDTO } from '../../../domain/video/dtos/VideoRequestDTOs';
  import { IHttpRequest, IHttpResponse, IVideoController, HttpSuccess, HttpErrors } from '../IHttp';
  
  export class VideoController implements IVideoController {
      private _httpSuccess: HttpSuccess;
      private _httpErrors: HttpErrors;
  
      constructor(
          private readonly _getVideosUseCase: IGetVideosUseCase,
          private readonly _getVideoByIdUseCase: IGetVideoByIdUseCase,
          private readonly _createVideoUseCase: ICreateVideoUseCase,
          private readonly _updateVideoUseCase: IUpdateVideoUseCase,
          private readonly _deleteVideoUseCase: IDeleteVideoUseCase,
      ) {
          this._httpSuccess = new HttpSuccess();
          this._httpErrors = new HttpErrors();
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
          const result = await this._getVideosUseCase.execute(requestDTO);
          if (!result.success) {
              return this._httpErrors.error_400();
          }
          return this._httpSuccess.success_200(result.data);
      }
  
      async getVideoById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
          const { id } = httpRequest.params;
          if (!id) {
              return this._httpErrors.error_400('Missing video ID');
          }
          const requestDTO: GetVideoByIdRequestDTO = { id };
          const result = await this._getVideoByIdUseCase.execute(requestDTO);
          if (!result.success) {
              const errorMsg = (result.data as { error?: string })?.error || 'Bad request';
              if (errorMsg === 'InvalidVideoId') {
                  return this._httpErrors.error_400('Invalid video ID format');
              }
              if (errorMsg === 'VideoNotFound') {
                  return this._httpErrors.error_404('Video not found');
              }
              return this._httpErrors.error_400(errorMsg);
          }
          return this._httpSuccess.success_200(result.data);
      }
  
      async createVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
          const { title, category, module, status, description, duration } = httpRequest.body;
          const videoFile = httpRequest.file;
          if (!videoFile) {
              return this._httpErrors.error_400();
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
          const result = await this._createVideoUseCase.execute(requestDTO);
          if (!result.success) {
              return this._httpErrors.error_400();
          }
          return this._httpSuccess.success_201(result.data);
      }
  
      async updateVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
          const { id } = httpRequest.params;
          const { title, duration, module, status, description, videoUrl, category } = httpRequest.body;
          const videoFile = httpRequest.file;
          if (!id) {
              return this._httpErrors.error_400();
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
          const result = await this._updateVideoUseCase.execute(requestDTO);
          if (!result.success) {
              return this._httpErrors.error_400();
          }
          return this._httpSuccess.success_200(result.data);
      }
  
      async deleteVideo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
          const { id } = httpRequest.params;
          const requestDTO: DeleteVideoRequestDTO = { id };
          const result = await this._deleteVideoUseCase.execute(requestDTO);
          if (!result.success) {
              return this._httpErrors.error_400();
          }
          return this._httpSuccess.success_200(result.data);
      }
  }
  