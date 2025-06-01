import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class UploadDocument {
  async execute(file: Express.Multer.File, type: 'financial-aid' | 'scholarship'): Promise<any> {
    try {
      if (!file) {
        throw new Error('File is required');
      }
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `financial/${type}`,
            public_id: `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
      return { url: (result as any).secure_url };
    } catch (err) {
      console.error('UploadDocument Error:', err);
      throw new Error(`Failed to upload document: ${err.message}`);
    }
  }
}