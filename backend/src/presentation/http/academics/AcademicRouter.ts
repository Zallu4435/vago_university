import { Router } from 'express';
import { getAcademicComposer } from '../../../infrastructure/services/academics/AcademicComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { expressAdapter } from '../../adapters/ExpressAdapter';

const router = Router();
const academicController = getAcademicComposer();

// Apply JWT authentication to all routes
router.use(authMiddleware);

// Routes
router.get('/student-info', (req, res) => 
  expressAdapter(req, res, academicController.getStudentInfo.bind(academicController))
);
router.get('/grade-info', (req, res) => 
  expressAdapter(req, res, academicController.getGradeInfo.bind(academicController))
);
router.get('/courses', (req, res) => 
  expressAdapter(req, res, academicController.getCourses.bind(academicController))
);
router.get('/history', (req, res) => 
  expressAdapter(req, res, academicController.getAcademicHistory.bind(academicController))
);
router.get('/program-info', (req, res) => 
  expressAdapter(req, res, academicController.getProgramInfo.bind(academicController))
);
router.get('/progress-info', (req, res) => 
  expressAdapter(req, res, academicController.getProgressInfo.bind(academicController))
);
router.get('/requirements-info', (req, res) => 
  expressAdapter(req, res, academicController.getRequirementsInfo.bind(academicController))
);
router.post('/register/:courseId', (req, res) => 
  expressAdapter(req, res, academicController.registerCourse.bind(academicController))
);
router.delete('/register/:courseId', (req, res) => 
  expressAdapter(req, res, academicController.dropCourse.bind(academicController))
);
router.post('/request-transcript', (req, res) => 
  expressAdapter(req, res, academicController.requestTranscript.bind(academicController))
);
router.post('/schedule-meeting', (req, res) => 
  expressAdapter(req, res, academicController.scheduleMeeting.bind(academicController))
);

export default router;