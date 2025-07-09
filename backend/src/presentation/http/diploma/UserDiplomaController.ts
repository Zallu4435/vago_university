import {
  IGetUserDiplomasUseCase,
  IGetUserDiplomaByIdUseCase,
  IGetUserDiplomaChapterUseCase,
  IUpdateVideoProgressUseCase,
  IMarkChapterCompleteUseCase,
  IToggleBookmarkUseCase,
  IGetCompletedChaptersUseCase,
  IGetBookmarkedChaptersUseCase
} from "../../../application/diploma/useCases/UserDiplomaUseCases";
import { IUserDiplomaController, IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors } from "../IHttp";

export class UserDiplomaController implements IUserDiplomaController {
  private httpSuccess: HttpSuccess;
  private httpErrors: HttpErrors;

  constructor(
    private readonly getUserDiplomasUseCase: IGetUserDiplomasUseCase,
    private readonly getUserDiplomaByIdUseCase: IGetUserDiplomaByIdUseCase,
    private readonly getUserDiplomaChapterUseCase: IGetUserDiplomaChapterUseCase,
    private readonly updateVideoProgressUseCase: IUpdateVideoProgressUseCase,
    private readonly markChapterCompleteUseCase: IMarkChapterCompleteUseCase,
    private readonly toggleBookmarkUseCase: IToggleBookmarkUseCase,
    private readonly getCompletedChaptersUseCase: IGetCompletedChaptersUseCase,
    private readonly getBookmarkedChaptersUseCase: IGetBookmarkedChaptersUseCase
  ) {
    this.httpSuccess = new HttpSuccess();
    this.httpErrors = new HttpErrors();
  }

  async getUserDiplomas(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this.httpErrors.error_401();
    }

    const { id } = httpRequest.user;
    const { page = "1", limit = "10", category = "all", status = "all", dateRange = "all" } = httpRequest.query;

    if (
      isNaN(Number(page)) ||
      isNaN(Number(limit)) ||
      Number(page) < 1 ||
      Number(limit) < 1
    ) {
      return this.httpErrors.error_400();
    }

    const result = await this.getUserDiplomasUseCase.execute({
      userId: id,
      page: Number(page),
      limit: Number(limit),
      category: String(category),
      status: String(status),
      dateRange: String(dateRange),
    });

    if (!result.success) {
      return this.httpErrors.error_400();
    }

    return this.httpSuccess.success_200(result.data);
  }

  async getUserDiplomaById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;

    if (!id) {
      return this.httpErrors.error_400();
    }

    const result = await this.getUserDiplomaByIdUseCase.execute({ id });

    if (!result.success) {
      return this.httpErrors.error_404();
    }

    return this.httpSuccess.success_200(result.data);
  }

  async getUserDiplomaChapter(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { courseId, chapterId } = httpRequest.params;

    if (!courseId || !chapterId) {
      return this.httpErrors.error_400();
    }

    const result = await this.getUserDiplomaChapterUseCase.execute({ courseId, chapterId });

    if (!result.success) {
      return this.httpErrors.error_404();
    }

    return this.httpSuccess.success_200(result.data);
  }

  async updateVideoProgress(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this.httpErrors.error_401();
    }

    const { id } = httpRequest.user;
    const { courseId, chapterId } = httpRequest.params;
    const { progress } = httpRequest.body;

    if (!courseId || !chapterId || typeof progress !== 'number') {
      return this.httpErrors.error_400();
    }

    const result = await this.updateVideoProgressUseCase.execute({
      userId: id,
      courseId,
      chapterId,
      progress
    });

    if (!result.success) {
      return this.httpErrors.error_400();
    }

    return this.httpSuccess.success_200(result.data);
  }

  async markChapterComplete(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this.httpErrors.error_401();
    }

    const { id } = httpRequest.user;
    const { courseId, chapterId } = httpRequest.params;

    if (!courseId || !chapterId) {
      return this.httpErrors.error_400();
    }

    const result = await this.markChapterCompleteUseCase.execute({
      userId: id,
      courseId,
      chapterId
    });

    if (!result.success) {
      return this.httpErrors.error_400();
    }

    return this.httpSuccess.success_200(result.data);
  }

  async toggleBookmark(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this.httpErrors.error_401();
    }

    const { id } = httpRequest.user;
    const { courseId, chapterId } = httpRequest.params;

    if (!courseId || !chapterId) {
      return this.httpErrors.error_400();
    }

    const result = await this.toggleBookmarkUseCase.execute({
      userId: id,
      courseId,
      chapterId
    });

    if (!result.success) {
      return this.httpErrors.error_400();
    }

    return this.httpSuccess.success_200(result.data);
  }

  async getCompletedChapters(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this.httpErrors.error_401();
    }

    const { id } = httpRequest.user;
    const { courseId } = httpRequest.params;

    if (!courseId) {
      return this.httpErrors.error_400();
    }

    const result = await this.getCompletedChaptersUseCase.execute(id, courseId);

    if (!result.success) {
      return this.httpErrors.error_400();
    }

    return this.httpSuccess.success_200(result.data);
  }

  async getBookmarkedChapters(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this.httpErrors.error_401();
    }

    const { id } = httpRequest.user;
    const { courseId } = httpRequest.params;

    if (!courseId) {
      return this.httpErrors.error_400();
    }

    const result = await this.getBookmarkedChaptersUseCase.execute(id, courseId);

    if (!result.success) {
      return this.httpErrors.error_400();
    }

    return this.httpSuccess.success_200(result.data);
  }
} 