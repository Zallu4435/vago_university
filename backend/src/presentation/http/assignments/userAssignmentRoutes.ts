import { Router, Request, Response, NextFunction } from 'express';
import { UserAssignmentComposers } from '../../../infrastructure/services/assignments/UserAssignmentComposers';
import { assignmentSubmissionUpload } from '../../../config/cloudinary.config';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import multer from 'multer';

const router = Router();
const userAssignmentController = UserAssignmentComposers.composeUserAssignmentController();

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