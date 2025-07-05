import { IVideoSessionController, IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess } from '../IHttp';
import { CreateVideoSessionUseCase, JoinVideoSessionUseCase, GetVideoSessionUseCase, UpdateVideoSessionUseCase, DeleteVideoSessionUseCase, GetAllVideoSessionsUseCase, UpdateVideoSessionStatusUseCase } from '../../../application/session/useCases/VideoSessionUseCases';

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
    private updateAttendanceStatusUseCase: any
  ) {}

  async createSession(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const result = await this.createUseCase.execute(httpRequest.body);
      return httpSuccess.success_201(result);
    } catch (error: any) {
      return httpErrors.error_400(error.message);
    }
  }

  async joinSession(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const result = await this.joinUseCase.execute({
        sessionId: httpRequest.params.id,
        participantId: httpRequest.body.participantId,
      });
      return httpSuccess.success_200(result);
    } catch (error: any) {
      return httpErrors.error_400(error.message);
    }
  }

  async getSession(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const session = await this.getUseCase.execute(httpRequest.params.id);
      if (!session) return httpErrors.error_404('Session not found');
      return httpSuccess.success_200(session);
    } catch (error: any) {
      return httpErrors.error_400(error.message);
    }
  }

  async updateSession(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const session = await this.updateUseCase.execute({ sessionId: httpRequest.params.id, data: httpRequest.body });
      if (!session) return httpErrors.error_404('Session not found');
      return httpSuccess.success_200(session);
    } catch (error: any) {
      return httpErrors.error_400(error.message);
    }
  }

  async deleteSession(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      await this.deleteUseCase.execute({ sessionId: httpRequest.params.id });
      return { statusCode: 204, body: {} };
    } catch (error: any) {
      return httpErrors.error_400(error.message);
    }
  }

  async getAllSessions(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const sessions = await this.getAllUseCase.execute();
      return httpSuccess.success_200(sessions);
    } catch (error: any) {
      return httpErrors.error_400(error.message);
    }
  }

  async updateSessionStatus(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { status } = httpRequest.body;
      const session = await this.updateStatusUseCase.execute(httpRequest.params.id, status);
      if (!session) return httpErrors.error_404('Session not found');
      return httpSuccess.success_200(session);
    } catch (error: any) {
      return httpErrors.error_400(error.message);
    }
  }

  async getSessionAttendance(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const sessionId = httpRequest.params.id || httpRequest.params.sessionId;
      const attendance = await this.getSessionAttendanceUseCase.execute(sessionId);
      return httpSuccess.success_200(attendance);
    } catch (error: any) {
      return httpErrors.error_400(error.message);
    }
  }

  async updateAttendanceStatus(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const sessionId = httpRequest.params.id || httpRequest.params.sessionId;
      const userId = httpRequest.params.userId;
      const { status, name } = httpRequest.body;
      await this.updateAttendanceStatusUseCase.execute(sessionId, userId, status, name);
      return httpSuccess.success_200({ message: 'Attendance status updated' });
    } catch (error: any) {
      return httpErrors.error_400(error.message);
    }
  }
} 