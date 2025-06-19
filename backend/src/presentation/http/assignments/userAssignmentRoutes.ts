import { Router, Request, Response, NextFunction } from 'express';
import { UserAssignmentComposers } from '../../../infrastructure/services/assignments/UserAssignmentComposers';
import { assignmentSubmissionUpload, cloudinary } from '../../../config/cloudinary.config';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import multer from 'multer';
import axios from 'axios';

const router = Router();
const userAssignmentController = UserAssignmentComposers.composeUserAssignmentController();

// Proxy route for downloading files from Cloudinary - place this first
router.get('/download-file', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  console.log('=== DOWNLOAD REQUEST STARTED ===');
  console.log('🕐 Timestamp:', new Date().toISOString());
  console.log('📍 Route: /download-file');
  console.log('🔗 Request URL:', req.url);
  console.log('📋 Request method:', req.method);
  console.log('👤 User authenticated:', !!req.user);
  console.log('📦 Request headers:', JSON.stringify(req.headers, null, 2));
  
  try {
    const { fileUrl, fileName } = req.query;
    
    console.log('🔍 Query parameters received:', { fileUrl, fileName });
    console.log('📝 fileUrl type:', typeof fileUrl);
    console.log('📝 fileName type:', typeof fileName);
    
    if (!fileUrl || typeof fileUrl !== 'string') {
      console.log('❌ Missing or invalid fileUrl');
      res.status(400).json({ error: 'File URL is required' });
      return;
    }

    if (!fileName || typeof fileName !== 'string') {
      console.log('❌ Missing or invalid fileName');
      res.status(400).json({ error: 'File name is required' });
      return;
    }

    console.log('✅ Parameters validated successfully');
    console.log('📁 File to download:', fileName);
    console.log('🔗 Cloudinary URL:', fileUrl);
    console.log('🔍 Is Cloudinary URL?', fileUrl.includes('cloudinary.com'));

    // Since Cloudinary files are not publicly accessible, return the URL directly
    // The frontend will handle the download using window.open as fallback
    console.log('📤 Returning Cloudinary URL to frontend for direct download');
    
    const response = {
      success: true,
      fileUrl: fileUrl,
      fileName: fileName,
      message: 'Use window.open to download the file',
      timestamp: new Date().toISOString()
    };
    
    console.log('📤 Sending response:', JSON.stringify(response, null, 2));
    
    res.json(response);
    
    console.log('✅ Response sent successfully');

  } catch (error: any) {
    console.error('❌ Error in download proxy:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error message:', error.message);
    res.status(500).json({ 
      error: 'Failed to process download request',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
  
  console.log('=== DOWNLOAD REQUEST ENDED ===');
});

router.get('/', authMiddleware, (req, res) => {
  expressAdapter(req, res, userAssignmentController.getAssignments.bind(userAssignmentController));
});

router.get('/:id', authMiddleware, (req, res) => {
  expressAdapter(req, res, userAssignmentController.getAssignmentById.bind(userAssignmentController));
});

router.post('/:id/submit', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  console.log('Starting assignment submission process...');
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);
  
  assignmentSubmissionUpload.single('file')(req, res, (err) => {
    console.log('File upload callback triggered');
    console.log(err)
    
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 10MB'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      console.error('No file was uploaded');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('File upload successful:', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    // Pass the original Express request to expressAdapter
    console.log('Proceeding to submit assignment with request:', {
      params: req.params,
      body: req.body,
      user: req.user,
      file: req.file
    });
    
    expressAdapter(req, res, userAssignmentController.submitAssignment.bind(userAssignmentController));
  });
});

router.get('/:id/status', authMiddleware, (req, res) => {
  expressAdapter(req, res, userAssignmentController.getAssignmentStatus.bind(userAssignmentController));
});

router.get('/:id/feedback', authMiddleware, (req, res) => {
  expressAdapter(req, res, userAssignmentController.getAssignmentFeedback.bind(userAssignmentController));
});

export default router; 