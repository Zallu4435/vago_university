import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { getAssignmentComposer } from '../../../infrastructure/services/assignments/AssignmentComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { assignmentUpload } from '../../../config/cloudinary.config';

const assignmentController = getAssignmentComposer();
const router = Router();

router.get('/download-submission-file', authMiddleware, async (req, res) => {
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

        const response = {
            success: true,
            fileUrl: fileUrl,
            fileName: cleanFileName,
            message: 'Use window.open to download the file directly',
            directDownload: true
        };

        res.json(response);
        
    } catch (err) {
        if (err instanceof Error) {
            console.error('❌ Error name:', err.name);
        }
        
        console.error('=== ASSIGNMENT SUBMISSION FILE DOWNLOAD ERROR END ===');
        res.status(500).send('Download failed');
    }
});


router.get('/', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.getAssignments.bind(assignmentController));
});

router.get('/:id', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.getAssignmentById.bind(assignmentController));
});

router.post('/',
    authMiddleware,
    assignmentUpload.array('files', 5),
    (req, res, next) => {
        expressAdapter(req, res, next, assignmentController.createAssignment.bind(assignmentController));
    }
);

router.put('/:id', authMiddleware, assignmentUpload.array('files', 5), (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.updateAssignment.bind(assignmentController));
});

router.delete('/:id', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.deleteAssignment.bind(assignmentController));
});

router.get('/:assignmentId/submissions', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.getSubmissions.bind(assignmentController));
});

router.get('/:assignmentId/submissions/:submissionId', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.getSubmissionById.bind(assignmentController));
});

router.put('/:assignmentId/submissions/:submissionId/review', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.reviewSubmission.bind(assignmentController));
});

router.get('/analytics', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.getAnalytics.bind(assignmentController));
});



export default router; 