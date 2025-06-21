import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IAdmissionController } from "../IHttp";
import {
  CreateApplicationUseCase,
  GetApplicationUseCase,
  SaveSectionUseCase,
  ProcessPaymentUseCase,
  ConfirmPaymentUseCase,
  FinalizeAdmissionUseCase,
  UploadDocumentUseCase,
  UploadMultipleDocumentsUseCase,
} from "../../../application/admission/useCases/AdmissionUseCases";
import { AdmissionDraft as AdmissionDraftModel } from "../../../infrastructure/database/mongoose/admission/AdmissionDraftModel";
import mongoose from "mongoose";

export class AdmissionController implements IAdmissionController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private createApplicationUseCase: CreateApplicationUseCase,
    private getApplicationUseCase: GetApplicationUseCase,
    private saveSectionUseCase: SaveSectionUseCase,
    private processPaymentUseCase: ProcessPaymentUseCase,
    private confirmPaymentUseCase: ConfirmPaymentUseCase,
    private finalizeAdmissionUseCase: FinalizeAdmissionUseCase,
    private uploadDocumentUseCase: UploadDocumentUseCase,
    private uploadMultipleDocumentsUseCase: UploadMultipleDocumentsUseCase,
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async createApplication(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { userId } = httpRequest.body || {};
      if (!userId || userId !== registerId) {
        return this.httpErrors.error_400();
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return this.httpErrors.error_400();
      }
      const response = await this.createApplicationUseCase.execute({ userId });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_201(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async getApplication(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { userId } = httpRequest.params || {};
      if (userId !== registerId) {
        return this.httpErrors.error_403();
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return this.httpErrors.error_400();
      }
      const response = await this.getApplicationUseCase.execute({ userId });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async saveSection(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { applicationId, section } = httpRequest.params || {};
      const data = httpRequest.body;
      const draft = await AdmissionDraftModel.findOne({ applicationId, registerId });
      if (!draft) {
        return this.httpErrors.error_403();
      }
      const response = await this.saveSectionUseCase.execute({ applicationId, section, data });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async processPayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { applicationId, paymentDetails } = httpRequest.body || {};
      const draft = await AdmissionDraftModel.findOne({ applicationId, registerId });
      if (!draft) {
        return this.httpErrors.error_403();
      }
      const response = await this.processPaymentUseCase.execute({ applicationId, paymentDetails });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async confirmPayment(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('=== CONFIRM PAYMENT CONTROLLER START ===');
      console.log('Request body:', httpRequest.body);
      console.log('Request user:', httpRequest.user);
      
      if (!httpRequest.user) {
        console.log('ERROR: No user found in request');
        return this.httpErrors.error_401();
      }
      
      const { id: registerId } = httpRequest.user;
      const { paymentId, stripePaymentIntentId } = httpRequest.body || {};
      
      console.log('Extracted data:', { registerId, paymentId, stripePaymentIntentId });
      
      if (!paymentId || !stripePaymentIntentId) {
        console.log('ERROR: Missing paymentId or stripePaymentIntentId');
        console.log('paymentId:', paymentId);
        console.log('stripePaymentIntentId:', stripePaymentIntentId);
        return this.httpErrors.error_400();
      }
      
      // Validate that the payment belongs to the current user
      const { PaymentModel } = await import("../../../infrastructure/database/mongoose/models/financial.model");
      console.log('Looking for payment with ID:', paymentId);
      const payment = await PaymentModel.findById(paymentId);
      
      if (!payment) {
        console.log('ERROR: Payment not found with ID:', paymentId);
        return this.httpErrors.error_404();
      }
      
      console.log('Found payment:', {
        id: payment._id,
        studentId: payment.studentId,
        registerId: registerId,
        status: payment.status,
        metadata: payment.metadata
      });
      
      // Check if the payment belongs to the current user
      if (!payment.studentId.equals(registerId)) {
        console.log('ERROR: Payment does not belong to current user');
        console.log('Payment studentId:', payment.studentId);
        console.log('Current registerId:', registerId);
        return this.httpErrors.error_403();
      }
      
      console.log('Payment validation passed, calling use case...');
      const response = await this.confirmPaymentUseCase.execute({ paymentId, stripePaymentIntentId });
      console.log('Use case response:', response);
      
      if (!response.success) {
        console.log('ERROR: Use case failed:', response.data);
        return this.httpErrors.error_400();
      }
      
      console.log('=== CONFIRM PAYMENT CONTROLLER SUCCESS ===');
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      console.log('=== CONFIRM PAYMENT CONTROLLER ERROR ===');
      console.error('Controller error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return this.httpErrors.error_500();
    }
  }

  async handleFinalSubmit(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { applicationId, paymentId } = httpRequest.body || {};
      const draft = await AdmissionDraftModel.findOne({ applicationId, registerId });
      if (!draft) {
        return this.httpErrors.error_403();
      }
      const response = await this.finalizeAdmissionUseCase.execute({ applicationId, paymentId });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200({ message: "Admission finalized", admission: response.data });
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async uploadDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('=== UPLOAD DOCUMENT CONTROLLER START ===');
      console.log('Request body:', httpRequest.body);
      console.log('Request file:', httpRequest.file);
      console.log('Request user:', httpRequest.user);
      
      if (!httpRequest.user) {
        console.log('ERROR: No user found in request');
        return this.httpErrors.error_401();
      }
      
      const { id: registerId } = httpRequest.user;
      const { applicationId, documentType } = httpRequest.body || {};
      const file = httpRequest.file;
      
      console.log('Extracted data:', { registerId, applicationId, documentType });
      
      if (!file) {
        console.log('ERROR: No file found in request');
        return this.httpErrors.error_400();
      }

      if (!applicationId) {
        console.log('ERROR: No applicationId found in request body');
        return this.httpErrors.error_400();
      }

      if (!documentType) {
        console.log('ERROR: No documentType found in request body');
        return this.httpErrors.error_400();
      }

      // Validate that the application belongs to the current user
      console.log('Looking for draft with applicationId:', applicationId, 'and registerId:', registerId);
      const draft = await AdmissionDraftModel.findOne({ applicationId, registerId });
      
      if (!draft) {
        console.log('ERROR: No draft found for applicationId:', applicationId, 'and registerId:', registerId);
        console.log('This means either:');
        console.log('1. The applicationId is incorrect');
        console.log('2. The application does not belong to this user');
        console.log('3. The application has not been created yet');
        return this.httpErrors.error_403();
      }
      
      console.log('Draft found:', { 
        applicationId: draft.applicationId, 
        registerId: draft.registerId,
        status: draft.status 
      });

      console.log('Calling uploadDocumentUseCase...');
      const response = await this.uploadDocumentUseCase.execute({ applicationId, documentType, file });
      console.log('Use case response:', response);
      
      if (!response.success) {
        console.log('ERROR: Use case failed:', response.data);
        return this.httpErrors.error_400();
      }
      
      console.log('=== UPLOAD DOCUMENT CONTROLLER SUCCESS ===');
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      console.log('=== UPLOAD DOCUMENT CONTROLLER ERROR ===');
      console.error('Controller error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return this.httpErrors.error_500();
    }
  }

  async uploadMultipleDocuments(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user) {
        return this.httpErrors.error_401();
      }
      const { id: registerId } = httpRequest.user;
      const { applicationId } = httpRequest.body || {};
      const files = httpRequest.files || [];
      
      if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
        return this.httpErrors.error_400();
      }
      
      if (!files || files.length === 0) {
        return this.httpErrors.error_400();
      }
      
      // Validate that the application belongs to the current user
      const draft = await AdmissionDraftModel.findOne({ applicationId, registerId });
      if (!draft) {
        return this.httpErrors.error_403();
      }
      
      const response = await this.uploadMultipleDocumentsUseCase.execute({ 
        applicationId, 
        files: files as Express.Multer.File[] 
      });
      
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      console.error('Upload multiple documents error:', error);
      return this.httpErrors.error_500();
    }
  }

  async serveDocument(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('=== SERVE DOCUMENT CONTROLLER START ===');
      console.log('Request params:', httpRequest.params);
      console.log('Request user:', httpRequest.user);
      
      if (!httpRequest.user) {
        console.log('ERROR: No user found in request');
        return this.httpErrors.error_401();
      }
      
      const { id: registerId } = httpRequest.user;
      const { documentId } = httpRequest.params || {};
      
      console.log('Extracted data:', { registerId, documentId });
      
      if (!documentId) {
        console.log('ERROR: Missing documentId');
        return this.httpErrors.error_400();
      }
      
      // Get the document from the database to verify ownership
      console.log('Looking for draft with registerId:', registerId, 'and documentId:', documentId);
      
      const draft = await AdmissionDraftModel.findOne({ 
        registerId,
        "documents.documents": { $elemMatch: { id: documentId } }
      });
      
      console.log('Found draft:', draft ? 'Yes' : 'No');
      
      if (!draft) {
        console.log('ERROR: Draft not found or document not owned by user');
        return this.httpErrors.error_403();
      }
      
      // Find the specific document
      const document = draft.documents?.documents?.find(doc => doc.id === documentId);
      console.log('Found document:', document ? 'Yes' : 'No');
      console.log('Document cloudinaryUrl:', document?.cloudinaryUrl);
      
      if (!document || !document.cloudinaryUrl) {
        console.log('ERROR: Document not found or no cloudinary URL');
        return this.httpErrors.error_404();
      }
      
      // Fetch the PDF from Cloudinary
      console.log('Fetching PDF from Cloudinary URL:', document.cloudinaryUrl);
      const response = await fetch(document.cloudinaryUrl);
      
      if (!response.ok) {
        console.log('ERROR: Failed to fetch from Cloudinary, status:', response.status);
        return this.httpErrors.error_404();
      }
      
      const pdfBuffer = await response.arrayBuffer();
      console.log('PDF buffer size:', pdfBuffer.byteLength);
      
      // Return the PDF with proper headers
      const result = {
        statusCode: 200,
        body: {
          pdfData: Buffer.from(pdfBuffer).toString('base64'),
          fileName: document.fileName,
          contentType: 'application/pdf'
        }
      };
      
      console.log('=== SERVE DOCUMENT CONTROLLER SUCCESS ===');
      return result;
    } catch (error: any) {
      console.log('=== SERVE DOCUMENT CONTROLLER ERROR ===');
      console.error('Controller error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return this.httpErrors.error_500();
    }
  }
}