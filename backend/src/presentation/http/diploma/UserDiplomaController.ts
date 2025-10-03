import {
  IGetUserDiplomasUseCase,
  IGetUserDiplomaByIdUseCase,
  IGetUserDiplomaChapterUseCase,
  IUpdateVideoProgressUseCase,
  IMarkChapterCompleteUseCase,
  IToggleBookmarkUseCase,
  IGetCompletedChaptersUseCase,
  IGetBookmarkedChaptersUseCase
} from "../../../application/diploma/useCases/IUserDiplomaUseCases";
import { IUserDiplomaController, IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors } from "../IHttp";

export class UserDiplomaController implements IUserDiplomaController {
  private _httpSuccess: HttpSuccess;
  private _httpErrors: HttpErrors;

  constructor(
    private readonly _getUserDiplomasUseCase: IGetUserDiplomasUseCase,
    private readonly _getUserDiplomaByIdUseCase: IGetUserDiplomaByIdUseCase,
    private readonly _getUserDiplomaChapterUseCase: IGetUserDiplomaChapterUseCase,
    private readonly _updateVideoProgressUseCase: IUpdateVideoProgressUseCase,
    private readonly _markChapterCompleteUseCase: IMarkChapterCompleteUseCase,
    private readonly _toggleBookmarkUseCase: IToggleBookmarkUseCase,
    private readonly _getCompletedChaptersUseCase: IGetCompletedChaptersUseCase,
    private readonly _getBookmarkedChaptersUseCase: IGetBookmarkedChaptersUseCase
  ) {
    this._httpSuccess = new HttpSuccess();
    this._httpErrors = new HttpErrors();
  }

  async getUserDiplomas(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this._httpErrors.error_401();
    }

    const { id } = httpRequest.user;
    const { page = "1", limit = "10", category = "all", status = "all", dateRange = "all" } = httpRequest.query;

    if (
      isNaN(Number(page)) ||
      isNaN(Number(limit)) ||
      Number(page) < 1 ||
      Number(limit) < 1
    ) {
      return this._httpErrors.error_400();
    }

    const result = await this._getUserDiplomasUseCase.execute({
      userId: id,
      page: Number(page),
      limit: Number(limit),
      category: String(category),
      status: String(status),
      dateRange: String(dateRange),
    });

    if (!result.success) {
      return this._httpErrors.error_400();
    }

    return this._httpSuccess.success_200(result.data);
  }

  async getUserDiplomaById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this._httpErrors.error_400();
    }

    const result = await this._getUserDiplomaByIdUseCase.execute({ id });

    if (!result.success) {
      return this._httpErrors.error_404();
    }

    return this._httpSuccess.success_200(result.data);
  }

  async getUserDiplomaChapter(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { courseId, chapterId } = httpRequest.params;

    if (!courseId || !chapterId) {
      return this._httpErrors.error_400();
    }

    const result = await this._getUserDiplomaChapterUseCase.execute({ courseId, chapterId });

    if (!result.success) {
      return this._httpErrors.error_404();
    }

    return this._httpSuccess.success_200(result.data);
  }

  async updateVideoProgress(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this._httpErrors.error_401();
    }

    const { id } = httpRequest.user;
    const { courseId, chapterId } = httpRequest.params;
    const { progress } = httpRequest.body;

    if (!courseId || !chapterId || typeof progress !== 'number') {
      return this._httpErrors.error_400();
    }

    const result = await this._updateVideoProgressUseCase.execute({
      userId: id,
      courseId,
      chapterId,
      progress
    });

    if (!result.success) {
      return this._httpErrors.error_400();
    }

    return this._httpSuccess.success_200(result.data);
  }

  async markChapterComplete(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this._httpErrors.error_401();
    }

    const { id } = httpRequest.user;
    const { courseId, chapterId } = httpRequest.params;

    if (!courseId || !chapterId) {
      return this._httpErrors.error_400();
    }

    const result = await this._markChapterCompleteUseCase.execute({
      userId: id,
      courseId,
      chapterId
    });

    if (!result.success) {
      return this._httpErrors.error_400();
    }

    return this._httpSuccess.success_200(result.data);
  }

  async toggleBookmark(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this._httpErrors.error_401();
    }

    const { id } = httpRequest.user;
    const { courseId, chapterId } = httpRequest.params;

    if (!courseId || !chapterId) {
      return this._httpErrors.error_400();
    }

    const result = await this._toggleBookmarkUseCase.execute({
      userId: id,
      courseId,
      chapterId
    });

    if (!result.success) {
      return this._httpErrors.error_400();
    }

    return this._httpSuccess.success_200(result.data);
  }

  async getCompletedChapters(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this._httpErrors.error_401();
    }

    const { id } = httpRequest.user;
    const { courseId } = httpRequest.params;

    if (!courseId) {
      return this._httpErrors.error_400();
    }

    const result = await this._getCompletedChaptersUseCase.execute(id, courseId);

    if (!result.success) {
      return this._httpErrors.error_400();
    }

    return this._httpSuccess.success_200(result.data);
  }

  async getBookmarkedChapters(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this._httpErrors.error_401();
    }

    const { id } = httpRequest.user;
    const { courseId } = httpRequest.params;

    if (!courseId) {
      return this._httpErrors.error_400();
    }

    const result = await this._getBookmarkedChaptersUseCase.execute(id, courseId);

    if (!result.success) {
      return this._httpErrors.error_400();
    }

    return this._httpSuccess.success_200(result.data);
  }
} 