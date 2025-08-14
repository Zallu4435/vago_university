import { 
    Charge, 
    Payment, 
    FinancialAidApplication, 
    Scholarship, 
    ScholarshipApplication,
    PaymentForm 
  } from '../../domain/types/management/financialmanagement';
import { StudentFinancialInfo } from '../../domain/types/user/financial';
  import httpClient from '../../frameworks/api/httpClient';
  import { isAxiosErrorWithApiError } from '../../shared/types/apiError';
  
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
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch student financial info');
        }
        throw new Error('Failed to fetch student financial info');
      }
    }
  
    async getAllPayments(params?: {
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
      status?: string;
      studentId?: string;
      term?: string;
    }): Promise<{ data: Payment[]; totalPayments: number; totalPages: number; currentPage: number }> {
      try {
        const queryParams: any = {
          page: params?.page || 1,
          limit: params?.limit || 10,
        };
        if (params?.startDate) queryParams.startDate = params.startDate;
        if (params?.endDate) queryParams.endDate = params.endDate;
        if (params?.status) queryParams.status = params.status;
        if (params?.studentId) queryParams.studentId = params.studentId;
        if (params?.term && params.term !== 'All Terms') queryParams.term = params.term;
        const response = await httpClient.get(`${this.adminBaseUrl}/payments`, {
          params: queryParams,
        });
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch all payments');
        }
        throw new Error('Failed to fetch all payments');
      }
    }
  
    async makePayment(payment: PaymentForm): Promise<Payment> {
      try {
        const response = await httpClient.post(`${this.baseUrl}/payments`, payment);
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to process payment');
        }
        throw new Error('Failed to process payment');
      }
    }
  
    async getFinancialAidApplications(): Promise<FinancialAidApplication[]> {
      try {
        const response = await httpClient.get(`${this.baseUrl}/financial-aid`);
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch financial aid applications');
        }
        throw new Error('Failed to fetch financial aid applications');
      }
    }
  
    async getAllFinancialAidApplications(): Promise<FinancialAidApplication[]> {
      try {
        const response = await httpClient.get(`${this.adminBaseUrl}/financial-aid`);
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch all financial aid applications');
        }
        throw new Error('Failed to fetch all financial aid applications');
      }
    }
  
    async applyForFinancialAid(application: Omit<FinancialAidApplication, 'id' | 'status' | 'applicationDate'>): Promise<FinancialAidApplication> {
      try {
        const response = await httpClient.post(`${this.baseUrl}/financial-aid`, application);
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to submit financial aid application');
        }
        throw new Error('Failed to submit financial aid application');
      }
    }
  
    async updateFinancialAidApplication(id: string, data: { status: 'Approved' | 'Rejected'; amount?: number }): Promise<FinancialAidApplication> {
      try {
        const response = await httpClient.patch(`${this.baseUrl}/financial-aid/${id}`, data);
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update financial aid application');
        }
        throw new Error('Failed to update financial aid application');
      }
    }
  
    async getAvailableScholarships(): Promise<Scholarship[]> {
      try {
        const response = await httpClient.get(`${this.baseUrl}/scholarships`);
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch available scholarships');
        }
        throw new Error('Failed to fetch available scholarships');
      }
    }
  
    async getScholarshipApplications(): Promise<ScholarshipApplication[]> {
      try {
        const response = await httpClient.get(`${this.baseUrl}/scholarship-applications`);
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch scholarship applications');
        }
        throw new Error('Failed to fetch scholarship applications');
      }
    }
  
    async getAllScholarshipApplications(): Promise<ScholarshipApplication[]> {
      try {
        const response = await httpClient.get(`${this.adminBaseUrl}/scholarship-applications`);
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch all scholarship applications');
        }
        throw new Error('Failed to fetch all scholarship applications');
      }
    }
  
    async applyForScholarship(application: Omit<ScholarshipApplication, 'id' | 'status' | 'applicationDate'>): Promise<ScholarshipApplication> {
      try {
        const response = await httpClient.post(`${this.baseUrl}/scholarship-applications`, application);
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to submit scholarship application');
        }
        throw new Error('Failed to submit scholarship application');
      }
    }
  
    async updateScholarshipApplication(id: string, data: { status: 'Approved' | 'Rejected' }): Promise<ScholarshipApplication> {
      try {
        const response = await httpClient.patch(`${this.baseUrl}/scholarship-applications/${id}`, data);
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update scholarship application');
        }
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
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to upload document');
        }
        throw new Error('Failed to upload document');
      }
    }

    async createCharge(chargeData: {
      title: string;
      description: string;
      amount: number;
      term: string;
      dueDate: string;
      applicableFor: string;
    }): Promise<Charge> {
      try {
        const response = await httpClient.post(`${this.adminBaseUrl}/charges`, chargeData);
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create charge');
        }
        throw new Error('Failed to create charge');
      }
    }

    async getCharges(filters?: {
      term?: string;
      status?: string;
      search?: string;
      page?: number;
      limit?: number;
    }): Promise<Charge[]> {
      try {
        const response = await httpClient.get(`${this.adminBaseUrl}/charges`, {
          params: {
            term: filters?.term || undefined,
            status: filters?.status || undefined,
            search: filters?.search || undefined,
            page: filters?.page || 1,
            limit: filters?.limit || 50
          }
        });
        return response.data.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch charges');
        }
        throw new Error('Failed to fetch charges');
      }
    }

    async updateCharge(id: string, data: Partial<Charge>): Promise<Charge> {
      try {
        const response = await httpClient.patch(`${this.adminBaseUrl}/charges/${id}`, data);
        return response.data.data;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update charge');
        }
        throw new Error('Failed to update charge');
      }
    }

    async deleteCharge(id: string): Promise<void> {
      try {
        await httpClient.delete(`${this.adminBaseUrl}/charges/${id}`);
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to delete charge');
        }
        throw new Error('Failed to delete charge');
      }
    }

    async getPaymentDetails(paymentId: string): Promise<Payment> {
      try {
        const response = await httpClient.get(`${this.adminBaseUrl}/payments/${paymentId}`);
        console.log(response.data.data.payment, "response.data.data.paymentresponse.data.data.payment")
        return response.data.data.payment;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch payment details');
        }
        throw new Error('Failed to fetch payment details');
      }
    }

    async checkPendingPayment(): Promise<boolean> {
      try {
        const response = await httpClient.post(`${this.baseUrl}/check-pending`);
        return response.data.data.hasPending;
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to check pending payment status');
        }
        throw new Error('Failed to check pending payment status');
      }
    }

    async clearPendingPayment(): Promise<void> {
      try {
        await httpClient.post(`${this.baseUrl}/clear-pending`);
      } catch (error: unknown) {
        if (isAxiosErrorWithApiError(error)) {
          throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to clear pending payment status');
        }
        console.error('Failed to clear pending payment:', error);
        throw new Error('Failed to clear pending payment status');
      }
    }
    
  }
  
  export const financialService = FinancialService.getInstance();