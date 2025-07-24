import httpClient from '../../../../../frameworks/api/httpClient';
import { Assignment, NewAssignment, Submission } from '../types';

export const assignmentService = {
  // Assignment CRUD operations
  getAssignments: async (params = {}) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '' && value !== 'all')
    );
    const queryString = Object.keys(filteredParams).length
      ? '?' + new URLSearchParams(filteredParams).toString()
      : '';
    const response = await httpClient.get(`/faculty/assignments${queryString}`);
    return response.data.data;
  },

  getAssignmentById: async (id: string) => {
    const response = await httpClient.get(`/faculty/assignments/${id}`);
    return response.data.data;
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

  updateAssignment: async (id: string, assignment: Partial<Assignment> & { files?: File[] }) => {
    // If files are present, use FormData
    if (assignment.files && assignment.files.length > 0) {
      const formData = new FormData();
      if (assignment.title) formData.append('title', assignment.title);
      if (assignment.subject) formData.append('subject', assignment.subject);
      if (assignment.dueDate) formData.append('dueDate', assignment.dueDate);
      if (assignment.maxMarks) formData.append('maxMarks', assignment.maxMarks.toString());
      if (assignment.description) formData.append('description', assignment.description);
      assignment.files.forEach((file, index) => {
        formData.append('files', file);
      });
      const response = await httpClient.put(`/faculty/assignments/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // No new files, send as JSON
      const response = await httpClient.put(`/faculty/assignments/${id}`, assignment);
      return response.data;
    }
  },

  deleteAssignment: async (id: string) => {
    const response = await httpClient.delete(`/faculty/assignments/${id}`);
    return response.data;
  },

  // Submission operations
  getSubmissions: async (assignmentId: string) => {
    const response = await httpClient.get(`/faculty/assignments/${assignmentId}/submissions`);
    return response.data.data;
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

  // downloadSubmission: async (assignmentId: string, submissionId: string) => {
  //   const response = await httpClient.get(
  //     `/faculty/assignments/${assignmentId}/submissions/${submissionId}/download`,
  //     { responseType: 'blob' }
  //   );
  //   return response.data;
  // },

  // Analytics
  getAllAnalytics: async () => {
    const response = await httpClient.get('/faculty/assignments/analytics');
    return response.data.data;
  },

  // Get file download URL (similar to canvas assignment)
  getFileDownloadUrl: async (fileUrl: string, fileName: string) => {
    try {
      console.log('Service: Getting download URL for file:', fileName);
      const response = await httpClient.get('/faculty/assignments/download-submission-file', {
        params: { fileUrl, fileName },
        responseType: 'blob'
      });
      console.log('Service: Download response received:', {
        status: response.status,
        statusText: response.statusText,
        dataType: typeof response.data,
        dataSize: response.data instanceof Blob ? response.data.size : 'N/A'
      });
      return response.data;
    } catch (error) {
      console.error('Service: Error getting download URL:', error);
      throw error;
    }
  },

  // New method for downloading submission files (similar to student side)
  downloadSubmissionFile: async (fileUrl: string, fileName: string) => {
    try {
      console.log('=== SERVICE: DOWNLOAD SUBMISSION FILE STARTED ===');
      console.log('Service: File URL:', fileUrl);
      console.log('Service: File Name:', fileName);
      
      // Use the same pattern as canvas assignment - get file blob first
      const blob = await assignmentService.getFileDownloadUrl(fileUrl, fileName);
      console.log('Service: File blob received:', {
        size: blob instanceof Blob ? blob.size : 'N/A',
        type: blob instanceof Blob ? blob.type : 'N/A'
      });
      
      // Create blob URL and trigger download (same as canvas)
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      console.log('📎 Download link properties:', {
        href: link.href,
        download: link.download
      });
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      
      console.log('Service: File download triggered successfully');
      console.log('=== SERVICE: DOWNLOAD SUBMISSION FILE COMPLETED ===');
      return blob;
    } catch (error: any) {
      console.error('=== SERVICE: DOWNLOAD SUBMISSION FILE ERROR ===');
      console.error('Service: Error downloading submission file:', error);
      console.error('Service: Error response:', error.response?.data);
      console.error('Service: Error status:', error.response?.status);
      console.error('Service: Error message:', error.message);
      console.error('=== SERVICE: DOWNLOAD SUBMISSION FILE ERROR END ===');
      throw error;
    }
  },
}; 