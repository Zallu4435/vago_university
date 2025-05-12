import { 
  FormData, 
  PersonalInfo, 
  ProgrammeChoice, 
  EducationData, 
  AchievementSection,
  OtherInformationSection,
  DocumentUploadSection,
  DeclarationSection
} from '../../domain/types/formTypes';
import { applicationController } from '../controller/ApplicationController';

// Define payment result interface to match backend response
interface PaymentResult {
  paymentId: string;
  status: string;
  message?: string;
}

// Define submission result interface
interface SubmissionResult {
  message: string;
  admission: any;
}

class ApplicationService {
  async createApplication(applicationId: string): Promise<void> {
    try {
      await applicationController.createApplication(applicationId);
    } catch (error: any) {
      console.error('Error creating application:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to create application');
    }
  }

  async getApplicationById(applicationId: string): Promise<FormData | null> {
    try {
      return await applicationController.getApplicationById(applicationId);
    } catch (error: any) {
      console.error('Error fetching application data:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch application data');
    }
  }

  async savePersonalInfo(applicationId: string, data: PersonalInfo): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'personalInfo', data);
    } catch (error: any) {
      console.error('Error saving personal information:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to save personal information');
    }
  }

  async saveChoiceOfStudy(applicationId: string, data: ProgrammeChoice[]): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'choiceOfStudy', data);
    } catch (error: any) {
      console.error('Error saving choice of study:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to save choice of study');
    }
  }

  async saveEducation(applicationId: string, data: EducationData): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'education', data);
    } catch (error: any) {
      console.error('Error saving education data:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to save education data');
    }
  }

  async saveAchievements(applicationId: string, data: AchievementSection): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'achievements', data);
    } catch (error: any) {
      console.error('Error saving achievements:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to save achievements');
    }
  }

  async saveOtherInfo(applicationId: string, data: OtherInformationSection): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'otherInformation', data);
    } catch (error: any) {
      console.error('Error saving other information:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to save other information');
    }
  }

  async saveDocuments(applicationId: string, data: DocumentUploadSection): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'documents', data);
    } catch (error: any) {
      console.error('Error saving documents:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to save documents');
    }
  }

  async saveDeclaration(applicationId: string, data: DeclarationSection): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'declaration', data);
    } catch (error: any) {
      console.error('Error saving declaration:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to save declaration');
    }
  }

  async processPayment(applicationId: string, paymentDetails: any): Promise<PaymentResult> {
    try {
      const result = await applicationController.processPayment(applicationId, paymentDetails);
      if (!result.paymentId || !result.status) {
        throw new Error(result.message || 'Invalid payment response');
      }
      return {
        paymentId: result.paymentId,
        status: result.status,
        message: result.message
      };
    } catch (error: any) {
      console.error('Error processing payment:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to process payment');
    }
  }

  async submitApplication(applicationId: string, paymentId: string): Promise<SubmissionResult> {
    try {
      const result = await applicationController.submitApplication(applicationId, paymentId);
      return {
        message: result.message || 'Application submitted successfully',
        admission: result.admission
      };
    } catch (error: any) {
      console.error('Error submitting application:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to submit application');
    }
  }

  async getApplicationStatus(applicationId: string): Promise<string> {
    try {
      return await applicationController.getApplicationStatus(applicationId);
    } catch (error: any) {
      console.error('Error fetching application status:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch application status');
    }
  }
}

export const applicationService = new ApplicationService();