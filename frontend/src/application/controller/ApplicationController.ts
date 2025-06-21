import httpClient from '../../frameworks/api/httpClient';
import { FormData } from '../../domain/types/formTypes';

export const applicationController = {
  /**
   * Creates a new application for the given user
   * @param userId The user ID from the token
   * @param token JWT token for authentication
   */
  async createApplication(userId: string, token: string): Promise<{ applicationId: string }> {
    try {
      const response = await httpClient.post('/admission/applications', { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  /**
   * Retrieves complete application data by user ID
   * @param userId The user ID from the token
   * @param token JWT token for authentication
   */
  async getApplicationById(userId: string, token: string): Promise<FormData | null> {
    try {
      const response = await httpClient.get(`/admission/applications/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching application for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Saves a specific section of the application
   * @param applicationId The application ID
   * @param section The section to save (e.g., personalInfo, choiceOfStudy)
   * @param data The data for the section
   * @param token JWT token for authentication
   */
  async saveSection<T>(applicationId: string, section: string, data: T, token: string): Promise<FormData> {
    try {
      const response = await httpClient.post(`/admission/applications/${applicationId}/sections/${section}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error saving ${section} for application ${applicationId}:`, error);
      throw error;
    }
  },

  /**
   * Submits the application after payment
   * @param applicationId The application ID
   * @param paymentId The payment ID from the payment process
   * @param token JWT token for authentication
   */
  async submitApplication(applicationId: string, paymentId: string, token: string): Promise<{ message: string; admission: any }> {
    try {
      const response = await httpClient.post('/admission/finalize', { applicationId, paymentId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
   * @param token JWT token for authentication
   */
  async processPayment(
    applicationId: string,
    paymentDetails: any,
    token: string
  ): Promise<{ paymentId: string; status: string; message: string; clientSecret?: string; stripePaymentIntentId?: string }> {
    try {
      const response = await httpClient.post('/admission/payment/process', { applicationId, paymentDetails }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error processing payment for application ${applicationId}:`, error);
      throw error;
    }
  },

  /**
   * Retrieves the application status
   * @param applicationId The application ID
   * @param token JWT token for authentication
   */
  async getApplicationStatus(applicationId: string, token: string): Promise<string> {
    try {
      const response = await httpClient.get(`/admission/applications/${applicationId}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.status;
    } catch (error: any) {
      console.error(`Error fetching status for application ${applicationId}:`, error);
      throw error;
    }
  },

  /**
   * Confirms payment after Stripe processing
   * @param paymentId The payment ID
   * @param stripePaymentIntentId The Stripe payment intent ID
   * @param token JWT token for authentication
   */
  async confirmPayment(
    paymentId: string,
    stripePaymentIntentId: string,
    token: string
  ): Promise<{ paymentId: string; status: string; message: string; stripePaymentIntentId: string }> {
    try {
      const response = await httpClient.post('/admission/payment/confirm', { paymentId, stripePaymentIntentId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error confirming payment ${paymentId}:`, error);
      throw error;
    }
  },
};