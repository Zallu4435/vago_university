import { Request, Response, NextFunction } from "express";
import { createApplication } from "../../application/use-cases/admission/createApplication";
import { getApplication } from "../../application/use-cases/admission/getApplication";
import { saveSection } from "../../application/use-cases/admission/saveSection";
import { finalizeAdmission } from "../../application/use-cases/admission/finalizeAdmission";

class AdmissionController {
  async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId } = req.body;
      console.log(`Received POST /api/applications with applicationId: ${applicationId}`);
      if (!applicationId) {
        return res.status(400).json({ error: "applicationId is required" });
      }
      const draft = await createApplication.execute(applicationId);
      res.status(201).json({ message: "Application draft created", draft });
    } catch (err) {
      console.error(`Error in createApplication:`, err);
      next(err);
    }
  }

  async getApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId } = req.params;
      console.log(`Received GET /api/applications/${applicationId}`);
      const draft = await getApplication.execute(applicationId);
      if (!draft) {
        return res.status(404).json({ error: "Application draft not found" });
      }
      res.status(200).json(draft);
    } catch (err) {
      console.error(`Error in getApplication:`, err);
      next(err);
    }
  }

  async saveSection(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId, section } = req.params;
      const data = req.body;
      console.log(`Received POST /api/applications/${applicationId}/sections/${section}`, data);
      const validSections = [
        "personalInfo",
        "choiceOfStudy",
        "education",
        "achievements",
        "otherInformation",
        "documents",
        "declaration",
      ];
      if (!validSections.includes(section)) {
        return res.status(400).json({ error: "Invalid section" });
      }
      const draft = await saveSection.execute(applicationId, section, data);
      res.status(200).json({ message: "Section saved", draft });
    } catch (err) {
      console.error(`Error in saveSection:`, err);
      next(err);
    }
  }

  async handleFinalSubmit(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId, paymentDetails } = req.body;
      console.log(`Received POST /api/admission/finalize with applicationId: ${applicationId}`);
      if (!applicationId || !paymentDetails) {
        return res.status(400).json({ error: "applicationId and paymentDetails are required" });
      }
      const result = await finalizeAdmission.execute(applicationId, paymentDetails);
      res.status(200).json({ message: "Admission finalized", admission: result });
    } catch (err) {
      console.error(`Error in handleFinalSubmit:`, err);
      next(err);
    }
  }
}

export const admissionController = new AdmissionController();