import { Router } from "express";
import admissionRoutes from './admissionRoutes';
import adminRoutes from './adminRoutes';
import auuthRoutes from './authRoutes';
import facultyRoutes from './facultyRoutes'
import profileRoutes from './profileRoutes'
import courseRoutes from './courseRoutes'

const router = Router();


router.use("/admission", admissionRoutes); 

router.use("/admin/admissions", adminRoutes); 


router.use('/admin/faculty', facultyRoutes)


router.use("/user", profileRoutes);


router.use("/auth", auuthRoutes); 

router.use('/admin/courses', courseRoutes);


export default router;
        