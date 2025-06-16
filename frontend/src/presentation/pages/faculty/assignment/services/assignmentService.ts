import httpClient from '../../../../../frameworks/api/httpClient';
import { Assignment, NewAssignment, Submission } from '../types';

export const assignmentService = {
  // Assignment CRUD operations
  getAssignments: async () => {
    const response = await httpClient.get('/faculty/assignments');
    return response.data;
  },

  getAssignmentById: async (id: string) => {
    const response = await httpClient.get(`/faculty/assignments/${id}`);
    return response.data;
  },

  createAssignment: async (assignment: NewAssignment) => {
    const formData = new FormData();
    formData.append('title', assignment.title);
    formData.append('subject', assignment.subject);
    formData.append('dueDate', assignment.dueDate);
    formData.append('maxMarks', assignment.maxMarks);
    formData.append('description', assignment.description);
    
    // Debug logs for files
    console.log('Files to upload:', assignment.files);
    
    // Append each file to the FormData
    assignment.files.forEach((file, index) => {
      console.log(`File ${index + 1}:`, {
        name: file.name,
        type: file.type,
        size: file.size
      });
      formData.append(`files`, file);
    });

    try {
      const response = await httpClient.post('/faculty/assignments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error uploading assignment:', error.response?.data || error.message);
      throw error;
    }
  },

  updateAssignment: async (id: string, assignment: Partial<Assignment>) => {
    const response = await httpClient.put(`/faculty/assignments/${id}`, assignment);
    return response.data;
  },

  deleteAssignment: async (id: string) => {
    const response = await httpClient.delete(`/faculty/assignments/${id}`);
    return response.data;
  },

  // Submission operations
  getSubmissions: async (assignmentId: string) => {
    const response = await httpClient.get(`/faculty/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  getSubmissionById: async (assignmentId: string, submissionId: string) => {
    const response = await httpClient.get(`/faculty/assignments/${assignmentId}/submissions/${submissionId}`);
    return response.data;
  },

  reviewSubmission: async (assignmentId: string, submissionId: string, reviewData: {
    marks: number;
    feedback: string;
    status: 'reviewed' | 'pending' | 'needs_correction';
    isLate: boolean;
  }) => {
    const response = await httpClient.put(
      `/faculty/assignments/${assignmentId}/submissions/${submissionId}/review`,
      reviewData
    );
    return response.data;
  },

  downloadSubmission: async (assignmentId: string, submissionId: string) => {
    const response = await httpClient.get(
      `/faculty/assignments/${assignmentId}/submissions/${submissionId}/download`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Analytics
  getAssignmentAnalytics: async (assignmentId: string) => {
    const response = await httpClient.get(`/faculty/assignments/${assignmentId}/analytics`);
    return response.data;
  },

  getAllAnalytics: async () => {
    const response = await httpClient.get('/faculty/assignments/analytics');
    return response.data;
  }
}; 