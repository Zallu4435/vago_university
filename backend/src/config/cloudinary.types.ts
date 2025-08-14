import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { OptionCallback } from 'multer-storage-cloudinary';

// Re-export Express types
export type { Request, Response, NextFunction } from 'express';

// Cloudinary transformation types
export interface CloudinaryTransformation {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  quality?: string | number;
  timeout?: number;
}

// Cloudinary storage params types - using the library's actual types
export interface CloudinaryStorageParams {
  folder?: OptionCallback<string>;
  allowed_formats?: OptionCallback<string[]>;
  resource_type?: OptionCallback<string>;
  transformation?: OptionCallback<CloudinaryTransformation[]>;
  public_id?: OptionCallback<string>;
  timeout?: OptionCallback<number>;
}

// Function types for Cloudinary callbacks
export type ResourceTypeCallback = OptionCallback<string>;
export type TransformationCallback = OptionCallback<CloudinaryTransformation[]>;
export type PublicIdCallback = OptionCallback<string>;
export type ParamsCallback = OptionCallback<CloudinaryStorageParams>;

// Request body types for different uploads
export interface AdmissionDocumentRequestBody {
  documentType?: string;
}

export interface MaterialUploadRequestBody {
  [key: string]: string | number | boolean | undefined;
}

// Extended Request types
export interface ExtendedRequest extends Request {
  body: AdmissionDocumentRequestBody | MaterialUploadRequestBody;
}

// Error types
export interface CloudinaryUploadError extends Error {
  code?: string;
}

// Middleware function types
export type CloudinaryMiddleware = (req: Request, res: Response, next: NextFunction) => void;

// File filter callback types
export type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

// Multer file types
export interface MulterFile extends Express.Multer.File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Request with file types
export interface RequestWithFile extends Request {
  file?: Express.Multer.File;
  files?: { [fieldname: string]: Express.Multer.File[] };
}

// Response types
export interface ErrorResponse {
  error: string;
  message: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// Allowed format types
export type DocumentFormat = 'pdf' | 'doc' | 'docx' | 'txt';
export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'gif' | 'bmp' | 'tiff' | 'webp';
export type VideoFormat = 'mp4' | 'mov' | 'avi' | 'webm' | 'mkv';
export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'm4a';

export type AllowedFormat = DocumentFormat | ImageFormat | VideoFormat | AudioFormat;

// MIME type mappings
export const MIME_TYPE_MAP: Record<string, string[]> = {
  'application/pdf': ['pdf'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'text/plain': ['txt'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'image/bmp': ['bmp'],
  'image/tiff': ['tiff'],
  'image/webp': ['webp'],
  'video/mp4': ['mp4'],
  'video/quicktime': ['mov'],
  'video/x-msvideo': ['avi'],
  'video/webm': ['webm'],
  'video/x-matroska': ['mkv'],
  'audio/mpeg': ['mp3'],
  'audio/wav': ['wav'],
  'audio/ogg': ['ogg'],
  'audio/m4a': ['m4a'],
  'application/octet-stream': ['bin'],
  'application/zip': ['zip'],
  'application/x-zip-compressed': ['zip']
};

// Type aliases for backward compatibility
export type FacultyStorageParams = CloudinaryStorageParams;
export type ProfilePictureStorageParams = CloudinaryStorageParams;
export type MessageAttachmentStorageParams = CloudinaryStorageParams;
export type AssignmentStorageParams = CloudinaryStorageParams;
export type AssignmentSubmissionStorageParams = CloudinaryStorageParams;
export type MaterialStorageParams = CloudinaryStorageParams;
export type AdmissionDocumentStorageParams = CloudinaryStorageParams;
export type SiteSectionImageStorageParams = CloudinaryStorageParams;
export type ContentVideoStorageParams = CloudinaryStorageParams;
export type ChatAttachmentStorageParams = CloudinaryStorageParams;
