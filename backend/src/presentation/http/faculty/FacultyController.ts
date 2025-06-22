import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IFacultyController } from "../IHttp";
import { v2 as cloudinary } from 'cloudinary';
import {
  GetFacultyUseCase,
  GetFacultyByIdUseCase,
  GetFacultyByTokenUseCase,
  ApproveFacultyUseCase,
  RejectFacultyUseCase,
  DeleteFacultyUseCase,
  ConfirmFacultyOfferUseCase,
  DownloadCertificateUseCase,
} from "../../../application/faculty/useCases/FacultyUseCases";

export class FacultyController implements IFacultyController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getFacultyUseCase: GetFacultyUseCase,
    private getFacultyByIdUseCase: GetFacultyByIdUseCase,
    private getFacultyByTokenUseCase: GetFacultyByTokenUseCase,
    private approveFacultyUseCase: ApproveFacultyUseCase,
    private rejectFacultyUseCase: RejectFacultyUseCase,
    private deleteFacultyUseCase: DeleteFacultyUseCase,
    private confirmFacultyOfferUseCase: ConfirmFacultyOfferUseCase,
    private downloadCertificateUseCase: DownloadCertificateUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = "1", limit = "5", status = "all", department = "all_departments", dateRange = "all" } = httpRequest.query || {};
      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
        return this.httpErrors.error_400();
      }
      const response = await this.getFacultyUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
        department: String(department),
        dateRange: String(dateRange),
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getFacultyById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.getFacultyByIdUseCase.execute({ id });
      if (!response.success) {
        return this.httpErrors.error_404();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getFacultyByToken(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      const { token } = httpRequest.query || {};
      if (!id || !token || typeof token !== "string") {
        return this.httpErrors.error_400();
      }
      const response = await this.getFacultyByTokenUseCase.execute({
        facultyId: id,
        token,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async approveFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      const { department, position, startDate, salary, benefits, additionalNotes } = httpRequest.body || {};
      if (!id || !department || !startDate) {
        return this.httpErrors.error_400();
      }
      const response = await this.approveFacultyUseCase.execute({
        id,
        additionalInfo: { department, position, startDate, salary, benefits, additionalNotes },
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async rejectFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.rejectFacultyUseCase.execute({ id });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async deleteFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.deleteFacultyUseCase.execute({ id });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async confirmFacultyOffer(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id, action } = httpRequest.params || {};
      const { token } = httpRequest.query || {};
      if (!id || !action || !token || typeof token !== "string") {
        return this.httpErrors.error_400();
      }
      if (action !== "accept" && action !== "reject") {
        return this.httpErrors.error_400();
      }
      const response = await this.confirmFacultyOfferUseCase.execute({
        facultyId: id,
        token,
        action: action as "accept" | "reject",
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async downloadCertificate(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { facultyId } = httpRequest.params || {};
      const { url, type } = httpRequest.query || {};
      const requestingUserId = httpRequest.user?.id;
      if (!facultyId || !url || typeof url !== "string" || !type || !requestingUserId) {
        return this.httpErrors.error_400();
      }
      const response = await this.downloadCertificateUseCase.execute({
        facultyId,
        certificateUrl: url as string,
        requestingUserId,
        type: String(type),
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async serveDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('=== FACULTY SERVE DOCUMENT CONTROLLER START ===');
      console.log('Request params:', httpRequest.params);
      console.log('Request user:', httpRequest.user);
      
      if (!httpRequest.user) {
        console.log('ERROR: No user found in request');
        return this.httpErrors.error_401();
      }
      
      const { facultyId } = httpRequest.params || {};
      const { type, documentUrl } = httpRequest.query || {};
      
      console.log('Faculty ID:', facultyId);
      console.log('Document type:', type);
      console.log('Document URL:', documentUrl);
      
      if (!facultyId || !type || !documentUrl) {
        console.log('ERROR: Missing required parameters');
        return this.httpErrors.error_400();
      }
      
      // Extract public ID from the Cloudinary URL
      const urlParts = (documentUrl as string).split('/');
      const publicId = urlParts.slice(-2).join('/').replace(/\.[^/.]+$/, ''); // Remove file extension
      console.log('Extracted public ID:', publicId);
      
      // Get the document stream from Cloudinary using signed URL
      const signedUrl = cloudinary.url(publicId, {
        resource_type: 'raw',
        type: 'upload',
        sign_url: true,
        secure: true
      });
      
      console.log('Using signed URL:', signedUrl);
      
      const response = await fetch(signedUrl);
      
      if (!response.ok) {
        console.log('ERROR: Failed to fetch from Cloudinary, status:', response.status);
        return this.httpErrors.error_404();
      }
      
      const pdfBuffer = await response.arrayBuffer();
      console.log('PDF buffer size:', pdfBuffer.byteLength);
      
      // Return the PDF with proper headers
      const result_response = {
        statusCode: 200,
        body: {
          pdfData: Buffer.from(pdfBuffer).toString('base64'),
          fileName: `${type}_${facultyId}.pdf`,
          contentType: 'application/pdf'
        }
      };
      
      console.log('=== FACULTY SERVE DOCUMENT SUCCESS ===');
      return result_response;
    } catch (error: any) {
      console.log('=== FACULTY SERVE DOCUMENT ERROR ===');
      console.error('Controller error:', error);
      return this.httpErrors.error_500();
    }
  }
}