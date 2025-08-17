import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { getAssignmentComposer } from '../../../infrastructure/services/assignments/AssignmentComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { assignmentUpload } from '../../../config/cloudinary.config';

const assignmentController = getAssignmentComposer();
const router = Router();

router.get('/download-submission-file', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.downloadSubmissionFile.bind(assignmentController));
});

router.get('/download-file', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.downloadFile.bind(assignmentController));
});

router.get('/analytics', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.getAnalytics.bind(assignmentController));
});

router.put('/:assignmentId/submissions/:submissionId/review', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.reviewSubmission.bind(assignmentController));
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

router.get('/:assignmentId/submissions/:submissionId/download', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.downloadSubmission.bind(assignmentController));
});

router.get('/:id/files/view', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.viewAssignmentFile.bind(assignmentController));
});



export default router; 