import { Router } from "express";
import admissionRoutes from "../http/admission/admissionRouter";
import adminRoutes from "../http/admin/admissionRouter";
import auuthRoutes from "../http/auth/authRouter";
import facultyRoutes from "../http/faculty/facultyRouter";
import profileRoutes from "../http/profile/profileRouter";
import courseRoutes from "../http/courses/coursesRoutes";
import clubRoutes from "../http/clubs/clubRoutes";
import sportRoutes from "../http/sports/SportRoutes";
import eventRoutes from "../http/events/eventRoutes";
import communicationRoutes from '../http/communication/CommunicationRouter'
import campusLifeRoutes from "../http/campus-life/campusLifeRoutes";
import academicRoutes from "../http/academics/AcademicRouter";
import financialRoutes from "../http/financial/financialRouter";
import notificationRoutes from '../http/notifications/notificationRouter'
import fcmTokenRoute from './fcmTokenRoute'
import diplomaRoutes from '../http/diploma/DiplomaRouter'
import vedioRoutes from '../http/vedios/vedioRoutes'
import materialRoutes from '../http/materials/materialRoutes'
import userMaterialRoutes from '../http/materials/userMaterialRoutes'
import assignmentRoutes from '../http/assignments/assignmentRoutes'
import userAssignmentRoutes from '../http/assignments/userAssignmentRoutes'
import userDiplomaRoutes from '../http/diploma/UserDiplomaRouter'


const router = Router();

router.use("/diploma-courses", userDiplomaRoutes);

router.use("/admin/materials", materialRoutes);

router.use("/materials", userMaterialRoutes);

router.use("/assignments", userAssignmentRoutes);

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

router.use('/communication', communicationRoutes);

router.use("/campus-life", campusLifeRoutes);

router.use("/academic", academicRoutes);

router.use("/financial", financialRoutes);

router.use("/admin/notifications", notificationRoutes);

router.use("/admin/diploma-courses", diplomaRoutes);

router.use("/admin/vedio", vedioRoutes);

router.use("/faculty/assignments", assignmentRoutes);




export default router;
