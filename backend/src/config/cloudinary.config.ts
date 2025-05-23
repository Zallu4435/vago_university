import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { config as appConfig } from '../config/config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: appConfig.cloudinary.cloudName,
  api_key: appConfig.cloudinary.apiKey,
  api_secret: appConfig.cloudinary.apiSecret,
});

// Storage engine for faculty documents
const facultyStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'faculty-documents',
    allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    transformation: [{ quality: 'auto' }],
  } as any,
});

// Storage engine for profile pictures
const profilePictureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile-pictures',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      { width: 200, height: 200, crop: 'fill', gravity: 'face', quality: 'auto' },
    ],
  } as any,
});

// Storage engine for message attachments
const messageAttachmentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'message-attachments',
    allowed_formats: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
    resource_type: 'auto', // Supports both images and raw files (e.g., txt)
    transformation: [{ quality: 'auto' }],
  } as any,
});

// Multer instances
const facultyUpload = multer({ 
  storage: facultyStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
const profilePictureUpload = multer({ 
  storage: profilePictureStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
const messageAttachmentUpload = multer({ 
  storage: messageAttachmentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export { cloudinary, facultyUpload, profilePictureUpload, messageAttachmentUpload };