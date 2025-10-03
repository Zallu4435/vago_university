import { IHttpRequest, IHttpResponse, IUserAssignmentController, HttpSuccess, HttpErrors } from '../../http/IHttp';
import {
  IGetUserAssignmentsUseCase,
  IGetUserAssignmentByIdUseCase,
  ISubmitUserAssignmentUseCase,
  IGetUserAssignmentStatusUseCase,
  IGetUserAssignmentFeedbackUseCase
} from '../../../application/assignments/useCases/IUserAssignmentUseCases';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../../../config/config';
import { AssignmentStatus } from '../../../domain/assignments/assignmenttypes';

export class UserAssignmentController implements IUserAssignmentController {
  private _httpSuccess: HttpSuccess;
  private _httpErrors: HttpErrors;

  constructor(
    private _getUserAssignmentsUseCase: IGetUserAssignmentsUseCase,
    private _getUserAssignmentByIdUseCase: IGetUserAssignmentByIdUseCase,
    private _submitUserAssignmentUseCase: ISubmitUserAssignmentUseCase,
    private _getUserAssignmentStatusUseCase: IGetUserAssignmentStatusUseCase,
    private _getUserAssignmentFeedbackUseCase: IGetUserAssignmentFeedbackUseCase
  ) {
    this._httpSuccess = new HttpSuccess();
    this._httpErrors = new HttpErrors();
  }

  async getAssignments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { subject, status, page, limit, search, sortBy } = httpRequest.query;
    const result = await this._getUserAssignmentsUseCase.execute({
      subject: subject as string,
      status: status as AssignmentStatus,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      sortBy: sortBy as string,
      studentId: httpRequest.user?.userId
    });
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(result.data);
  }

  async getAssignmentById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const result = await this._getUserAssignmentByIdUseCase.execute({ id, studentId: httpRequest.user?.userId });
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(result.data);
  }

  async downloadAssignmentFile(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { fileUrl, fileName } = httpRequest.query;
    if (!fileUrl || typeof fileUrl !== 'string') {
      return this._httpErrors.error_400();
    }
    if (!fileName || typeof fileName !== 'string') {
      return this._httpErrors.error_400();
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
      return this._httpSuccess.success_200({
        downloadUrl: signedUrl,
        fileName: fileName
      });
    } else {
      return this._httpSuccess.success_200({
        downloadUrl: fileUrl,
        fileName: fileName
      });
    }
  }

  async submitAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const file = httpRequest.file;
    if (!file) {
      return this._httpErrors.error_400();
    }
    const result = await this._submitUserAssignmentUseCase.execute({
      assignmentId: id,
      file: file,
      studentId: httpRequest.user?.userId
    });
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_201(result.data);
  }

  async getAssignmentStatus(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { assignmentId } = httpRequest.params;
    const result = await this._getUserAssignmentStatusUseCase.execute({
      assignmentId,
      studentId: httpRequest.user?.userId
    });
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(result.data);
  }

  async getAssignmentFeedback(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { assignmentId } = httpRequest.params;
    const result = await this._getUserAssignmentFeedbackUseCase.execute({
      assignmentId,
      studentId: httpRequest.user?.userId
    });
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(result.data);
  }
} 