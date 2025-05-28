import { Router } from 'express';
import { academicController } from '../controllers/academicController';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

// Apply JWT authentication to all routes
router.use(authMiddleware);

// Student Information
router.get('/student-info', academicController.getStudentInfo);

// Grade Information
router.get('/grade-info', academicController.getGradeInfo);

// Courses
router.get('/courses', academicController.getCourses);

// Academic History
router.get('/history', academicController.getAcademicHistory);

// Program Information
router.get('/program-info', academicController.getProgramInfo);

// Progress Information
router.get('/progress-info', academicController.getProgressInfo);

// Requirements Information
router.get('/requirements-info', academicController.getRequirementsInfo);

// Register for a Course
router.post('/register/:courseId', academicController.registerCourse);

// Drop a Course
router.delete('/register/:courseId', academicController.dropCourse);

// Request Transcript
router.post('/request-transcript', academicController.requestTranscript);

// Schedule Meeting
router.post('/schedule-meeting', academicController.scheduleMeeting);

export default router;