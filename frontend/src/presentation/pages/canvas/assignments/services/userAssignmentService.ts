import httpClient from '../../../../../frameworks/api/httpClient';

export const userAssignmentService = {
  getAssignments: async (params?: { status?: string; page?: number; limit?: number; subject?: string; search?: string; sortBy?: string }) => {
    try {

      const response = await httpClient.get('/assignments', { params });

      return response.data.data;
    } catch (error) {
      console.error('Error in getAssignments:', error);
      throw error;
    }
  },

  getAssignmentById: async (id: string) => {
    const response = await httpClient.get(`/assignments/${id}`);
    return response.data;
  },

  submitAssignment: async (assignmentId: string, file: File) => {
    console.log('=== FRONTEND SERVICE: SUBMIT ASSIGNMENT STARTED ===');
    console.log('Service: Assignment ID:', assignmentId);
    console.log('Service: File object:', file);
    console.log('Service: File info:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    if (!file || file.size === 0) {
      console.error('Service: Invalid file - file is null or has zero size');
      throw new Error('Invalid file');
    }

    const formData = new FormData();
    formData.append('file', file);

    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    try {
      const response = await httpClient.post(
        `/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Service: Submission error:', error);
      console.error('Service: Error response:', error.response?.data);
      console.error('Service: Error status:', error.response?.status);
      throw error;
    }
  },

  getAssignmentStatus: async (assignmentId: string) => {
    const response = await httpClient.get(`/assignments/${assignmentId}/status`);
    return response.data;
  },

  getFileDownloadUrl: async (fileUrl: string, fileName: string) => {
    try {
      const response = await httpClient.get('/assignments/download-file', {
        params: { fileUrl, fileName }
      });
      return response.data;
    } catch (error) {
      console.error('Service: Error getting download URL:', error);
      throw error;
    }
  },

  downloadReferenceFile: async (fileUrl: string, fileName: string) => {
    try {
      const response = await httpClient.get('/assignments/download-reference-file', {
        params: { fileUrl, fileName },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Service: Error downloading reference file:', error);
      throw error;
    }
  },

  getAssignmentFeedback: async (assignmentId: string) => {
    const response = await httpClient.get(`/assignments/${assignmentId}/feedback`);
    return response.data;
  }
}; 