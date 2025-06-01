import { Types } from 'mongoose';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../../../config/config';
import { FacultyRegister } from '../../../infrastructure/database/mongoose/models/facultyRegister.model';

interface DownloadCertificateParams {
  facultyId: string;
  certificateUrl: string;
  requestingUserId: string;
  type: string;
}

interface DownloadCertificateResult {
  fileStream: NodeJS.ReadableStream;
  fileSize: number;
  fileName: string;
}

class DownloadCertificate {
  async execute(params: DownloadCertificateParams): Promise<DownloadCertificateResult> {
    try {
      console.log(`Executing downloadCertificate use case with id: ${params.facultyId}, url: ${params.certificateUrl}, type: ${params.type}`);

      const { facultyId, certificateUrl, requestingUserId, type } = params;

      // Validate faculty ID
      if (!Types.ObjectId.isValid(facultyId)) {
        throw new Error('Invalid faculty ID');
      }

      // Fetch faculty from database
      const faculty = await FacultyRegister.findById(facultyId);
      if (!faculty) {
        throw new Error('Faculty not found');
      }

      // Validate certificate URL
      if (!certificateUrl || typeof certificateUrl !== 'string') {
        throw new Error('Certificate URL is required');
      }

      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      // Validate Cloudinary URL format
      if (!certificateUrl.match(/^https:\/\/res\.cloudinary\.com\/vago-university\/image\/upload\/v[0-9]+\/faculty-documents\/[a-zA-Z0-9]+\.pdf$/)) {
        throw new Error('Invalid certificate URL');
      }
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

      // Validate type
      if (!type || !['cv', 'certificate'].includes(type.toLowerCase())) {
        throw new Error('Invalid document type. Must be "cv" or "certificate"');
      }
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

      // Validate requesting user
      if (!requestingUserId) {
        throw new Error('Authentication required');
      }
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

      // Extract public ID from URL (e.g., faculty-documents/rc0jc4zg2oqyxvvqczym)
      const publicId = certificateUrl
        .replace(/^https:\/\/res\.cloudinary\.com\/vago-university\/image\/upload\/v[0-9]+\//, '')
        .replace(/\.pdf$/, '');

      // Generate secure download URL using Cloudinary SDK
      const downloadUrl = cloudinary.url(publicId, {
        resource_type: 'image', // Cloudinary stores PDFs as image type for uploads
        secure: true,
        type: 'upload',
        sign_url: true,
        api_secret: config.cloudinary.apiSecret,
      });
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

      // Fetch file from Cloudinary
      const response = await axios.get(downloadUrl, {
        responseType: 'stream',
      });
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

      // Get file size from headers
      const fileSize = parseInt(response.headers['content-length'] || '0', 10);
      if (!fileSize) {
        throw new Error('Unable to determine file size');
      }

      // Extract filename from URL or use fallback
      const fileName = certificateUrl.split('/').pop() || `${type}_${facultyId}.pdf`;

      // Get file stream
      const fileStream = response.data;
      console.log(fileStream, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

      return {
        fileStream,
        fileSize,
        fileName,
      };
    } catch (err) {
      console.error(`Error in downloadCertificate use case:`, err);
      throw err;
    }
  }

  private async isAdmin(userId: string): Promise<boolean> {
    // Placeholder: Implement admin role check
    return false; // Replace with actual logic
  }
}

export const downloadCertificate = new DownloadCertificate();
