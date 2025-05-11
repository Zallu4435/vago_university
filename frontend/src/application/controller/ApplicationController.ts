import httpClient from '../../frameworks/api/httpClient';
import { FormData } from '../../domain/types/formTypes';

export const applicationController = {
  /**
   * Creates a new application with the given ID
   * @param applicationId The unique identifier for the application
   */
  async createApplication(applicationId: string): Promise<void> {
    try {
      await httpClient.post('/applications', { applicationId });
    } catch (error: any) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  /**
   * Retrieves complete application data by ID
   * @param applicationId The unique identifier for the application
   */
  async getApplicationById(applicationId: string): Promise<FormData | null> {
    try {
      const response = await httpClient.get(`/applications/${applicationId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching application ${applicationId}:`, error);
      throw error;
    }
  },

  /**
   * Saves a specific section of the application
   * @param applicationId The application ID
   * @param section The section to save (e.g., personalInfo, choiceOfStudy)
   * @param data The data for the section
   */
  async saveSection<T>(applicationId: string, section: string, data: T): Promise<FormData> {
    try {
      const response = await httpClient.post(`/applications/${applicationId}/sections/${section}`, data);
      return response.data;
    } catch (error: any) {
      console.error(`Error saving ${section} for application ${applicationId}:`, error);
      throw error;
    }
  },

  /**
   * Submits the application for payment
   * @param applicationId The application ID
   */
  async submitApplication(applicationId: string): Promise<{ success: boolean; paymentUrl: string }> {
    try {
      const response = await httpClient.post(`/applications/${applicationId}/submit`);
      return response.data;
    } catch (error: any) {
      console.error(`Error submitting application ${applicationId}:`, error);
      throw error;
    }
  },

  /**
   * Processes payment for the application
   * @param applicationId The application ID
   * @param paymentDetails Payment information
   */
  async processPayment(applicationId: string, paymentDetails: any): Promise<{ success: boolean; applicationStatus: string }> {
    try {
      const response = await httpClient.post(`/applications/${applicationId}/payment`, paymentDetails);
      return response.data;
    } catch (error: any) {
      console.error(`Error processing payment for application ${applicationId}:`, error);
      throw error;
    }
  },

  /**
   * Retrieves the application status
   * @param applicationId The application ID
   */
  async getApplicationStatus(applicationId: string): Promise<string> {
    try {
      const response = await httpClient.get(`/applications/${applicationId}/status`);
      return response.data.status;
    } catch (error: any) {
      console.error(`Error fetching status for application ${applicationId}:`, error);
      throw error;
    }
  }
};