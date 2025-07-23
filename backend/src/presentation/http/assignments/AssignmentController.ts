import { IHttpRequest, IHttpResponse, IAssignmentController, HttpSuccess, HttpErrors } from '../../http/IHttp';
import {
  GetAssignmentsUseCase,
  GetAssignmentByIdUseCase,
  CreateAssignmentUseCase,
  UpdateAssignmentUseCase,
  DeleteAssignmentUseCase,
  GetSubmissionsUseCase,
  GetSubmissionByIdUseCase,
  ReviewSubmissionUseCase,
  DownloadSubmissionUseCase,
  GetAnalyticsUseCase
} from '../../../application/assignments/useCases/AssignmentUseCases';


export class AssignmentController implements IAssignmentController {
  private httpSuccess: HttpSuccess;
  private httpErrors: HttpErrors;

  constructor(
    private getAssignmentsUseCase: GetAssignmentsUseCase,
    private getAssignmentByIdUseCase: GetAssignmentByIdUseCase,
    private createAssignmentUseCase: CreateAssignmentUseCase,
    private updateAssignmentUseCase: UpdateAssignmentUseCase,
    private deleteAssignmentUseCase: DeleteAssignmentUseCase,
    private getSubmissionsUseCase: GetSubmissionsUseCase,
    private getSubmissionByIdUseCase: GetSubmissionByIdUseCase,
    private reviewSubmissionUseCase: ReviewSubmissionUseCase,
    private downloadSubmissionUseCase: DownloadSubmissionUseCase,
    private getAnalyticsUseCase: GetAnalyticsUseCase
  ) {
    this.httpSuccess = new HttpSuccess();
    this.httpErrors = new HttpErrors();
  }

  async getAssignments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { subject, status, page, limit } = httpRequest.query;
    const result = await this.getAssignmentsUseCase.execute({
      subject: subject as string,
      status: status as 'draft' | 'published' | 'closed',
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
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
      updateData.files = httpRequest.files.map((file: any) => ({
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
    const { page, limit } = httpRequest.query;
    const result = await this.getSubmissionsUseCase.execute({
      assignmentId,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
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

  async downloadSubmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { assignmentId, submissionId } = httpRequest.params;
    const result = await this.downloadSubmissionUseCase.execute({
      assignmentId,
      submissionId
    });
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return {
      statusCode: 200,
      body: { data: result.data },
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment'
      }
    } as any;
  }

  async getAnalytics(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const result = await this.getAnalyticsUseCase.execute();
    if (!result.success) {
      return this.httpErrors.error_400();
    }
    return this.httpSuccess.success_200(result.data);
  }

  async viewAssignmentFile(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params;
    const { fileName } = httpRequest.query;
    const result = await this.getAssignmentByIdUseCase.execute({ id });
    if (!result.success || !(result.data as any).assignment) {
      return this.httpErrors.error_404('Assignment not found');
    }
    const assignment = (result.data as any).assignment;
    const file = assignment.files.find((f: any) => f.fileName === fileName);
    if (!file) {
      return this.httpErrors.error_404('File not found');
    }
    const response = await fetch(file.fileUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!response.ok) {
      return this.httpErrors.error_404('Failed to fetch file from Cloudinary');
    }
    const pdfBuffer = await response.arrayBuffer();
    return {
      statusCode: 200,
      body: {
        data: {
          pdfData: Buffer.from(pdfBuffer).toString('base64'),
          fileName: file.fileName,
          contentType: 'application/pdf'
        }
      }
    };
  }
} 