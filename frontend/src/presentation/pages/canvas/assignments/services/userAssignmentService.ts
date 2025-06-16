import httpClient from '../../../../../frameworks/api/httpClient';

export const userAssignmentService = {
  // Get all assignments for the current user
  getAssignments: async (params?: { status?: string; page?: number; limit?: number; subject?: string }) => {
    try {
      console.log('Making request to /assignments with params:', params);
      const response = await httpClient.get('/assignments', { params });
      console.log('Raw response:', response);
      // The backend returns the data directly in response.data
      return response.data;
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
    console.log('Service: Starting submission for assignment:', assignmentId);
    console.log('Service: File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Service: Sending request to:', `/assignments/${assignmentId}/submit`);
      const response = await httpClient.post(
        `/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Service: Submission response:', response.data);
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

  // Get assignment feedback if graded
  getAssignmentFeedback: async (assignmentId: string) => {
    const response = await httpClient.get(`/assignments/${assignmentId}/feedback`);
    return response.data;
  }
}; 