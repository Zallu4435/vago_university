import { 
    StudentFinancialInfo, 
    Charge, 
    Payment, 
    FinancialAidApplication, 
    Scholarship, 
    ScholarshipApplication,
    PaymentForm 
  } from '../../domain/types/financial';
  import httpClient from '../../frameworks/api/httpClient';
  
  export class FinancialService {
    private static instance: FinancialService;
    private readonly baseUrl = '/financial';
    private readonly adminBaseUrl = '/financial/admin';
  
    private constructor() {}
  
    public static getInstance(): FinancialService {
      if (!FinancialService.instance) {
        FinancialService.instance = new FinancialService();
      }
      return FinancialService.instance;
    }
  
    async getStudentFinancialInfo(): Promise<StudentFinancialInfo> {
      try {
        const response = await httpClient.get(`${this.baseUrl}/student-info`);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to fetch student financial info');
      }
    }
  
    async getCurrentCharges(): Promise<Charge[]> {
      try {
        const response = await httpClient.get(`${this.baseUrl}/charges`);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to fetch current charges');
      }
    }
  
    async getPaymentHistory(): Promise<Payment[]> {
      try {
        const response = await httpClient.get(`${this.baseUrl}/payments`);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to fetch payment history');
      }
    }
  
    async getAllPayments(): Promise<Payment[]> {
      try {
        const response = await httpClient.get(`${this.adminBaseUrl}/payments`);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to fetch all payments');
      }
    }
  
    async makePayment(payment: PaymentForm): Promise<Payment> {
      try {
        const response = await httpClient.post(`${this.baseUrl}/payments`, payment);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to process payment');
      }
    }
  
    async getFinancialAidApplications(): Promise<FinancialAidApplication[]> {
      try {
        const response = await httpClient.get(`${this.baseUrl}/financial-aid`);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to fetch financial aid applications');
      }
    }
  
    async getAllFinancialAidApplications(): Promise<FinancialAidApplication[]> {
      try {
        const response = await httpClient.get(`${this.adminBaseUrl}/financial-aid`);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to fetch all financial aid applications');
      }
    }
  
    async applyForFinancialAid(application: Omit<FinancialAidApplication, 'id' | 'status' | 'applicationDate'>): Promise<FinancialAidApplication> {
      try {
        const response = await httpClient.post(`${this.baseUrl}/financial-aid`, application);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to submit financial aid application');
      }
    }
  
    async updateFinancialAidApplication(id: string, data: { status: 'Approved' | 'Rejected'; amount?: number }): Promise<FinancialAidApplication> {
      try {
        const response = await httpClient.patch(`${this.baseUrl}/financial-aid/${id}`, data);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to update financial aid application');
      }
    }
  
    async getAvailableScholarships(): Promise<Scholarship[]> {
      try {
        const response = await httpClient.get(`${this.baseUrl}/scholarships`);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to fetch available scholarships');
      }
    }
  
    async getScholarshipApplications(): Promise<ScholarshipApplication[]> {
      try {
        const response = await httpClient.get(`${this.baseUrl}/scholarship-applications`);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to fetch scholarship applications');
      }
    }
  
    async getAllScholarshipApplications(): Promise<ScholarshipApplication[]> {
      try {
        const response = await httpClient.get(`${this.adminBaseUrl}/scholarship-applications`);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to fetch all scholarship applications');
      }
    }
  
    async applyForScholarship(application: Omit<ScholarshipApplication, 'id' | 'status' | 'applicationDate'>): Promise<ScholarshipApplication> {
      try {
        const response = await httpClient.post(`${this.baseUrl}/scholarship-applications`, application);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to submit scholarship application');
      }
    }
  
    async updateScholarshipApplication(id: string, data: { status: 'Approved' | 'Rejected' }): Promise<ScholarshipApplication> {
      try {
        const response = await httpClient.patch(`${this.baseUrl}/scholarship-applications/${id}`, data);
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to update scholarship application');
      }
    }
  
    async uploadDocument(file: File, type: 'financial-aid' | 'scholarship'): Promise<{ url: string }> {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
  
        const response = await httpClient.post(`${this.baseUrl}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.data;
      } catch (error) {
        throw new Error('Failed to upload document');
      }
    }
  }
  
  export const financialService = FinancialService.getInstance();