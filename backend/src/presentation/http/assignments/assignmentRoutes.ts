import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { AssignmentComposers } from '../../../infrastructure/services/assignments/AssignmentComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import express from 'express';
import { assignmentUpload } from '../../../config/cloudinary.config';

const assignmentController = AssignmentComposers.composeAssignmentController();
const router = Router();

// Analytics routes
router.get('/analytics', authMiddleware, (req, res) => {
    expressAdapter(req, res, assignmentController.getAnalytics.bind(assignmentController));
});


// Assignment routes
router.get('/', authMiddleware, (req, res) => {
    expressAdapter(req, res, assignmentController.getAssignments.bind(assignmentController));
});

router.get('/:id', authMiddleware, (req, res) => {
    expressAdapter(req, res, assignmentController.getAssignmentById.bind(assignmentController));
});

router.post('/',
    authMiddleware,
    assignmentUpload.array('files', 5),
    (req, res) => {
        expressAdapter(req, res, assignmentController.createAssignment.bind(assignmentController));
    }
);

router.put('/:id', authMiddleware, (req, res) => {
    expressAdapter(req, res, assignmentController.updateAssignment.bind(assignmentController));
});

router.delete('/:id', authMiddleware, (req, res) => {
    expressAdapter(req, res, assignmentController.deleteAssignment.bind(assignmentController));
});

// Submission routes
router.get('/:assignmentId/submissions', authMiddleware, (req, res) => {
    expressAdapter(req, res, assignmentController.getSubmissions.bind(assignmentController));
});

router.get('/:assignmentId/submissions/:submissionId', authMiddleware, (req, res) => {
    expressAdapter(req, res, assignmentController.getSubmissionById.bind(assignmentController));
});

router.post('/:assignmentId/submissions/:submissionId/review', authMiddleware, (req, res) => {
    expressAdapter(req, res, assignmentController.reviewSubmission.bind(assignmentController));
});

router.get('/:assignmentId/submissions/:submissionId/download', authMiddleware, (req, res) => {
    expressAdapter(req, res, assignmentController.downloadSubmission.bind(assignmentController));
});

export default router; 