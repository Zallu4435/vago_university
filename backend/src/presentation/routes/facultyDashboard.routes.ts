import { Router } from "express";
import { expressAdapter } from "../adapters/ExpressAdapter";
import { getFacultyDashboardComposer } from "../../infrastructure/services/faculty/FacultyDashboardComposers";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";

const router = Router();
const facultyDashboardController = getFacultyDashboardComposer();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get dashboard stats
router.get("/stats", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getDashboardStats.bind(facultyDashboardController)));

// Get complete dashboard data
router.get("/data", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getDashboardData.bind(facultyDashboardController)));

// Get weekly attendance data
router.get("/weekly-attendance", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getWeeklyAttendance.bind(facultyDashboardController)));

// Get course performance data
router.get("/course-performance", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getCoursePerformance.bind(facultyDashboardController)));

// Get session distribution data
router.get("/session-distribution", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getSessionDistribution.bind(facultyDashboardController)));

// Get recent activities
router.get("/recent-activities", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getRecentActivities.bind(facultyDashboardController)));

// Get system status
router.get("/system-status", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getSystemStatus.bind(facultyDashboardController)));

export default router; 