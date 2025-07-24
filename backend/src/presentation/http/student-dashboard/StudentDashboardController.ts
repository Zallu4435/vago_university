// StudentDashboardController.ts
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IStudentDashboardController } from "../IHttp";
import {
  GetAnnouncementsUseCase,
  GetDeadlinesUseCase,
  GetClassesUseCase,
  GetCalendarDaysUseCase,
  GetNewEventsUseCase,
  GetUserInfoForDashboardUseCase
} from '../../../application/student/useCases/StudentDashboardUseCases';

export class StudentDashboardController implements IStudentDashboardController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getAnnouncementsUseCase: GetAnnouncementsUseCase,
    private getDeadlinesUseCase: GetDeadlinesUseCase,
    private getClassesUseCase: GetClassesUseCase,
    private getCalendarDaysUseCase: GetCalendarDaysUseCase,
    private getNewEventsUseCase: GetNewEventsUseCase,
    private getUserInfoForDashboardUseCase: GetUserInfoForDashboardUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getAnnouncements(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { limit, startDate, endDate } = httpRequest.query || {};
    const response = await this.getAnnouncementsUseCase.execute({
      studentId: httpRequest.user?.userId,
      limit: limit ? Number(limit) : undefined,
      startDate: startDate ? String(startDate) : undefined,
      endDate: endDate ? String(endDate) : undefined
    });

    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getDeadlines(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { startDate, endDate, urgentOnly, courseId } = httpRequest.query || {};
    const response = await this.getDeadlinesUseCase.execute({
      studentId: httpRequest.user?.userId,
      startDate: startDate ? String(startDate) : undefined,
      endDate: endDate ? String(endDate) : undefined,
      urgentOnly: urgentOnly === 'true',
      courseId: courseId ? String(courseId) : undefined
    });

    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getClasses(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { term, status } = httpRequest.query || {};
    const response = await this.getClassesUseCase.execute({
      studentId: httpRequest.user?.userId,
      term: term ? String(term) : undefined,
      status: status ? String(status) as 'upcoming' | 'ongoing' | 'completed' : undefined
    });

    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getNewEvents(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const studentId = httpRequest.user?.userId;
    const response = await this.getNewEventsUseCase.execute(studentId);
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getCalendarDays(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { month, year, types } = httpRequest.query || {};
    const response = await this.getCalendarDaysUseCase.execute({
      studentId: httpRequest.user?.userId,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      includeTypes: types ? String(types).split(',') as ('class' | 'event' | 'sports' | 'club')[] : undefined
    });

    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }


  async getUserInfo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const studentId = httpRequest.user?.userId;
    if (!studentId) {
      return this.httpErrors.error_401();
    }
    const response = await this.getUserInfoForDashboardUseCase.execute({ studentId });
    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }
} 