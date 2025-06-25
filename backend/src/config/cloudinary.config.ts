import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { config as appConfig } from '../config/config';

cloudinary.config({
  cloud_name: appConfig.cloudinary.cloudName,
  api_key: appConfig.cloudinary.apiKey,
  api_secret: appConfig.cloudinary.apiSecret,
});

const facultyStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'faculty-documents',
    allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    resource_type: (req: any, file: any) => {
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(ext)) return 'raw';
      return 'image';
    },
    public_id: (req: any, file: any) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      const fieldName = file.fieldname; // 'cv' or 'certificates'
      return `faculty_${fieldName}_${timestamp}_${originalName}`;
    }
  } as any,
});

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

const messageAttachmentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'message-attachments',
    allowed_formats: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
    resource_type: 'auto', 
    transformation: [{ quality: 'auto' }],
  } as any,
});

const assignmentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'assignments',
    allowed_formats: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
    resource_type: 'auto',
    transformation: [{ quality: 'auto' }],
  } as any
});

const assignmentSubmissionStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'assignment-submissions',
    allowed_formats: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'],
    resource_type: 'auto',
    public_id: (req: any, file: any) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      console.log('🔧 Generating public_id for file:', {
        originalname: file.originalname,
        originalName: originalName,
        timestamp: timestamp,
        public_id: `submission_${timestamp}_${originalName}`
      });
      return `submission_${timestamp}_${originalName}`;
    }
  } as any
});

const materialStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'materials',
    allowed_formats: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
    resource_type: (req: any, file: any) => {
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) return 'raw';
      return 'image';
    },
    transformation: (req: any, file: any) => {
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        return [{ quality: 'auto' }];
      }
      return undefined;
    },
  } as any,
});

const admissionDocumentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'admission-documents',
    allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    resource_type: (req: any, file: any) => {
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(ext)) return 'raw';
      return 'image';
    },
    public_id: (req: any, file: any) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      const documentType = req.body.documentType || 'document';
      return `admission_${documentType}_${timestamp}_${originalName}`;
    }
  } as any,
});

const siteSectionImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req: any, file: any) => {
    const params = {
      folder: 'site-section-images',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [
        { width: 800, height: 600, crop: 'limit', quality: 'auto' },
      ],
    };
    return params;
  },
});

const siteSectionImageUpload = multer({
  storage: siteSectionImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error('[siteSectionImageUpload] fileFilter - invalid file format:', file.mimetype);
      cb(new Error('Invalid file format. Only JPG, JPEG, and PNG are allowed.'));
    }
  },
});

// Multer instances
const facultyUpload = multer({
  storage: facultyStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
const profilePictureUpload = multer({
  storage: profilePictureStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
const messageAttachmentUpload = multer({
  storage: messageAttachmentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
const assignmentUpload = multer({
  storage: assignmentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    console.log('Validating assignment file:', {
      originalname: file.originalname,
      mimetype: file.mimetype
    });

    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error('Invalid file format:', file.mimetype);
      cb(new Error('Invalid file format'));
    }
  }
});
const assignmentSubmissionUpload = multer({
  storage: assignmentSubmissionStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1 
  },
  fileFilter: (req: any, file: any, cb: any) => {

    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp',
      'application/octet-stream',
      'application/zip',
      'application/x-zip-compressed'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error('Invalid file format:', file.mimetype);
      console.error('File details:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
      cb(new Error(`Invalid file format: ${file.mimetype}. Allowed formats: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF, BMP, TIFF, WEBP`));
    }
  }
});

const materialUpload = multer({
  storage: materialStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, 
  fileFilter: (req: any, file: any, cb: any) => {
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    const allowedFormats = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png']; 
    if (!ext || !allowedFormats.includes(ext)) {
      console.error('[MaterialUpload] Extension not allowed:', ext);
      return cb(new Error(`File extension .${ext} is not allowed. Allowed: ${allowedFormats.join(', ')}`));
    }
    if (!allowedMimeTypes.includes(file.mimetype)) {
      console.error('[MaterialUpload] Invalid file mimetype:', file.mimetype);
      return cb(new Error(`File mimetype ${file.mimetype} is not allowed. Allowed: ${allowedMimeTypes.join(', ')}`));
    }
    cb(null, true);
  }
});

const admissionDocumentUpload = multer({
  storage: admissionDocumentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    console.log('[AdmissionDocumentUpload] Validating file:', {
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error('[AdmissionDocumentUpload] Invalid file format:', file.mimetype);
      cb(new Error(`Invalid file format: ${file.mimetype}. Allowed formats: PDF, DOC, DOCX, JPG, JPEG, PNG`));
    }
  }
});

const contentVideoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'content',          
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
    transformation: [{ quality: 'auto' }],
    timeout: 60000, 
  } as any,
});

const contentVideoUpload = multer({
  storage: contentVideoStorage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {

    const allowedMimeTypes = [
      'video/mp4',
      'video/quicktime',    
      'video/x-msvideo',    
      'video/webm',
      'video/x-matroska',   
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error('Invalid video format:', file.mimetype);
      console.error('Allowed formats: MP4, MOV, AVI, WEBM, MKV');
      cb(new Error('Invalid video format. Allowed: MP4, MOV, AVI, WEBM, MKV'));
    }
  },
});

const contentVideoUploadWithErrorHandling = (req: any, res: any, next: any) => {

  req.setTimeout(60000);
  res.setTimeout(60000);

  const isUpdateRequest = req.method === 'PUT';
  const hasFile = req.headers['content-type']?.includes('multipart/form-data');
  

  if (isUpdateRequest && !hasFile) {
    return next();
  }

  contentVideoUpload.single('videoFile')(req, res, (err: any) => {
    if (err) {
      console.error('Video upload error:', err);

      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'File too large',
          message: 'Video file size exceeds the 500MB limit'
        });
      }

      if (err.code === 'ETIMEDOUT' || err.message?.includes('timeout')) {
        return res.status(408).json({
          error: 'Upload timeout',
          message: 'Video upload took too long. Please try again.'
        });
      }

      if (err.message?.includes('Invalid video format')) {
        return res.status(400).json({
          error: 'Invalid file format',
          message: err.message
        });
      }

      return res.status(400).json({
        error: 'Upload failed',
        message: err.message || 'Failed to upload video file'
      });
    }

    if (!req.file) {
      console.error('No file uploaded or file object is invalid.');
      return res.status(400).json({
        error: 'No video file uploaded',
        message: 'Please provide a valid video file.'
      });
    }

    if (!req.file.size || req.file.size > 500 * 1024 * 1024) {
      console.error('File size invalid or exceeds limit:', req.file.size);
      return res.status(400).json({
        error: 'Invalid file size',
        message: 'File is either missing size information or too large.'
      });
    }
    next();
  });
};

const chatAttachmentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chat-attachments',
    allowed_formats: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
    resource_type: 'auto',
    transformation: [{ quality: 'auto' }],
  } as any,
});

const chatAttachmentUpload = multer({
  storage: chatAttachmentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error('[chatAttachmentUpload] Invalid file format:', file.mimetype);
      cb(new Error('Invalid file format'));
    }
  }
});

export { cloudinary, facultyUpload, profilePictureUpload, messageAttachmentUpload, assignmentUpload, assignmentSubmissionUpload, contentVideoUpload, contentVideoUploadWithErrorHandling, materialUpload, admissionDocumentUpload, siteSectionImageUpload, chatAttachmentUpload };