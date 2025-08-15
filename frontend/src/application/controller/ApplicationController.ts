import { FormData } from '../../domain/types/application';
import httpClient from '../../frameworks/api/httpClient';

interface ApplicationResponse {
  data: {
    draft: FormData | null;
  };
}

export const applicationController = {
  async createApplication(userId: string): Promise<{ applicationId: string }> {
    try {
      const response = await httpClient.post('/admission/applications', { userId });
      return response.data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },


  async getApplicationById(userId: string): Promise<ApplicationResponse> {
    try {
      const response = await httpClient.get(`/admission/applications/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching application for user ${userId}:`, error);
      throw error;
    }
  },


  async saveSection<T>(applicationId: string, section: string, data: T): Promise<FormData> {
    try {
      const response = await httpClient.post(`/admission/applications/${applicationId}/sections/${section}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error saving ${section} for application ${applicationId}:`, error);
      throw error;
    }
  },


  async submitApplication(applicationId: string, paymentId: string): Promise<{ message: string; admission }> {
    try {
      const response = await httpClient.post('/admission/finalize', { applicationId, paymentId });
      return response.data;
    } catch (error) {
      console.error(`Error submitting application ${applicationId}:`, error);
      throw error;
    }
  },


  async processPayment(
    applicationId: string,
    paymentDetails: {
      amount: number;
      currency: string;
      paymentMethod: string;
      customerEmail: string;
      customerName: string;
      customerPhone: string;
    }
  ): Promise<{ data: { paymentId: string; status: string; message: string; clientSecret?: string; stripePaymentIntentId?: string } }> {
    try {
      const response = await httpClient.post('/admission/payment/process', { applicationId, paymentDetails });
      return response.data;
    } catch (error) {
      console.error(`Error processing payment for application ${applicationId}:`, error);
      throw error;
    }
  },


  async getApplicationStatus(applicationId: string): Promise<string> {
    try {
      const response = await httpClient.get(`/admission/applications/${applicationId}/status`);
      return response.data.status;
    } catch (error) {
      console.error(`Error fetching status for application ${applicationId}:`, error);
      throw error;
    }
  },


  async confirmPayment(
    paymentId: string,
    stripePaymentIntentId: string
  ): Promise<{ data: { paymentId: string; status: string; message: string; stripePaymentIntentId: string } }> {
    try {
      const response = await httpClient.post('/admission/payment/confirm', { paymentId, stripePaymentIntentId });
      return response.data;
    } catch (error) {
      console.error(`Error confirming payment ${paymentId}:`, error);
      throw error;
    }
  },
};