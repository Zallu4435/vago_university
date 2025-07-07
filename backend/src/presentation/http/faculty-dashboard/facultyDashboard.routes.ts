import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getFacultyDashboardComposer } from "../../../infrastructure/services/faculty/FacultyDashboardComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const router = Router();
const facultyDashboardController = getFacultyDashboardComposer();

router.use(authMiddleware);

router.get("/stats", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getDashboardStats.bind(facultyDashboardController)));

router.get("/data", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getDashboardData.bind(facultyDashboardController)));

router.get("/weekly-attendance", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getWeeklyAttendance.bind(facultyDashboardController)));

router.get("/assignment-performance", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getCoursePerformance.bind(facultyDashboardController)));

router.get("/session-distribution", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getSessionDistribution.bind(facultyDashboardController)));

router.get("/recent-activities", (req, res, next) => expressAdapter(req, res, facultyDashboardController.getRecentActivities.bind(facultyDashboardController)));



export default router; 