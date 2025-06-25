import httpClient from '../../../../../frameworks/api/httpClient';

export const userAssignmentService = {
  // Get all assignments for the current user
  getAssignments: async (params?: { status?: string; page?: number; limit?: number; subject?: string }) => {
    try {
    
      const response = await httpClient.get('/assignments', { params });
  
      // The backend returns the data directly in response.data
      return response.data.data;
    } catch (error) {
      console.error('Error in getAssignments:', error);
      throw error;
    }
  },

  // Get a specific assignment by ID
  getAssignmentById: async (id: string) => {
    const response = await httpClient.get(`/assignments/${id}`);
    return response.data;
  },

  // Submit an assignment
  submitAssignment: async (assignmentId: string, file: File) => {


    const formData = new FormData();
    formData.append('file', file);

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
    } catch (error) {
      console.error('Service: Submission error:', error);
      throw error;
    }
  },

  // Get assignment status and details
  getAssignmentStatus: async (assignmentId: string) => {
    const response = await httpClient.get(`/assignments/${assignmentId}/status`);
    return response.data;
  },

  // Get signed download URL for assignment files
  getFileDownloadUrl: async (fileUrl: string, fileName: string) => {
    try {
      console.log('Service: Getting download URL for file:', fileName);
      const response = await httpClient.get('/assignments/download-file', {
        params: { fileUrl, fileName }
      });
      console.log('Service: Download URL response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Service: Error getting download URL:', error);
      throw error;
    }
  },

  // Get assignment feedback if graded
  getAssignmentFeedback: async (assignmentId: string) => {
    const response = await httpClient.get(`/assignments/${assignmentId}/feedback`);
    return response.data;
  }
}; 