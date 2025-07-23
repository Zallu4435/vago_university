import { IHttpRequest, IHttpResponse, IUserAssignmentController, HttpSuccess, HttpErrors } from '../../http/IHttp';
import {
  GetUserAssignmentsUseCase,
  GetUserAssignmentByIdUseCase,
  SubmitUserAssignmentUseCase,
  GetUserAssignmentStatusUseCase,
  GetUserAssignmentFeedbackUseCase
} from '../../../application/assignments/useCases/UserAssignmentUseCases';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../../../config/config';

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
    const { subject, status, page, limit, search, sortBy } = httpRequest.query;
    const result = await this.getUserAssignmentsUseCase.execute({
      subject: subject as string,
      status: status as any,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      sortBy: sortBy as string,
      studentId: httpRequest.user?.userId
    });
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(result.data);
  }

  async getAssignmentById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const result = await this.getUserAssignmentByIdUseCase.execute({ id, studentId: httpRequest.user?.userId });
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(result.data);
  }

  async downloadAssignmentFile(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { fileUrl, fileName } = httpRequest.query;
    if (!fileUrl || typeof fileUrl !== 'string') {
      return this.httpErrors.error_400();
    }
    if (!fileName || typeof fileName !== 'string') {
      return this.httpErrors.error_400();
    }
    if (fileUrl.includes('cloudinary.com')) {
      const publicId = fileUrl
        .replace(/^https:\/\/res\.cloudinary\.com\/vago-university\/[^\/]+\/upload\/v[0-9]+\//, '')
        .replace(/\.[^/.]+$/, '');
      const signedUrl = cloudinary.url(publicId, {
        resource_type: 'auto',
        secure: true,
        type: 'upload',
        sign_url: true,
        api_secret: config.cloudinary.apiSecret,
      });
      return this.httpSuccess.success_200({
        downloadUrl: signedUrl,
        fileName: fileName
      });
    } else {
      return this.httpSuccess.success_200({
        downloadUrl: fileUrl,
        fileName: fileName
      });
    }
  }

  async submitAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const file = httpRequest.file;
    if (!file) {
      return this.httpErrors.error_400();
    }
    const result = await this.submitUserAssignmentUseCase.execute({
      assignmentId: id,
      file: file,
      studentId: httpRequest.user?.userId
    });
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_201(result.data);
  }

  async getAssignmentStatus(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { assignmentId } = httpRequest.params;
    const result = await this.getUserAssignmentStatusUseCase.execute({
      assignmentId,
      studentId: httpRequest.user?.userId
    });
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(result.data);
  }

  async getAssignmentFeedback(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { assignmentId } = httpRequest.params;
    const result = await this.getUserAssignmentFeedbackUseCase.execute({
      assignmentId,
      studentId: httpRequest.user?.userId
    });
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(result.data);
  }
} 