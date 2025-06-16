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
    try {
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
    } catch (error) {
      return this.httpErrors.error_500();
    }
  }

  async getAssignmentById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const result = await this.getAssignmentByIdUseCase.execute({ id });

      if (!result.success) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (error) {
      return this.httpErrors.error_500();
    }
  }

  async createAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {

      const assignmentData = {
        ...httpRequest.body,
        files: httpRequest.files // Pass the full file objects
      };

      const result = await this.createAssignmentUseCase.execute(assignmentData);

      if (!result.success) {
        console.error('Assignment creation failed:', result.data);
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_201(result.data);
    } catch (error) {
      console.error('Error creating assignment:', error);
      return this.httpErrors.error_500();
    }
  }

  async updateAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const result = await this.updateAssignmentUseCase.execute({ id, ...httpRequest.body });

      if (!result.success) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (error) {
      return this.httpErrors.error_500();
    }
  }

  async deleteAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params;
      const result = await this.deleteAssignmentUseCase.execute({ id });

      if (!result.success) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200({ message: "Assignment deleted successfully" });
    } catch (error) {
      return this.httpErrors.error_500();
    }
  }

  async getSubmissions(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
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
    } catch (error) {
      return this.httpErrors.error_500();
    }
  }

  async getSubmissionById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { assignmentId, submissionId } = httpRequest.params;
      const result = await this.getSubmissionByIdUseCase.execute({
        assignmentId,
        submissionId
      });

      if (!result.success) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (error) {
      return this.httpErrors.error_500();
    }
  }

  async reviewSubmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
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
    } catch (error) {
      console.error('Controller: Error in reviewSubmission:', error);
      console.error('Controller: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return this.httpErrors.error_500();
    }
  }

  async downloadSubmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
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
        body: result.data,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': 'attachment'
        }
      };
    } catch (error) {
      return this.httpErrors.error_500();
    }
  }

  async getAnalytics(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {

      const result = await this.getAnalyticsUseCase.execute();

      if (!result.success) {
        return this.httpErrors.error_400();
      }

      return this.httpSuccess.success_200(result.data);
    } catch (error) {
      console.error('Analytics Error:', error);
      return this.httpErrors.error_500();
    }
  }
} 