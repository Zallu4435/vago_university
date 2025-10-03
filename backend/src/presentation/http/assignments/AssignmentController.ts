import { IHttpRequest, IHttpResponse, IAssignmentController, HttpSuccess, HttpErrors } from '../../http/IHttp';
import {
  IGetAssignmentsUseCase,
  IGetAssignmentByIdUseCase,
  ICreateAssignmentUseCase,
  IUpdateAssignmentUseCase,
  IDeleteAssignmentUseCase,
  IGetSubmissionsUseCase,
  IGetSubmissionByIdUseCase,
  IReviewSubmissionUseCase,
  IGetAnalyticsUseCase
} from '../../../application/assignments/useCases/IAssignmentUseCases';


export class AssignmentController implements IAssignmentController {
  private _httpSuccess: HttpSuccess;
  private _httpErrors: HttpErrors;

  constructor(
    private _getAssignmentsUseCase: IGetAssignmentsUseCase,
    private _getAssignmentByIdUseCase: IGetAssignmentByIdUseCase,
    private _createAssignmentUseCase: ICreateAssignmentUseCase,
    private _updateAssignmentUseCase: IUpdateAssignmentUseCase,
    private _deleteAssignmentUseCase: IDeleteAssignmentUseCase,
    private _getSubmissionsUseCase: IGetSubmissionsUseCase,
    private _getSubmissionByIdUseCase: IGetSubmissionByIdUseCase,
    private _reviewSubmissionUseCase: IReviewSubmissionUseCase,
    private _getAnalyticsUseCase: IGetAnalyticsUseCase
  ) {
    this._httpSuccess = new HttpSuccess();
    this._httpErrors = new HttpErrors();
  }

  async getAssignments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { subject, status, page, limit, search } = httpRequest.query;
    const result = await this._getAssignmentsUseCase.execute({
      subject: subject as string,
      status: status as 'draft' | 'published' | 'closed',
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
    });
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(result.data);
  }

  async getAssignmentById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const result = await this._getAssignmentByIdUseCase.execute({ id });
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(result.data);
  }

  async createAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const assignmentData = {
      ...httpRequest.body,
      files: httpRequest.files
    };
    const result = await this._createAssignmentUseCase.execute(assignmentData);
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_201(result.data);
  }

  async updateAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    let updateData = { ...httpRequest.body };
    if (httpRequest.files && httpRequest.files.length > 0) {
      updateData.files = httpRequest.files.map((file: Express.Multer.File) => ({
        fileName: file.originalname,
        fileUrl: file.path,
        fileSize: file.size
      }));
    }
    const result = await this._updateAssignmentUseCase.execute({ id, ...updateData });
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(result.data);
  }

  async deleteAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const result = await this._deleteAssignmentUseCase.execute({ id });
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200({ message: "Assignment deleted successfully" });
  }

  async getSubmissions(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { assignmentId } = httpRequest.params;
    const { page, limit, search, status } = httpRequest.query;

    const result = await this._getSubmissionsUseCase.execute({
      assignmentId,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      status: status as 'pending' | 'reviewed' | 'late' | 'needs_correction',
    });

    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(result.data);
  }

  async getSubmissionById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { assignmentId, submissionId } = httpRequest.params;
    const result = await this._getSubmissionByIdUseCase.execute({
      assignmentId,
      submissionId
    });
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(result.data);
  }

  async reviewSubmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { assignmentId, submissionId } = httpRequest.params;
    
    const { marks, feedback, status, isLate } = httpRequest.body;
    if (!submissionId || submissionId === 'undefined') {
      return this._httpErrors.error_400();
    }
    if (!assignmentId) {
      return this._httpErrors.error_400();
    }
    if (marks === undefined || feedback === undefined || status === undefined || isLate === undefined) {
      return this._httpErrors.error_400();
    }
    const result = await this._reviewSubmissionUseCase.execute({
      assignmentId,
      submissionId,
      marks,
      feedback,
      status,
      isLate
    });
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(result.data);
  }

  async getAnalytics(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const result = await this._getAnalyticsUseCase.execute();
    if (!result.success) {
      return this._httpErrors.error_400();
    }
    return this._httpSuccess.success_200(result.data);
  }
} 