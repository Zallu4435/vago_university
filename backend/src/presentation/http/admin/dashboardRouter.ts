import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { getAdminDashboardComposer } from '../../../infrastructure/services/admin/DashboardComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';

const router = Router();
const adminDashboardController = getAdminDashboardComposer();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Dashboard routes
router.get('/', (req, res, next) => 
  expressAdapter(req, res, adminDashboardController.adminDashboardController.getDashboardData.bind(adminDashboardController.adminDashboardController))
);

router.get('/metrics', (req, res, next) => 
  expressAdapter(req, res, adminDashboardController.adminDashboardController.getDashboardMetrics.bind(adminDashboardController.adminDashboardController))
);

router.get('/user-growth', (req, res, next) => 
  expressAdapter(req, res, adminDashboardController.adminDashboardController.getUserGrowthData.bind(adminDashboardController.adminDashboardController))
);

router.get('/revenue', (req, res, next) => 
  expressAdapter(req, res, adminDashboardController.adminDashboardController.getRevenueData.bind(adminDashboardController.adminDashboardController))
);

router.get('/performance', (req, res, next) => 
  expressAdapter(req, res, adminDashboardController.adminDashboardController.getPerformanceData.bind(adminDashboardController.adminDashboardController))
);

router.get('/activities', (req, res, next) => 
  expressAdapter(req, res, adminDashboardController.adminDashboardController.getRecentActivities.bind(adminDashboardController.adminDashboardController))
);

router.get('/alerts', (req, res, next) => 
  expressAdapter(req, res, adminDashboardController.adminDashboardController.getSystemAlerts.bind(adminDashboardController.adminDashboardController))
);

router.post('/refresh', (req, res, next) => 
  expressAdapter(req, res, adminDashboardController.adminDashboardController.refreshDashboard.bind(adminDashboardController.adminDashboardController))
);

router.delete('/alerts/:alertId', (req, res, next) => 
  expressAdapter(req, res, adminDashboardController.adminDashboardController.dismissAlert.bind(adminDashboardController.adminDashboardController))
);

router.patch('/activities/:activityId/read', (req, res, next) => 
  expressAdapter(req, res, adminDashboardController.adminDashboardController.markActivityAsRead.bind(adminDashboardController.adminDashboardController))
);

export default router; 