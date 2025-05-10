import { Router } from "express";
import { admissionController } from "../controllers/admissionController";

const router = Router();

router.post('/admission/personal', admissionController.handlePersonalSave);
router.post('/admission/finalize', admissionController.handleFinalSubmit);

export default router;
