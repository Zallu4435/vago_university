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

class ApplicationService {
  /**
   * Creates a new application with the given ID
   * @param applicationId The unique identifier for the application
   */
  async createApplication(applicationId: string): Promise<void> {
    try {
      await applicationController.createApplication(applicationId);
    } catch (error: any) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  /**
   * Retrieves complete application data by ID
   * @param applicationId The unique identifier for the application
   */
  async getApplicationById(applicationId: string): Promise<FormData | null> {
    try {
      return await applicationController.getApplicationById(applicationId);
    } catch (error: any) {
      console.error('Error fetching application data:', error);
      throw error;
    }
  }

  /**
   * Save personal information section
   * @param applicationId The application ID
   * @param data Personal information data
   */
  async savePersonalInfo(applicationId: string, data: PersonalInfo): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'personalInfo', data);
    } catch (error) {
      console.error('Error saving personal information:', error);
      throw error;
    }
  }

  /**
   * Save choice of study section
   * @param applicationId The application ID
   * @param data Program choices data
   */
  async saveChoiceOfStudy(applicationId: string, data: ProgrammeChoice[]): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'choiceOfStudy', data);
    } catch (error) {
      console.error('Error saving choice of study:', error);
      throw error;
    }
  }

  /**
   * Save education section
   * @param applicationId The application ID
   * @param data Education data
   */
  async saveEducation(applicationId: string, data: EducationData): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'education', data);
    } catch (error) {
      console.error('Error saving education data:', error);
      throw error;
    }
  }

  /**
   * Save achievements section
   * @param applicationId The application ID
   * @param data Achievements data
   */
  async saveAchievements(applicationId: string, data: AchievementSection): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'achievements', data);
    } catch (error) {
      console.error('Error saving achievements:', error);
      throw error;
    }
  }

  /**
   * Save other information section
   * @param applicationId The application ID
   * @param data Other information data
   */
  async saveOtherInfo(applicationId: string, data: OtherInformationSection): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'otherInformation', data);
    } catch (error) {
      console.error('Error saving other information:', error);
      throw error;
    }
  }

  /**
   * Save documents section
   * @param applicationId The application ID
   * @param data Document upload data
   */
  async saveDocuments(applicationId: string, data: DocumentUploadSection): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'documents', data);
    } catch (error) {
      console.error('Error saving documents:', error);
      throw error;
    }
  }

  /**
   * Save declaration section
   * @param applicationId The application ID
   * @param data Declaration data
   */
  async saveDeclaration(applicationId: string, data: DeclarationSection): Promise<FormData> {
    try {
      return await applicationController.saveSection(applicationId, 'declaration', data);
    } catch (error) {
      console.error('Error saving declaration:', error);
      throw error;
    }
  }

  /**
   * Submit the final application to get payment link
   * @param applicationId The ID of the application to submit
   */
  async submitApplication(applicationId: string): Promise<{ success: boolean; paymentUrl: string }> {
    try {
      return await applicationController.submitApplication(applicationId);
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }
  
  /**
   * Process payment for the application
   * @param applicationId The application ID
   * @param paymentDetails Payment information
   */
  async processPayment(applicationId: string, paymentDetails: any): Promise<{ success: boolean; applicationStatus: string }> {
    try {
      return await applicationController.processPayment(applicationId, paymentDetails);
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }
  
  /**
   * Check application status
   * @param applicationId The ID of the application
   */
  async getApplicationStatus(applicationId: string): Promise<string> {
    try {
      return await applicationController.getApplicationStatus(applicationId);
    } catch (error) {
      console.error('Error fetching application status:', error);
      throw error;
    }
  }
}

export const applicationService = new ApplicationService();