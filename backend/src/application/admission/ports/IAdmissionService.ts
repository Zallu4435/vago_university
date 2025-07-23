import { IFile, IMultipleFiles } from "./IFile";

export interface UploadDocumentResult {
    success: boolean;
    message: string;
    document: {
        url: string;
        publicId: string;
        fileName: string;
        fileType: string;
    };
}

export interface UploadMultipleDocumentsResult {
    success: boolean;
    message: string;
    documents: Array<{
        url: string;
        publicId: string;
        fileName: string;
        fileType: string;
    }>;
}

export interface RetrieveDocumentResult {
    pdfData: string;
    fileName: string;
    contentType: string;
}

export interface IAdmissionService {
    uploadDocument(file: IFile, applicationId: string, documentType: string): Promise<UploadDocumentResult>;
    uploadMultipleDocuments(files: IMultipleFiles, applicationId: string, documentTypes: string[]): Promise<UploadMultipleDocumentsResult>;
    retrieveDocument(url: string): Promise<RetrieveDocumentResult>;
}