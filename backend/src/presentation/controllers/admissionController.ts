import { Request, Response, NextFunction } from "express";
import { createApplication } from "../../application/use-cases/admission/createApplication";
import { getApplication } from "../../application/use-cases/admission/getApplication";
import { saveSection } from "../../application/use-cases/admission/saveSection";
import { finalizeAdmission } from "../../application/use-cases/admission/finalizeAdmission";
import { processPayment } from "../../application/use-cases/admission/processPayment";

class AdmissionController {
  async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId } = req.body;
      console.log(
        `Received POST /api/applications with applicationId: ${applicationId}`
      );
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
      console.log(
        `Received POST /api/applications/${applicationId}/sections/${section}`,
        data
      );
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

  async processPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId, paymentDetails } = req.body;
      console.log(
        `Received POST /api/payment/process with applicationId: ${applicationId}`,
        paymentDetails
      );
      if (!applicationId || !paymentDetails) {
        return res
          .status(400)
          .json({ error: "applicationId and paymentDetails are required" });
      }
      const paymentResult = await processPayment.execute(
        applicationId,
        paymentDetails
      );
      if (!paymentResult.paymentId) {
        return res.status(400).json({
          message: "Payment processing incomplete",
          paymentId: null,
          status: paymentResult.status,
        });
      }
      res.status(200).json({
        message: paymentResult.message || "Payment processed successfully",
        paymentId: paymentResult.paymentId,
        status: paymentResult.status,
      });
    } catch (err: any) {
      console.error(`Error in processPayment:`, err);
      res
        .status(500)
        .json({ error: err.message || "Payment processing failed" });
      // next(err); // Avoid middleware error handling to send JSON response
    }
  }

  async handleFinalSubmit(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId, paymentId } = req.body;

      console.log(
        `Received POST /api/admission/finalize with applicationId: ${applicationId}, paymentId: ${paymentId}`
      );

      if (!applicationId || !paymentId) {
        return res
          .status(400)
          .json({ error: "applicationId and paymentId are required" });
      }

      const result = await finalizeAdmission.execute(applicationId, paymentId);

      res
        .status(200)
        .json({ message: "Admission finalized", admission: result });
    } catch (err) {
      console.error(`Error in handleFinalSubmit:`, err);
      next(err);
    }
  }
}

export const admissionController = new AdmissionController();
