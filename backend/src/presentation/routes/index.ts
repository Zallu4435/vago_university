import { Router } from "express";
import admissionRoutes from './admissionRoutes';
import adminRoutes from './adminRoutes';
import auuthRoutes from './authRoutes';
import facultyRoutes from './facultyRoutes'

const router = Router();


router.use("/admission", admissionRoutes); 

router.use("/admin/admissions", adminRoutes); 


router.use('/admin/faculty', facultyRoutes)



router.use("/auth", auuthRoutes); 


export default router;
        