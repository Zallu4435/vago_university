import { Router, Request, Response, NextFunction } from 'express';
import { getUserAssignmentComposer } from '../../../infrastructure/services/assignments/UserAssignmentComposers';
import { assignmentSubmissionUpload, cloudinary } from '../../../config/cloudinary.config';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import multer from 'multer';
const fetch = require('node-fetch');

const router = Router();
const userAssignmentController = getUserAssignmentComposer();


router.get('/download-reference-file', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileUrl, fileName } = req.query;

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

    let cleanFileName = fileName.replace(/\s+/g, '_');
    cleanFileName = cleanFileName.replace(/[^a-zA-Z0-9._-]/g, '');
    cleanFileName = cleanFileName.replace(/"/g, '');

    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      console.error('❌ Error: Failed to fetch file from URL');
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      res.status(500).send('Failed to fetch file');
      return;
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = `attachment; filename="${cleanFileName}"`;

    res.setHeader('Content-Disposition', contentDisposition);
    res.setHeader('Content-Type', contentType);
    response.body.pipe(res);
    
  } catch (err) {
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
  assignmentSubmissionUpload.single('file')(req, res, (err) => {
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
    }
    
    if (err) {
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