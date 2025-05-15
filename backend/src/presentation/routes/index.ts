import { Router } from "express";
import admissionRoutes from './admissionRoutes';
import adminRoutes from './adminRoutes';
import auuthRoutes from './authRoutes';

const router = Router();


router.use("/admission", admissionRoutes); 

router.use("/admin/admissions", adminRoutes); 


router.use("/auth", auuthRoutes); 


export default router;
        