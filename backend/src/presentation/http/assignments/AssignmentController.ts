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
} from '../../../application/assignments/useCases/AssignmentUseCases';


export class AssignmentController implements IAssignmentController {
  private httpSuccess: HttpSuccess;
  private httpErrors: HttpErrors;

  constructor(
    private getAssignmentsUseCase: IGetAssignmentsUseCase,
    private getAssignmentByIdUseCase: IGetAssignmentByIdUseCase,
    private createAssignmentUseCase: ICreateAssignmentUseCase,
    private updateAssignmentUseCase: IUpdateAssignmentUseCase,
    private deleteAssignmentUseCase: IDeleteAssignmentUseCase,
    private getSubmissionsUseCase: IGetSubmissionsUseCase,
    private getSubmissionByIdUseCase: IGetSubmissionByIdUseCase,
    private reviewSubmissionUseCase: IReviewSubmissionUseCase,
    private getAnalyticsUseCase: IGetAnalyticsUseCase
  ) {
    this.httpSuccess = new HttpSuccess();
    this.httpErrors = new HttpErrors();
  }

  async getAssignments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { subject, status, page, limit, search } = httpRequest.query;
    const result = await this.getAssignmentsUseCase.execute({
      subject: subject as string,
      status: status as 'draft' | 'published' | 'closed',
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
    });
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(result.data);
  }

  async getAssignmentById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const result = await this.getAssignmentByIdUseCase.execute({ id });
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(result.data);
  }

  async createAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const assignmentData = {
      ...httpRequest.body,
      files: httpRequest.files
    };
    const result = await this.createAssignmentUseCase.execute(assignmentData);
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_201(result.data);
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
    const result = await this.updateAssignmentUseCase.execute({ id, ...updateData });
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(result.data);
  }

  async deleteAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const result = await this.deleteAssignmentUseCase.execute({ id });
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200({ message: "Assignment deleted successfully" });
  }

  async getSubmissions(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { assignmentId } = httpRequest.params;
    const { page, limit, search, status } = httpRequest.query;

    const result = await this.getSubmissionsUseCase.execute({
      assignmentId,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      status: status as 'pending' | 'reviewed' | 'late' | 'needs_correction',
    });

    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(result.data);
  }

  async getSubmissionById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { assignmentId, submissionId } = httpRequest.params;
    const result = await this.getSubmissionByIdUseCase.execute({
      assignmentId,
      submissionId
    });
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(result.data);
  }

  async reviewSubmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { assignmentId, submissionId } = httpRequest.params;
    console.log(httpRequest.body, 'httpRequest.body');
    console.log(assignmentId, 'assignmentId');
    console.log(submissionId, 'submissionId');
    const { marks, feedback, status, isLate } = httpRequest.body;
    if (!submissionId || submissionId === 'undefined') {
      return this.httpErrors.error_400();
    }
    if (!assignmentId) {
      return this.httpErrors.error_400();
    }
    if (marks === undefined || feedback === undefined || status === undefined || isLate === undefined) {
      return this.httpErrors.error_400();
    }
    const result = await this.reviewSubmissionUseCase.execute({
      assignmentId,
      submissionId,
      marks,
      feedback,
      status,
      isLate
    });
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(result.data);
  }

  async getAnalytics(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const result = await this.getAnalyticsUseCase.execute();
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(result.data);
  }
} 