import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { IDocument } from '../../../domain/admission/entities/AdmissionTypes';
import { DocumentUploadFailedException } from '../../../domain/admission/errors/AdmissionErrors';
import { CloudinaryStorageParams } from '../../../config/cloudinary.types';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: () => 'admission-documents',
    allowed_formats: () => ['pdf'],
    transformation: () => [{ width: 1000, height: 1000, crop: 'limit' }],
  } as CloudinaryStorageParams,
});

export const admissionDocumentUpload = multer({
  storage: cloudinaryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

export class DocumentUploadService {
  async uploadDocument(file: Express.Multer.File, applicationId: string, documentType: string): Promise<IDocument> {
    if (!file) {
      throw new DocumentUploadFailedException('No file provided');
    }
    return {
      url: file.path,
      publicId: file.filename,
      fileName: file.originalname,
      fileType: file.mimetype,
      applicationId,
      documentType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async uploadMultipleDocuments(files: Express.Multer.File[], applicationId: string, documentTypes: string[]): Promise<IDocument[]> {
    if (!files || files.length === 0) {
      throw new DocumentUploadFailedException('No files provided');
    }
    return files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
      fileName: file.originalname,
      fileType: file.mimetype,
      applicationId,
      documentType: documentTypes[index],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }
} 