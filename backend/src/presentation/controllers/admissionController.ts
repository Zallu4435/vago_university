import { Request, Response, NextFunction } from "express";
import { savePersonal } from "../../application/use-cases/admission/savePersonal";
import { finalizeAdmission } from "../../application/use-cases/admission/finalizeAdmission";

class AdmissionController {
    async handlePersonalSave(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const data = req.body;

            const result = await savePersonal.execute(userId, data);
            res.status(200).json({ message: 'Step saved', draft: result })
        } catch (err) {
            next (err)
        }
    }

    async handleFinalSubmit (req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const paymentDetails = req.body;

            const result = await finalizeAdmission.execute(userId, paymentDetails);
            res.status(200).json({ message: 'Admission finalized', admission: result });
        } catch (err) {
            next (err)
        }
    }
}

export const admissionController = new AdmissionController();
