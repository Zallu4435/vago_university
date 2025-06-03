import { Router } from "express";
import admissionRoutes from "./admissionRoutes";
import adminRoutes from "./adminRoutes";
import auuthRoutes from "./authRoutes";
import facultyRoutes from "./facultyRoutes";
import profileRoutes from "./profileRoutes";
import courseRoutes from "./courseRoutes";
import clubRoutes from "../http/clubs/clubRoutes";
import sportRoutes from "../http/sports/SportRoutes";
import eventRoutes from "../http/events/eventRoutes";
// import communicationRoutes from './communicationRoutes'
import campusLifeRoutes from "./campusLifeRoutes";
import academicRoutes from "./academicRoutes";
import userCommunicationRoutes from "./useCommunicationRoutes";
import financialRoutes from "./financial.route";
import notificationRoutes from './notificationRouter'
import fcmTokenRoute from './fcmTokenRoute'

const router = Router();

router.use('/fcm', fcmTokenRoute)

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

router.use("/admin/notifications", notificationRoutes);



export default router;
