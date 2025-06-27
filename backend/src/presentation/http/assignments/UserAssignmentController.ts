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
    
    try {
      const { subject, status, page, limit, search, sortBy } = httpRequest.query;
      
      const result = await this.getUserAssignmentsUseCase.execute({
        subject: subject as string,
        status: status as any,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        sortBy: sortBy as string,
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

  async downloadAssignmentFile(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { fileUrl, fileName } = httpRequest.query;
      
      if (!fileUrl || typeof fileUrl !== 'string') {
        return this.httpErrors.error_400();
      }

      if (!fileName || typeof fileName !== 'string') {
        return this.httpErrors.error_400();
      }

      // Check if it's a Cloudinary URL
      if (fileUrl.includes('cloudinary.com')) {
        // Extract public ID from URL
        const publicId = fileUrl
          .replace(/^https:\/\/res\.cloudinary\.com\/vago-university\/[^\/]+\/upload\/v[0-9]+\//, '')
          .replace(/\.[^/.]+$/, ''); // Remove file extension

        // Generate signed URL
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
        // For non-Cloudinary URLs, return as is
        return this.httpSuccess.success_200({
          downloadUrl: fileUrl,
          fileName: fileName
        });
      }
    } catch (error) {
      console.error('Controller: downloadAssignmentFile error:', error);
      return this.httpErrors.error_500();
    }
  }

  async submitAssignment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    console.log('=== ASSIGNMENT SUBMIT/RESUBMIT STARTED ===');
    console.log('Controller: Request params:', httpRequest.params);
    console.log('Controller: Request user:', httpRequest.user);
    console.log('Controller: File info:', httpRequest.file ? {
      originalname: httpRequest.file.originalname,
      size: httpRequest.file.size,
      mimetype: httpRequest.file.mimetype,
      path: httpRequest.file.path
    } : 'No file');
    
    try {
      const { id } = httpRequest.params;
      const file = httpRequest.file;
      
      console.log('Controller: Assignment ID:', id);
      console.log('Controller: Student ID:', httpRequest.user?.id);
      
      if (!file) {
        console.error('Controller: No file provided in request');
        return this.httpErrors.error_400();
      }

      console.log('Controller: Calling use case with params:', {
        assignmentId: id,
        file: {
          originalname: file.originalname,
          size: file.size,
          mimetype: file.mimetype
        },
        studentId: httpRequest.user?.id
      });

      const result = await this.submitUserAssignmentUseCase.execute({
        assignmentId: id,
        file: file,
        studentId: httpRequest.user?.id
      });

      console.log('Controller: Use case result:', {
        success: result.success,
        data: result.data
      });

      if (!result.success) {
        console.error('Controller: Use case returned failure:', result.data);
        return this.httpErrors.error_400();
      }

      console.log('Controller: Submission successful, returning 201');
      console.log('=== ASSIGNMENT SUBMIT/RESUBMIT COMPLETED ===');
      return this.httpSuccess.success_201(result.data);
    } catch (error) {
      console.error('Controller: submitAssignment error:', error);
      console.error('Controller: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.log('=== ASSIGNMENT SUBMIT/RESUBMIT FAILED ===');
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