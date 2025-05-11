import { Router } from "express";
import { admissionController } from "../controllers/admissionController";

const router = Router();

// Create a new application draft with applicationId
router.post('/applications', admissionController.createApplication);

// Fetch application draft by applicationId
router.get('/applications/:applicationId', admissionController.getApplication);

// Save section data (e.g., personalInfo, choiceOfStudy)
router.post('/applications/:applicationId/sections/:section', admissionController.saveSection);

// Finalize admission (submit form and process payment)
router.post('/admission/finalize', admissionController.handleFinalSubmit);

export default router;