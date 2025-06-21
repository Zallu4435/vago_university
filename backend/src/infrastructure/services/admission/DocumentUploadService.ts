import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Cloudinary storage engine
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'admission-documents',
    allowed_formats: ['pdf'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  } as any,
});

// Create multer instance for document uploads
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
  async uploadDocument(file: Express.Multer.File, applicationId: string, documentType: string) {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      // The file is already uploaded to Cloudinary by multer
      const result = {
        url: file.path,
        publicId: file.filename,
        fileName: file.originalname,
        fileType: file.mimetype,
      };

      return {
        success: true,
        data: {
          document: result,
          message: 'Document uploaded successfully',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        data: {
          error: error.message || 'Failed to upload document',
        },
      };
    }
  }

  async uploadMultipleDocuments(files: Express.Multer.File[], applicationId: string, documentTypes: string[]) {
    try {
      if (!files || files.length === 0) {
        throw new Error('No files provided');
      }

      const documents = files.map((file, index) => ({
        url: file.path,
        publicId: file.filename,
        fileName: file.originalname,
        fileType: file.mimetype,
        documentType: documentTypes[index],
      }));

      return {
        success: true,
        data: {
          documents,
          message: 'Documents uploaded successfully',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        data: {
          error: error.message || 'Failed to upload documents',
        },
      };
    }
  }
} 