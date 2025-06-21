import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IAdminAdmissionController } from "../IHttp";
import {
  GetAdmissionsUseCase,
  GetAdmissionByIdUseCase,
  ApproveAdmissionUseCase,
  RejectAdmissionUseCase,
  DeleteAdmissionUseCase,
  ConfirmAdmissionOfferUseCase,
} from "../../../application/admin/useCases/AdmissionUseCases";
import { Admission } from "../../../infrastructure/database/mongoose/models/admission.model";
import { v2 as cloudinary } from 'cloudinary';

export class AdminAdmissionController implements IAdminAdmissionController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getAdmissionsUseCase: GetAdmissionsUseCase,
    private getAdmissionByIdUseCase: GetAdmissionByIdUseCase,
    private approveAdmissionUseCase: ApproveAdmissionUseCase,
    private rejectAdmissionUseCase: RejectAdmissionUseCase,
    private deleteAdmissionUseCase: DeleteAdmissionUseCase,
    private confirmAdmissionOfferUseCase: ConfirmAdmissionOfferUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getAdmissions(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { page = 1, limit = 5, status = "all", program = "all", dateRange = "all", startDate, endDate } = httpRequest.query || {};
      const response = await this.getAdmissionsUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
        program: String(program),
        dateRange: String(dateRange),
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getAdmissionById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.getAdmissionByIdUseCase.execute({ id });
      if (!response.success) {
        return this.httpErrors.error_404();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async approveAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      const { programDetails, startDate, scholarshipInfo, additionalNotes } = httpRequest.body || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.approveAdmissionUseCase.execute({
        id,
        additionalInfo: { programDetails, startDate, scholarshipInfo, additionalNotes },
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async rejectAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.rejectAdmissionUseCase.execute({ id });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async deleteAdmission(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params || {};
      if (!id) {
        return this.httpErrors.error_400();
      }
      const response = await this.deleteAdmissionUseCase.execute({ id });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async confirmAdmissionOffer(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id, action } = httpRequest.params || {};
      const { token } = httpRequest.query || {};
      if (!id || !action || !token || typeof token !== "string") {
        return this.httpErrors.error_400();
      }
      if (action !== "accept" && action !== "reject") {
        return this.httpErrors.error_400();
      }
      const response = await this.confirmAdmissionOfferUseCase.execute({
        admissionId: id,
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

  async serveDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('=== ADMIN SERVE DOCUMENT CONTROLLER START ===');
      console.log('Request params:', httpRequest.params);
      console.log('Request user:', httpRequest.user);
      
      if (!httpRequest.user) {
        console.log('ERROR: No user found in request');
        return this.httpErrors.error_401();
      }
      
      // Check if user is admin
      if (httpRequest.user.collection !== 'admin') {
        console.log('ERROR: User is not admin');
        return this.httpErrors.error_403();
      }
      
      const { documentId } = httpRequest.params || {};
      const { admissionId } = httpRequest.query || {};
      
      console.log('Extracted data:', { documentId, admissionId });
      
      if (!documentId) {
        console.log('ERROR: Missing documentId');
        return this.httpErrors.error_400();
      }
      
      if (!admissionId) {
        console.log('ERROR: Missing admissionId');
        return this.httpErrors.error_400();
      }
      
      // Find the specific admission and document within it
      console.log('Looking for document with ID:', documentId, 'in admission:', admissionId);
      
      const admission = await Admission.findOne({ 
        _id: admissionId,
        "documents.documents": { $elemMatch: { id: documentId } }
      });
      
      console.log('Found admission:', admission?.documents?.documents);
      
      if (!admission) {
        console.log('ERROR: Document not found');
        return this.httpErrors.error_404();
      }
      
      // Find the specific document
      const document = admission.documents?.documents?.find((doc: any) => doc.id === documentId);
      console.log('Found document:', document ? 'Yes' : 'No');
      console.log('Document structure:', document);
      console.log('Document cloudinaryUrl:', document?.cloudinaryUrl);
      console.log('Document url:', document?.url);
      console.log('Document path:', document?.path);
      console.log('All document fields:', document ? Object.keys(document) : 'No document found');
      
      if (!document) {
        console.log('ERROR: Document not found');
        return this.httpErrors.error_404();
      }
      
      // Try to get the URL from different possible field names
      const documentUrl = document.cloudinaryUrl || document.url || document.path;
      console.log('Using document URL:', documentUrl);
      
      if (!documentUrl) {
        console.log('ERROR: No URL found in document');
        return this.httpErrors.error_404();
      }
      
      // Fetch the PDF from Cloudinary
      console.log('Fetching PDF from Cloudinary URL:', documentUrl);
      
      const response = await fetch(documentUrl);
      
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
          fileName: document.fileName,
          contentType: 'application/pdf'
        }
      };
      
      console.log('=== ADMIN SERVE DOCUMENT CONTROLLER SUCCESS ===');
      return result_response;
    } catch (error: any) {
      console.log('=== ADMIN SERVE DOCUMENT CONTROLLER ERROR ===');
      console.error('Controller error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return this.httpErrors.error_500();
    }
  }
}