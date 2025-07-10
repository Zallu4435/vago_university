import httpClient from '../../frameworks/api/httpClient';
import { 
  Enquiry, 
  EnquiryApiResponse, 
  CreateEnquiryData
} from '../../domain/types/enquirymanagement';

class EnquiryService {
  private baseUrl = '/enquiries';

  async getEnquiries(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string,
    subject?: string,
    startDate?: string,
    endDate?: string
  ): Promise<EnquiryApiResponse> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (status && status !== 'All Statuses') params.append('status', status);
    if (search) params.append('search', search);
    if (subject && subject !== 'All Subjects') params.append('subject', subject);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await httpClient.get(`${this.baseUrl}?${params.toString()}`);
    return response.data.data;
  }

  async getEnquiryById(id: string): Promise<Enquiry> {
    const response = await httpClient.get(`${this.baseUrl}/${id}`);
    return response.data.enquiry;
  }

  async createEnquiry(data: CreateEnquiryData): Promise<Enquiry> {
    const response = await httpClient.post(this.baseUrl, data);
    return response.data.enquiry;
  }

  async updateEnquiryStatus(id: string, status: string): Promise<Enquiry> {
    const response = await httpClient.patch(`${this.baseUrl}/${id}/status`, { status });
    return response.data.enquiry;
  }

  async deleteEnquiry(id: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`);
  }

  async sendReply(id: string, replyMessage: string): Promise<{ success: boolean; message: string }> {
    const response = await httpClient.post(`${this.baseUrl}/${id}/reply`, { replyMessage });
    return response.data;
  }
}

export const enquiryService = new EnquiryService(); 