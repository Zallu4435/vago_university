// StudentDashboardController.ts
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IStudentDashboardController } from "../IHttp";
import {
  GetStudentDashboardDataUseCase,
  GetAnnouncementsUseCase,
  GetDeadlinesUseCase,
  GetClassesUseCase,
  GetOnlineTopicsUseCase,
  GetCalendarDaysUseCase,
  GetSpecialDatesUseCase
} from '../../../application/student/useCases/StudentDashboardUseCases';

export class StudentDashboardController implements IStudentDashboardController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getDashboardDataUseCase: GetStudentDashboardDataUseCase,
    private getAnnouncementsUseCase: GetAnnouncementsUseCase,
    private getDeadlinesUseCase: GetDeadlinesUseCase,
    private getClassesUseCase: GetClassesUseCase,
    private getOnlineTopicsUseCase: GetOnlineTopicsUseCase,
    private getCalendarDaysUseCase: GetCalendarDaysUseCase,
    private getSpecialDatesUseCase: GetSpecialDatesUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getAnnouncements(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { limit, startDate, endDate } = httpRequest.query || {};
    const response = await this.getAnnouncementsUseCase.execute({
      studentId: httpRequest.user?.id,
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
      studentId: httpRequest.user?.id,
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
      studentId: httpRequest.user?.id,
      term: term ? String(term) : undefined,
      status: status ? String(status) as 'upcoming' | 'ongoing' | 'completed' : undefined
    });

    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getOnlineTopics(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { courseId, limit, includeVoted } = httpRequest.query || {};
    const response = await this.getOnlineTopicsUseCase.execute({
      studentId: httpRequest.user?.id,
      courseId: courseId ? String(courseId) : undefined,
      limit: limit ? Number(limit) : undefined,
      includeVoted: includeVoted === 'true'
    });

    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getCalendarDays(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { month, year, types } = httpRequest.query || {};
    const response = await this.getCalendarDaysUseCase.execute({
      studentId: httpRequest.user?.id,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      includeTypes: types ? String(types).split(',') as ('class' | 'event' | 'sports' | 'club')[] : undefined
    });

    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getSpecialDates(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { month, year, types } = httpRequest.query || {};
    const response = await this.getSpecialDatesUseCase.execute({
      studentId: httpRequest.user?.id,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      types: types ? String(types).split(',') as ('event' | 'sports' | 'club')[] : undefined
    });

    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }

  async getDashboardData(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const {
      includeAnnouncements,
      includeDeadlines,
      includeClasses,
      includeOnlineTopics,
      includeCalendarDays,
      includeSpecialDates
    } = httpRequest.query || {};

    const response = await this.getDashboardDataUseCase.execute({
      studentId: httpRequest.user?.id,
      includeAnnouncements: includeAnnouncements !== 'false',
      includeDeadlines: includeDeadlines !== 'false',
      includeClasses: includeClasses !== 'false',
      includeOnlineTopics: includeOnlineTopics !== 'false',
      includeCalendarDays: includeCalendarDays !== 'false',
      includeSpecialDates: includeSpecialDates !== 'false'
    });

    if (!response.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(response.data);
  }
} 