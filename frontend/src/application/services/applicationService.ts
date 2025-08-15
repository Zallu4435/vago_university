import { 
  FormData, 
  PersonalInfo, 
  ProgrammeChoice, 
  EducationData, 
  AchievementSection,
  OtherInformationSection,
  DocumentUploadSection,
  DeclarationSection,
  PaymentResult,
  SubmissionResult
} from '../../domain/types/application';
import { applicationController } from '../controller/ApplicationController';
import { isAxiosErrorWithApiError } from '../../shared/types/apiError';

class ApplicationService {
  async createApplication(userId: string): Promise<{ applicationId: string }> {
    try {
      return await applicationController.createApplication(userId);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create application');
      }
      throw new Error('Failed to create application');
    }
  }

  async getApplicationById(userId: string): Promise<FormData | null> {
    try {
      const response = await applicationController.getApplicationById(userId);
      console.log(response, "popopopo")
      return response?.data?.draft
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch application data');
      }
      throw new Error('Failed to fetch application data');
    }
  }

  async savePersonalInfo(applicationId: string, data: PersonalInfo): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'personalInfo', data);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to save personal information');
      }
      throw new Error('Failed to save personal information');
    }
  }

  async saveChoiceOfStudy(applicationId: string, data: ProgrammeChoice[]): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'choiceOfStudy', data);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to save choice of study');
      }
      throw new Error('Failed to save choice of study');
    }
  }

  async saveEducation(applicationId: string, data: EducationData): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'education', data);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to save education data');
      }
      throw new Error('Failed to save education data');
    }
  }

  async saveAchievements(applicationId: string, data: AchievementSection): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'achievements', data);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to save achievements');
      }
      throw new Error('Failed to save achievements');
    }
  }

  async saveOtherInfo(applicationId: string, data: OtherInformationSection): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'otherInformation', data);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to save other information');
      }
      throw new Error('Failed to save other information');
    }
  }

  async saveDocuments(applicationId: string, data: DocumentUploadSection): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'documents', data);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to save documents');
      }
      throw new Error('Failed to save documents');
    }
  }

  async saveDeclaration(applicationId: string, data: DeclarationSection): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'declaration', data);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to save declaration');
      }
      throw new Error('Failed to save declaration');
    }
  }

  async processPayment(applicationId: string, paymentDetails: {
    amount: number;
    currency: string;
    paymentMethod: string;
    customerEmail: string;
    customerName: string;
    customerPhone: string;
  }): Promise<PaymentResult> {
    try {
      const result = await applicationController.processPayment(applicationId, paymentDetails);
      if (!result.data?.paymentId || !result.data?.status) {
        throw new Error(result.data?.message || 'Invalid payment response');
      }
      return {
        paymentId: result.data?.paymentId,
        status: result.data?.status,
        message: result.data?.message,
        clientSecret: result.data?.clientSecret,
        stripePaymentIntentId: result.data?.stripePaymentIntentId,
      };
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to process payment');
      }
      throw new Error('Failed to process payment');
    }
  }

  async confirmPayment(paymentId: string, stripePaymentIntentId: string): Promise<PaymentResult> {
    try {
      const result = await applicationController.confirmPayment(paymentId, stripePaymentIntentId);
      if (!result.data?.paymentId || !result.data?.status) {
        throw new Error(result.data?.message || 'Invalid payment confirmation response');
      }
      return {
        paymentId: result.data?.paymentId,
        status: result.data?.status,
        message: result.data?.message
      };
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to confirm payment');
      }
      throw new Error('Failed to confirm payment');
    }
  }

  async submitApplication(applicationId: string, paymentId: string): Promise<SubmissionResult> {
    try {
      const result = await applicationController.submitApplication(applicationId, paymentId);
      return {
        message: result.message || 'Application submitted successfully',
        admission: result.admission
      };
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to submit application');
      }
      throw new Error('Failed to submit application');
    }
  }

  async getApplicationStatus(applicationId: string): Promise<string> {
    try {
      return await applicationController.getApplicationStatus(applicationId);
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch application status');
      }
      throw new Error('Failed to fetch application status');
    }
  }
}

export const applicationService = new ApplicationService(); 