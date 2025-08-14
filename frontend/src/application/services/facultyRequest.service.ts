import httpClient from '../../frameworks/api/httpClient';
import { FacultyRequestFormData } from '../../domain/validation/facultyRequestSchema';
import { isAxiosErrorWithApiError } from '../../shared/types/apiError';

interface FacultyRequestResponse {
  message: string;
  requestId: string;
}

class FacultyRequestService {
  async submitRequest(data: FacultyRequestFormData): Promise<FacultyRequestResponse> {
    try {
      const formData = new FormData();
      
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('department', data.department);
      formData.append('qualification', data.qualification);
      formData.append('experience', data.experience);
      if (data.aboutMe) {
        formData.append('aboutMe', data.aboutMe);
      }
      
      if (data.cv && data.cv[0]) {
        formData.append('cv', data.cv[0]);
      }
      if (data.certificates && data.certificates[0]) {
        formData.append('certificates', data.certificates[0]);
      }

      const response = await httpClient.post<FacultyRequestResponse>(
        '/auth/faculty/request',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithApiError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to submit faculty request');
      }
      throw new Error('Failed to submit faculty request');
    }
  }
}

export const facultyRequestService = new FacultyRequestService();