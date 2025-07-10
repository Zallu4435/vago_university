import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { getStudentDashboardComposer } from '../../../infrastructure/services/student/StudentDashboardComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';

const router = Router();
const studentDashboardController = getStudentDashboardComposer();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Dashboard routes
router.get('/', (req, res, next) => 
  expressAdapter(req, res, next, studentDashboardController.studentDashboardController.getDashboardData.bind(studentDashboardController.studentDashboardController))
);

router.get('/announcements', (req, res, next) => 
  expressAdapter(req, res, next, studentDashboardController.studentDashboardController.getAnnouncements.bind(studentDashboardController.studentDashboardController))
);

router.get('/deadlines', (req, res, next) => 
  expressAdapter(req, res, next, studentDashboardController.studentDashboardController.getDeadlines.bind(studentDashboardController.studentDashboardController))
);

router.get('/classes', (req, res, next) => 
  expressAdapter(req, res, next, studentDashboardController.studentDashboardController.getClasses.bind(studentDashboardController.studentDashboardController))
);

router.get('/online-topics', (req, res, next) => 
  expressAdapter(req, res, next, studentDashboardController.studentDashboardController.getOnlineTopics.bind(studentDashboardController.studentDashboardController))
);

router.get('/calendar-days', (req, res, next) => 
  expressAdapter(req, res, next, studentDashboardController.studentDashboardController.getCalendarDays.bind(studentDashboardController.studentDashboardController))
);

router.get('/special-dates', (req, res, next) => 
  expressAdapter(req, res, next, studentDashboardController.studentDashboardController.getSpecialDates.bind(studentDashboardController.studentDashboardController))
);

export default router; 