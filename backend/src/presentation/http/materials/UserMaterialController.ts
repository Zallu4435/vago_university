import { IHttpRequest, IHttpResponse } from '../IHttp';
import {
  GetUserMaterialsUseCase,
  GetUserMaterialByIdUseCase,
  ToggleBookmarkUseCase,
  ToggleLikeUseCase,
  DownloadMaterialUseCase,
  GetUserBookmarkedMaterialsUseCase,
  GetUserLikedMaterialsUseCase
} from '../../../application/materials/useCases/UserMaterialUseCases';

export class UserMaterialController {
  constructor(
    private getMaterialsUseCase: GetUserMaterialsUseCase,
    private getMaterialByIdUseCase: GetUserMaterialByIdUseCase,
    private toggleBookmarkUseCase: ToggleBookmarkUseCase,
    private toggleLikeUseCase: ToggleLikeUseCase,
    private downloadMaterialUseCase: DownloadMaterialUseCase,
    private getBookmarkedMaterialsUseCase: GetUserBookmarkedMaterialsUseCase,
    private getLikedMaterialsUseCase: GetUserLikedMaterialsUseCase
  ) { }

  async getMaterials(req: IHttpRequest): Promise<IHttpResponse> {
    console.log("reached inside the getMaterials", req)
    const { query, user } = req;
    if (!user) return { statusCode: 401, body: { message: 'Unauthorized' } };

    const params = {
      userId: user.id,
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

    const result = await this.getMaterialsUseCase.execute(params);
    return { statusCode: 200, body: result };
  }

  async getMaterialById(req: IHttpRequest): Promise<IHttpResponse> {
    const { id } = req.params;
    const { user } = req;
    if (!user) return { statusCode: 401, body: { message: 'Unauthorized' } };
    const result = await this.getMaterialByIdUseCase.execute({ id, userId: user.id });
    return { statusCode: 200, body: result };
  }

  async toggleBookmark(req: IHttpRequest): Promise<IHttpResponse> {
    const { id } = req.params;
    const { user } = req;
    if (!user) return { statusCode: 401, body: { message: 'Unauthorized' } };
    await this.toggleBookmarkUseCase.execute({ materialId: id, userId: user.id });
    return { statusCode: 200, body: { message: 'Bookmark toggled' } };
  }

  async toggleLike(req: IHttpRequest): Promise<IHttpResponse> {
    const { id } = req.params;
    const { user } = req;
    if (!user) return { statusCode: 401, body: { message: 'Unauthorized' } };
    await this.toggleLikeUseCase.execute({ materialId: id, userId: user.id });
    return { statusCode: 200, body: { message: 'Like toggled' } };
  }

  async downloadMaterial(req: IHttpRequest): Promise<IHttpResponse> {
    const { id } = req.params;
    const { user } = req;
    if (!user) return { statusCode: 401, body: { message: 'Unauthorized' } };
    const url = await this.downloadMaterialUseCase.execute({ materialId: id, userId: user.id });
    return { statusCode: 200, body: { url } };
  }

  async getBookmarkedMaterials(req: IHttpRequest): Promise<IHttpResponse> {
    const { query, user } = req;
    if (!user) return { statusCode: 401, body: { message: 'Unauthorized' } };
    const result = await this.getBookmarkedMaterialsUseCase.execute({
      userId: user.id,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10
    });
    return { statusCode: 200, body: result };
  }

  async getLikedMaterials(req: IHttpRequest): Promise<IHttpResponse> {
    const { query, user } = req;
    if (!user) return { statusCode: 401, body: { message: 'Unauthorized' } };
    const result = await this.getLikedMaterialsUseCase.execute({
      userId: user.id,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10
    });
    return { statusCode: 200, body: result };
  }
} 