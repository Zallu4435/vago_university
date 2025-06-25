import { Router, Request, Response, NextFunction } from 'express';
import { UserAssignmentComposers } from '../../../infrastructure/services/assignments/UserAssignmentComposers';
import { assignmentSubmissionUpload, cloudinary } from '../../../config/cloudinary.config';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import multer from 'multer';
import axios from 'axios';

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

router.get('/', authMiddleware, (req, res) => {
  expressAdapter(req, res, userAssignmentController.getAssignments.bind(userAssignmentController));
});

router.get('/:id', authMiddleware, (req, res) => {
  expressAdapter(req, res, userAssignmentController.getAssignmentById.bind(userAssignmentController));
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