import { Router } from "express";
import admissionRoutes from "./admissionRoutes";
import adminRoutes from "./adminRoutes";
import auuthRoutes from "./authRoutes";
import facultyRoutes from "./facultyRoutes";
import profileRoutes from "./profileRoutes";
import courseRoutes from "./courseRoutes";
import clubRoutes from "./clubRoutes";
import sportRoutes from "./sportsRoutes";
import eventRoutes from "./eventsRoutes";
// import communicationRoutes from './communicationRoutes'
import campusLifeRoutes from "./campusLifeRoutes";
import academicRoutes from "./academicRoutes";
import userCommunicationRoutes from "./useCommunicationRoutes";
import financialRoutes from "./financial.route";

const router = Router();

router.use("/admission", admissionRoutes);

router.use("/admin/admissions", adminRoutes);

router.use("/admin/faculty", facultyRoutes);

router.use("/user", profileRoutes);

router.use("/auth", auuthRoutes);

router.use("/admin/courses", courseRoutes);

router.use("/admin/clubs", clubRoutes);

router.use("/admin/sports", sportRoutes);

router.use("/admin/events", eventRoutes);

// router.use('/admin/communication', communicationRoutes);

router.use("/communication", userCommunicationRoutes);

router.use("/campus-life", campusLifeRoutes);

router.use("/academic", academicRoutes);

router.use("/financial", financialRoutes);

export default router;
