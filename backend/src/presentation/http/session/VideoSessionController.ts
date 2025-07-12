import { IVideoSessionController, IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess } from '../IHttp';
import { CreateVideoSessionUseCase, JoinVideoSessionUseCase, GetVideoSessionUseCase, UpdateVideoSessionUseCase, DeleteVideoSessionUseCase, GetAllVideoSessionsUseCase, UpdateVideoSessionStatusUseCase, RecordAttendanceJoinUseCase, RecordAttendanceLeaveUseCase } from '../../../application/session/useCases/VideoSessionUseCases';

const httpErrors = new HttpErrors();
const httpSuccess = new HttpSuccess();

export class VideoSessionController implements IVideoSessionController {
  constructor(
    private createUseCase: CreateVideoSessionUseCase,
    private joinUseCase: JoinVideoSessionUseCase,
    private getUseCase: GetVideoSessionUseCase,
    private updateUseCase: UpdateVideoSessionUseCase,
    private deleteUseCase: DeleteVideoSessionUseCase,
    private getAllUseCase: GetAllVideoSessionsUseCase,
    private updateStatusUseCase: UpdateVideoSessionStatusUseCase,
    private getSessionAttendanceUseCase: any,
    private updateAttendanceStatusUseCase: any,
    private recordAttendanceJoinUseCase: RecordAttendanceJoinUseCase,
    private recordAttendanceLeaveUseCase: RecordAttendanceLeaveUseCase
  ) { }

  async createSession(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const facultyId = httpRequest.user?.userId;
    if (!facultyId) {
      return httpErrors.error_401('Faculty ID not found in request');
    }
    const sessionData = {
      ...httpRequest.body,
      hostId: facultyId
    };
    const result = await this.createUseCase.execute(sessionData);
    return httpSuccess.success_201(result);
  }

  async joinSession(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const result = await this.joinUseCase.execute({
      sessionId: httpRequest.params.id,
      participantId: httpRequest.body.participantId,
    });
    return httpSuccess.success_200(result);
  }

  async getSession(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const session = await this.getUseCase.execute(httpRequest.params.id);
    if (!session) return httpErrors.error_404('Session not found');
    return httpSuccess.success_200(session);
  }

  async updateSession(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const session = await this.updateUseCase.execute({ sessionId: httpRequest.params.id, data: httpRequest.body });
    if (!session) return httpErrors.error_404('Session not found');
    return httpSuccess.success_200(session);
  }

  async deleteSession(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    await this.deleteUseCase.execute({ sessionId: httpRequest.params.id });
    return { statusCode: 204, body: {} };
  }

  async getAllSessions(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const sessions = await this.getAllUseCase.execute();
    return httpSuccess.success_200(sessions);
  }

  async updateSessionStatus(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { status } = httpRequest.body;
    const session = await this.updateStatusUseCase.execute(httpRequest.params.id, status);
    if (!session) return httpErrors.error_404('Session not found');
    return httpSuccess.success_200(session);
  }

  async getSessionAttendance(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const sessionId = httpRequest.params.id || httpRequest.params.sessionId;
    const attendance = await this.getSessionAttendanceUseCase.execute(sessionId, httpRequest.query);
    return httpSuccess.success_200(attendance);
  }

  async updateAttendanceStatus(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const sessionId = httpRequest.params.id || httpRequest.params.sessionId;
    const userId = httpRequest.params.userId;
    const { status, name } = httpRequest.body;
    await this.updateAttendanceStatusUseCase.execute(sessionId, userId, status, name);
    return httpSuccess.success_200({ message: 'Attendance status updated' });
  }

  async recordAttendanceJoin(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const sessionId = httpRequest.params.id;
    const userId = httpRequest.user?.userId;
    if (!userId) {
      return httpErrors.error_401('User ID not found in request');
    }
    await this.recordAttendanceJoinUseCase.execute(sessionId, userId);
    return httpSuccess.success_200({ message: 'Join recorded' });
  }

  async recordAttendanceLeave(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const sessionId = httpRequest.params.id;
    const userId = httpRequest.user?.userId;
    if (!userId) {
      return httpErrors.error_401('User ID not found in request');
    }
    await this.recordAttendanceLeaveUseCase.execute(sessionId, userId);
    return httpSuccess.success_200({ message: 'Leave recorded' });
  }
} 