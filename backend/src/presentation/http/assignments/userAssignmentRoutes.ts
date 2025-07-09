import { Router, Request, Response, NextFunction } from 'express';
import { UserAssignmentComposers } from '../../../infrastructure/services/assignments/UserAssignmentComposers';
import { assignmentSubmissionUpload, cloudinary } from '../../../config/cloudinary.config';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import multer from 'multer';
import axios from 'axios';
const fetch = require('node-fetch');

const router = Router();
const userAssignmentController = UserAssignmentComposers.composeUserAssignmentController();

router.get('/download-file', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileUrl, fileName } = req.query;

    if (!fileUrl || typeof fileUrl !== 'string') {
      res.status(400).json({ error: 'File URL is required' });
      return;
    }

    if (!fileName || typeof fileName !== 'string') {
      res.status(400).json({ error: 'File name is required' });
      return;
    }

    const response = {
      success: true,
      fileUrl: fileUrl,
      fileName: fileName,
      message: 'Use window.open to download the file',
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error: any) {
    console.error('Error in download proxy:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    res.status(500).json({
      error: 'Failed to process download request',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// New endpoint for downloading assignment reference files
router.get('/download-reference-file', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('=== ASSIGNMENT REFERENCE FILE DOWNLOAD STARTED ===');
    console.log('📥 Request received:', {
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      headers: req.headers
    });

    const { fileUrl, fileName } = req.query;

    console.log('🔍 Query parameters:', { fileUrl, fileName });

    if (!fileUrl || typeof fileUrl !== 'string') {
      console.error('❌ Error: File URL is missing or invalid');
      res.status(400).send('File URL is required');
      return;
    }

    if (!fileName || typeof fileName !== 'string') {
      console.error('❌ Error: File name is missing or invalid');
      res.status(400).send('File name is required');
      return;
    }

    console.log('✅ Parameters validation passed');

    // Clean the filename
    let cleanFileName = fileName.replace(/\s+/g, '_');
    cleanFileName = cleanFileName.replace(/[^a-zA-Z0-9._-]/g, '');
    cleanFileName = cleanFileName.replace(/"/g, '');

    console.log('📝 File name processing:', {
      original: fileName,
      cleaned: cleanFileName
    });

    console.log('🌐 Fetching file from URL:', fileUrl);

    // Fetch the file from the URL
    const response = await fetch(fileUrl);
    
    console.log('📡 Fetch response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      console.error('❌ Error: Failed to fetch file from URL');
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      res.status(500).send('Failed to fetch file');
      return;
    }

    console.log('✅ File fetched successfully');

    // Set proper headers for download
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = `attachment; filename="${cleanFileName}"`;
    
    console.log('📋 Setting response headers:', {
      'Content-Disposition': contentDisposition,
      'Content-Type': contentType
    });

    res.setHeader('Content-Disposition', contentDisposition);
    res.setHeader('Content-Type', contentType);
    
    console.log('📤 Starting file stream to client...');
    
    // Stream the file to the client
    response.body.pipe(res);
    
    console.log('✅ File stream initiated successfully');
    console.log('=== ASSIGNMENT REFERENCE FILE DOWNLOAD COMPLETED ===');

  } catch (err: any) {
    console.error('=== ASSIGNMENT REFERENCE FILE DOWNLOAD ERROR ===');
    console.error('❌ Error details:', err);
    console.error('❌ Error message:', err.message);
    console.error('❌ Error stack:', err.stack);
    console.error('❌ Error type:', err.constructor.name);
    
    if (err instanceof Error) {
      console.error('❌ Error name:', err.name);
    }
    
    console.error('=== ASSIGNMENT REFERENCE FILE DOWNLOAD ERROR END ===');
    res.status(500).send('Download failed');
  }
});

router.get('/', authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, userAssignmentController.getAssignments.bind(userAssignmentController));
});

router.get('/:id', authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, userAssignmentController.getAssignmentById.bind(userAssignmentController));
});

router.post('/:id/submit', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  console.log('=== ROUTE: ASSIGNMENT SUBMIT/RESUBMIT STARTED ===');
  console.log('Route: Request method:', req.method);
  console.log('Route: Request URL:', req.url);
  console.log('Route: Assignment ID from params:', req.params.id);
  console.log('Route: User from auth middleware:', req.user);
  console.log('Route: Request headers:', req.headers);
  console.log('Route: Request body keys:', Object.keys(req.body || {}));
  
  assignmentSubmissionUpload.single('file')(req, res, (err) => {
    console.log('Route: Multer middleware completed');
    console.log('Route: Multer error:', err);
    console.log('Route: File after multer:', req.file ? {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    } : 'No file');
    
    if (err instanceof multer.MulterError) {
      console.error('Route: Multer error occurred:', {
        code: err.code,
        message: err.message
      });
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
      console.error('Route: Non-multer error occurred:', err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      console.error('Route: No file was uploaded');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('Route: All validations passed, calling controller...');
    console.log('=== ROUTE: ASSIGNMENT SUBMIT/RESUBMIT VALIDATION COMPLETED ===');
    expressAdapter(req, res, next, userAssignmentController.submitAssignment.bind(userAssignmentController));
  });
});

router.get('/:id/status', authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, userAssignmentController.getAssignmentStatus.bind(userAssignmentController));
});

router.get('/:id/feedback', authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, userAssignmentController.getAssignmentFeedback.bind(userAssignmentController));
});

export default router; 