import httpClient from "../../frameworks/api/httpClient";

export interface DocumentUploadResult {
  url: string;
  publicId: string;
  fileName: string;
  fileType: string;
}

export interface MultipleDocumentUploadResult {
  documents: DocumentUploadResult[];
}

export interface DocumentViewResult {
  pdfData: string;
  fileName: string;
  fileType: string;
}

class DocumentUploadService {
  private baseUrl = '/admission';

  async uploadDocument(applicationId: string, documentType: string, file: File): Promise<DocumentUploadResult> {
    if (!applicationId || applicationId === '') {
      throw new Error('Application ID is required for document upload');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('applicationId', applicationId);
      formData.append('documentType', documentType);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await httpClient.post(`${this.baseUrl}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data?.document;
    } catch (error: any) {
      console.error('Error uploading document:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(error.response?.data?.error || error.message || 'Failed to upload document');
    }
  }

  async uploadMultipleDocuments(applicationId: string, files: File[], documentTypes: string[]): Promise<MultipleDocumentUploadResult> {
    try {
      const formData = new FormData();
      
      files.forEach((file) => {
        formData.append('files', file);
      });
      
      formData.append('applicationId', applicationId);
      documentTypes.forEach((documentType) => {
        formData.append('documentTypes', documentType);
      });

      const response = await httpClient.post(`${this.baseUrl}/documents/upload-multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error uploading multiple documents:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to upload documents');
    }
  }

  async getDocument(documentId: string): Promise<DocumentViewResult> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/documents/${documentId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching document:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch document');
    }
  }

  async getAdminDocument(documentId: string, admissionId: string): Promise<any> {
    try {
      const response = await httpClient.get(`/admin/admissions/documents/${documentId}?admissionId=${admissionId}`);

      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching admin document:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch admin document');
    }
  }
}

export const documentUploadService = new DocumentUploadService(); 