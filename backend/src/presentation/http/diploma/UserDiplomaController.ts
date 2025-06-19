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
    // console.log('UserDiplomaController.getUserDiplomas - Request:', {
    //   query: httpRequest.query,
    //   user: httpRequest.user
    // });
    try {
      if (!httpRequest.user) {
        // console.log('UserDiplomaController.getUserDiplomas - No user found');
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
        // console.log('UserDiplomaController.getUserDiplomas - Invalid pagination params');
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

      // console.log('UserDiplomaController.getUserDiplomas - UseCase Result:', result);

      if (!result.success) {
        // console.log('UserDiplomaController.getUserDiplomas - UseCase failed');
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`UserDiplomaController.getUserDiplomas - Error:`, err);
      return this.httpErrors.error_400();
    }
  }

  async getUserDiplomaById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    // console.log('UserDiplomaController.getUserDiplomaById - Request:', {
    //   params: httpRequest.params,
    //   user: httpRequest.user
    // });
    try {
      const { id } = httpRequest.params;

      if (!id) {
        // console.log('UserDiplomaController.getUserDiplomaById - Missing id');
        return this.httpErrors.error_400();
      }

      const result = await this.getUserDiplomaByIdUseCase.execute({ id });
      // console.log('UserDiplomaController.getUserDiplomaById - UseCase Result:', result);

      if (!result.success) {
        // console.log('UserDiplomaController.getUserDiplomaById - UseCase failed');
        return this.httpErrors.error_404();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`UserDiplomaController.getUserDiplomaById - Error:`, err);
      return this.httpErrors.error_500();
    }
  }

  async getUserDiplomaChapter(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    // console.log('UserDiplomaController.getUserDiplomaChapter - Request:', {
    //   params: httpRequest.params,
    //   user: httpRequest.user
    // });
    try {
      const { courseId, chapterId } = httpRequest.params;

      if (!courseId || !chapterId) {
        // console.log('UserDiplomaController.getUserDiplomaChapter - Missing courseId or chapterId');
        return this.httpErrors.error_400();
      }

      const result = await this.getUserDiplomaChapterUseCase.execute({ courseId, chapterId });
      // console.log('UserDiplomaController.getUserDiplomaChapter - UseCase Result:', result);

      if (!result.success) {
        // console.log('UserDiplomaController.getUserDiplomaChapter - UseCase failed');
        return this.httpErrors.error_404();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`UserDiplomaController.getUserDiplomaChapter - Error:`, err);
      return this.httpErrors.error_500();
    }
  }

  async updateVideoProgress(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    // console.log('UserDiplomaController.updateVideoProgress - Request:', {
    //   params: httpRequest.params,
    //   body: httpRequest.body,
    //   user: httpRequest.user
    // });
    try {
      if (!httpRequest.user) {
        // console.log('UserDiplomaController.updateVideoProgress - No user found');
        return this.httpErrors.error_401();
      }

      const { id } = httpRequest.user;
      const { courseId, chapterId } = httpRequest.params;
      const { progress } = httpRequest.body;

      if (!courseId || !chapterId || typeof progress !== 'number') {
        // console.log('UserDiplomaController.updateVideoProgress - Invalid params:', { courseId, chapterId, progress });
        return this.httpErrors.error_400();
      }

      const result = await this.updateVideoProgressUseCase.execute({ 
        userId: id, 
        courseId, 
        chapterId, 
        progress 
      });
      // console.log('UserDiplomaController.updateVideoProgress - UseCase Result:', result);

      if (!result.success) {
        // console.log('UserDiplomaController.updateVideoProgress - UseCase failed');
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`UserDiplomaController.updateVideoProgress - Error:`, err);
      return this.httpErrors.error_400();
    }
  }

  async markChapterComplete(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    // console.log('UserDiplomaController.markChapterComplete - Request:', {
    //   params: httpRequest.params,
    //   user: httpRequest.user
    // });
    try {
      if (!httpRequest.user) {
        // console.log('UserDiplomaController.markChapterComplete - No user found');
        return this.httpErrors.error_401();
      }

      const { id } = httpRequest.user;
      const { courseId, chapterId } = httpRequest.params;

      if (!courseId || !chapterId) {
        // console.log('UserDiplomaController.markChapterComplete - Missing courseId or chapterId');
        return this.httpErrors.error_400();
      }

      const result = await this.markChapterCompleteUseCase.execute({ 
        userId: id, 
        courseId, 
        chapterId 
      });
      // console.log('UserDiplomaController.markChapterComplete - UseCase Result:', result);

      if (!result.success) {
        // console.log('UserDiplomaController.markChapterComplete - UseCase failed');
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`UserDiplomaController.markChapterComplete - Error:`, err);
      return this.httpErrors.error_400();
    }
  }

  async toggleBookmark(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    // console.log('UserDiplomaController.toggleBookmark - Request:', {
    //   params: httpRequest.params,
    //   user: httpRequest.user
    // });
    try {
      if (!httpRequest.user) {
        // console.log('UserDiplomaController.toggleBookmark - No user found');
        return this.httpErrors.error_401();
      }

      const { id } = httpRequest.user;
      const { courseId, chapterId } = httpRequest.params;

      if (!courseId || !chapterId) {
        // console.log('UserDiplomaController.toggleBookmark - Missing courseId or chapterId');
        return this.httpErrors.error_400();
      }

      const result = await this.toggleBookmarkUseCase.execute({ 
        userId: id, 
        courseId, 
        chapterId 
      });
      // console.log('UserDiplomaController.toggleBookmark - UseCase Result:', result);

      if (!result.success) {
        console.log('UserDiplomaController.toggleBookmark - UseCase failed');
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`UserDiplomaController.toggleBookmark - Error:`, err);
      return this.httpErrors.error_400();
    }
  }

  async getCompletedChapters(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    console.log('UserDiplomaController.getCompletedChapters - Request:', {
      params: httpRequest.params,
      user: httpRequest.user
    });
    try {
      if (!httpRequest.user) {
        // console.log('UserDiplomaController.getCompletedChapters - No user found');
        return this.httpErrors.error_401();
      }

      const { id } = httpRequest.user;
      const { courseId } = httpRequest.params;

      if (!courseId) {
        console.error('UserDiplomaController.getCompletedChapters - Missing courseId');
        return this.httpErrors.error_400();
      }

      const result = await this.getCompletedChaptersUseCase.execute(id, courseId);
      // console.log('UserDiplomaController.getCompletedChapters - UseCase Result:', result);

      if (!result.success) {
        // console.log('UserDiplomaController.getCompletedChapters - UseCase failed');
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`UserDiplomaController.getCompletedChapters - Error:`, err);
      return this.httpErrors.error_400();
    }
  }

  async getBookmarkedChapters(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    // console.log('UserDiplomaController.getBookmarkedChapters - Request:', {
    //   params: httpRequest.params,
    //   user: httpRequest.user
    // });
    try {
      if (!httpRequest.user) {
        // console.log('UserDiplomaController.getBookmarkedChapters - No user found');
        return this.httpErrors.error_401();
      }

      const { id } = httpRequest.user;
      const { courseId } = httpRequest.params;

      if (!courseId) {
        // console.log('UserDiplomaController.getBookmarkedChapters - Missing courseId');
        return this.httpErrors.error_400();
      }

      const result = await this.getBookmarkedChaptersUseCase.execute(id, courseId);
      // console.log('UserDiplomaController.getBookmarkedChapters - UseCase Result:', result);

      if (!result.success) {
        // console.log('UserDiplomaController.getBookmarkedChapters - UseCase failed');
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (err) {
      console.error(`UserDiplomaController.getBookmarkedChapters - Error:`, err);
      return this.httpErrors.error_400();
    }
  }
} 