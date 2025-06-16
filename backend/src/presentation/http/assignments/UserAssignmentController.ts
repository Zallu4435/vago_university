import { IHttpRequest, IHttpResponse, IUserAssignmentController, HttpSuccess, HttpErrors } from '../../http/IHttp';
import {
  GetUserAssignmentsUseCase,
  GetUserAssignmentByIdUseCase,
  SubmitUserAssignmentUseCase,
  GetUserAssignmentStatusUseCase,
  GetUserAssignmentFeedbackUseCase
} from '../../../application/assignments/useCases/UserAssignmentUseCases';

export class UserAssignmentController implements IUserAssignmentController {
  private httpSuccess: HttpSuccess;
  private httpErrors: HttpErrors;

  constructor(
    private getUserAssignmentsUseCase: GetUserAssignmentsUseCase,
    private getUserAssignmentByIdUseCase: GetUserAssignmentByIdUseCase,
    private submitUserAssignmentUseCase: SubmitUserAssignmentUseCase,
    private getUserAssignmentStatusUseCase: GetUserAssignmentStatusUseCase,
    private getUserAssignmentFeedbackUseCase: GetUserAssignmentFeedbackUseCase
  ) {
    this.httpSuccess = new HttpSuccess();
    this.httpErrors = new HttpErrors();
  }

  async getAssignments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const startTime = Date.now();
    
    try {
      const { subject, status, page, limit } = httpRequest.query;
      
      const result = await this.getUserAssignmentsUseCase.execute({
        subject: subject as string,
        status: status as 'pending' | 'submitted' | 'reviewed',
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        studentId: httpRequest.user?.id
      });

      if (!result.success) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (error) {
      const endTime = Date.now();
      console.error('Controller: getAssignments error after', endTime - startTime, 'ms:', error);
      return this.httpErrors.error_500();
    }
  }

  async getAssignmentById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const result = await this.getUserAssignmentByIdUseCase.execute({ id, studentId: httpRequest.user?.id });

      if (!result.success) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (error) {
      console.error('Controller: getAssignmentById error:', error);
      return this.httpErrors.error_500();
    }
  }

  async submitAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const file = httpRequest.file;
      
      if (!file) {
        return this.httpErrors.error_400({ message: 'No file provided' });
      }


      const result = await this.submitUserAssignmentUseCase.execute({
        assignmentId: id,
        file: {
          fieldname: file.fieldname,
          originalname: file.originalname,
          encoding: file.encoding,
          mimetype: file.mimetype,
          path: file.path,
          size: file.size,
          filename: file.filename
        },
        studentId: httpRequest.user?.id
      });


      if (!result.success) {
        return this.httpErrors.error_400(result.data);
      }


      return this.httpSuccess.success_201(result.data);
    } catch (error) {
      console.error('Controller: submitAssignment error:', error);
      console.error('Controller: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return this.httpErrors.error_500();
    }
  }

  async getAssignmentStatus(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { assignmentId } = httpRequest.params;
      const result = await this.getUserAssignmentStatusUseCase.execute({
        assignmentId,
        studentId: httpRequest.user?.id
      });

      if (!result.success) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (error) {
      console.error('Controller: getAssignmentStatus error:', error);
      return this.httpErrors.error_500();
    }
  }

  async getAssignmentFeedback(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { assignmentId } = httpRequest.params;
      const result = await this.getUserAssignmentFeedbackUseCase.execute({
        assignmentId,
        studentId: httpRequest.user?.id
      });

      if (!result.success) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (error) {
      console.error('Controller: getAssignmentFeedback error:', error);
      return this.httpErrors.error_500();
    }
  }
} 