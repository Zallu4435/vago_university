import { IHttpRequest, IHttpResponse } from '../IHttp';
import {
  IGetUserMaterialsUseCase,
  IGetUserMaterialByIdUseCase,
  IToggleBookmarkUseCase,
  IToggleLikeUseCase,
  IDownloadMaterialUseCase
} from '../../../application/materials/useCases/IUserMaterialUseCases';

export class UserMaterialController {
  constructor(
    private _getMaterialsUseCase: IGetUserMaterialsUseCase,
    private _getMaterialByIdUseCase: IGetUserMaterialByIdUseCase,
    private _toggleBookmarkUseCase: IToggleBookmarkUseCase,
    private _toggleLikeUseCase: IToggleLikeUseCase,
    private _downloadMaterialUseCase: IDownloadMaterialUseCase
  ) { }

  async getMaterials(req: IHttpRequest): Promise<IHttpResponse> {
    const { query, user } = req;
    if (!user) return { statusCode: 401, body: { error: 'Unauthorized' } };

    const params = {
      userId: user.userId,
      subject: query.subject,
      course: query.course,
      semester: query.semester ? Number(query.semester) : undefined,
      type: query.type,
      difficulty: query.difficulty,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder as 'asc' | 'desc',
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10
    };

    const result = await this._getMaterialsUseCase.execute(params);
    return { statusCode: 200, body: { data: result } };
  }

  async getMaterialById(req: IHttpRequest): Promise<IHttpResponse> {
    const { id } = req.params;
    const { user } = req;
    if (!user) return { statusCode: 401, body: { error: 'Unauthorized' } };
    const result = await this._getMaterialByIdUseCase.execute({ id, userId: user.userId });
    return { statusCode: 200, body: { data: result } };
  }

  async toggleBookmark(req: IHttpRequest): Promise<IHttpResponse> {
    const { id } = req.params;
    const { user } = req;
    if (!user) return { statusCode: 401, body: { error: 'Unauthorized' } };
    await this._toggleBookmarkUseCase.execute({ id, userId: user.userId });
    return { statusCode: 200, body: { data: { message: 'Bookmark toggled' } } };
  }

  async toggleLike(req: IHttpRequest): Promise<IHttpResponse> {
    const { id } = req.params;
    const { user } = req;
    if (!user) return { statusCode: 401, body: { error: 'Unauthorized' } };
    await this._toggleLikeUseCase.execute({ id, userId: user.userId });
    return { statusCode: 200, body: { data: { message: 'Like toggled' } } };
  }

  async downloadMaterial(req: IHttpRequest): Promise<IHttpResponse> {
    const { id } = req.params;
    const { user } = req;
    if (!user) return { statusCode: 401, body: { error: 'Unauthorized' } };
    const url = await this._downloadMaterialUseCase.execute({ id, userId: user.userId });
    return { statusCode: 200, body: { data: { url } } };
  }
} 