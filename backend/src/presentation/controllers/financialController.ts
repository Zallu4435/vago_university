import { Request, Response, NextFunction } from "express";
import { getStudentFinancialInfo } from "../../application/use-cases/financial/GetStudentFinancialInfo";
import { GetCurrentCharges } from "../../application/use-cases/financial/GetCurrentCharges";
import { GetPaymentHistory } from "../../application/use-cases/financial/GetPaymentHistory";
import { getAllPayments } from "../../application/use-cases/financial/GetAllPayments";
import { makePayment } from "../../application/use-cases/financial/MakePayment";
import { GetFinancialAidApplications } from "../../application/use-cases/financial/GetFinancialAidApplications";
import { GetAllFinancialAidApplications } from "../../application/use-cases/financial/GetAllFinancialAidApplications";
import { ApplyForFinancialAid } from "../../application/use-cases/financial/ApplyForFinancialAid";
import { GetAvailableScholarships } from "../../application/use-cases/financial/GetAvailableScholarships";
import { GetScholarshipApplications } from "../../application/use-cases/financial/GetScholarshipApplications";
import { GetAllScholarshipApplications } from "../../application/use-cases/financial/GetAllScholarshipApplications";
import { ApplyForScholarship } from "../../application/use-cases/financial/ApplyForScholarship";
import { UploadDocument } from "../../application/use-cases/financial/UploadDocument";
import { GetPaymentReceipt } from "../../application/use-cases/financial/GetPaymentReceipt";
import { UpdateFinancialAidApplication } from "../../application/use-cases/financial/UpdateFinancialAidApplication";
import { UpdateScholarshipApplication } from "../../application/use-cases/financial/UpdateScholarshipApplication";
import { createCharge } from "../../application/use-cases/financial/CreateCharge";
import { getAllCharges } from "../../application/use-cases/financial/GetAllCharges";
import { getOnePayment } from "../../application/use-cases/financial/getOnePayment";

export class FinancialController {
  async getStudentFinancialInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("User ID not found");
      const { info, history } = await getStudentFinancialInfo.execute(
        studentId
      );
      res.status(200).json({ info, history });
    } catch (err) {
      next(err);
    }
  }

  async getCurrentCharges(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("User ID not found");
      const { term } = req.query;
      const charges = await GetCurrentCharges.execute(
        studentId,
        term as string
      );
      res.status(200).json({ data: charges });
    } catch (err) {
      next(err);
    }
  }

  async getPaymentHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("User ID not found");
      const { startDate, endDate, status } = req.query;
      const payments = await GetPaymentHistory.execute(studentId, {
        startDate: startDate as string,
        endDate: endDate as string,
        status: status as "Completed" | "Pending" | "Failed",
      });
      res.status(200).json({ data: payments });
    } catch (err) {
      next(err);
    }
  }

  async getAllPayments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        startDate,
        endDate,
        status,
        page = "1",
        limit = "10",
      } = req.query;
      const result = await getAllPayments.execute({
        startDate: startDate as string,
        endDate: endDate as string,
        status: status as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
      res.status(200).json({
        data: result.data,
        totalPages: Math.ceil(result.total / parseInt(limit as string)),
      });
    } catch (err) {
      next(err);
    }
  }

  async getOnePayment (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const payment = await getOnePayment.execute(id);
      res.status(200).json(payment);
    } catch (err) {
      next(err);
    }
  }

  async makePayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("User ID not found");

      const {
        amount,
        method,
        term,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      } = req.body;

      const paymentInput = {
        amount: parseFloat(amount),
        method,
        term,
        ...(razorpayPaymentId && { razorpayPaymentId }),
        ...(razorpayOrderId && { razorpayOrderId }),
        ...(razorpaySignature && { razorpaySignature }),
      };

      const payment = await makePayment.execute(studentId, paymentInput);

      res.status(201).json({ data: payment });
    } catch (err) {
      console.error("Payment controller error:", err);
      next(err);
    }
  }

  async getFinancialAidApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("User ID not found");
      const { status } = req.query;
      const applications = await GetFinancialAidApplications.execute(
        studentId,
        status as "Approved" | "Pending" | "Rejected"
      );
      res.status(200).json({ data: applications });
    } catch (err) {
      next(err);
    }
  }

  async getAllFinancialAidApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { status, term, page = "1", limit = "10" } = req.query;
      const result = await GetAllFinancialAidApplications.execute({
        status: status as string,
        term: term as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
      res.status(200).json({
        data: result.data,
        totalPages: Math.ceil(result.total / parseInt(limit as string)),
      });
    } catch (err) {
      next(err);
    }
  }

  async applyForFinancialAid(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("User ID not found");
      const { term, amount, type, documents } = req.body;
      const application = await ApplyForFinancialAid.execute(studentId, {
        term,
        amount,
        type,
        documents,
      });
      res.status(201).json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async getAvailableScholarships(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { status, term } = req.query;
      const scholarships = await GetAvailableScholarships.execute({
        status: status as "Open" | "Closed",
        term: term as string,
      });
      res.status(200).json({ data: scholarships });
    } catch (err) {
      next(err);
    }
  }

  async getScholarshipApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("User ID not found");
      const { status } = req.query;
      const applications = await GetScholarshipApplications.execute(
        studentId,
        status as "Approved" | "Pending" | "Rejected"
      );
      res.status(200).json({ data: applications });
    } catch (err) {
      next(err);
    }
  }

  async getAllScholarshipApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { status, page = "1", limit = "10" } = req.query;
      const result = await GetAllScholarshipApplications.execute({
        status: status as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
      res.status(200).json({
        data: result.data,
        totalPages: Math.ceil(result.total / parseInt(limit as string)),
      });
    } catch (err) {
      next(err);
    }
  }

  async applyForScholarship(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("User ID not found");
      const { scholarshipId, documents } = req.body;
      const application = await ApplyForScholarship.execute(studentId, {
        scholarshipId,
        documents,
      });
      res.status(201).json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async uploadDocument(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const file = req.file;
      const { type } = req.body;
      if (!file) throw new Error("File is required");
      const result = await UploadDocument.execute(
        file,
        type as "financial-aid" | "scholarship"
      );
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  async getPaymentReceipt(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("User ID not found");
      const { paymentId } = req.params;
      const receipt = await GetPaymentReceipt.execute(studentId, paymentId);
      res.status(200).json({ data: receipt });
    } catch (err) {
      next(err);
    }
  }

  async updateFinancialAidApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("User ID not found");
      const { applicationId } = req.params;
      const { status, amount } = req.body;
      const application = await UpdateFinancialAidApplication.execute(
        studentId,
        applicationId,
        { status, amount }
      );
      res.status(200).json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async updateScholarshipApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("User ID not found");
      const { applicationId } = req.params;
      const { status } = req.body;
      const application = await UpdateScholarshipApplication.execute(
        studentId,
        applicationId,
        { status }
      );
      res.status(200).json({ data: application });
    } catch (err) {
      next(err);
    }
  }

  async createCharge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("User ID not found");

      const { title, description, amount, term, dueDate, applicableFor } =
        req.body;

      const result = await createCharge.execute({
        title,
        description,
        amount: parseFloat(amount),
        term,
        dueDate: new Date(dueDate),
        applicableFor,
        createdBy: userId, // Admin ID
      });

      res.status(201).json({
        data: {
          charge: result.charge,
          studentFinancialInfos: result.studentFinancialInfos,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllCharges(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("User ID not found");

      const { term, status, search, page = "1", limit = "10" } = req.query; // Added search
      const charges = await getAllCharges.execute({
        term: term as string,
        status: status as string,
        search: search as string, // Pass search to use case
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      res.status(200).json({
        data: charges.data,
        totalPages: Math.ceil(charges.total / parseInt(limit as string)),
      });
    } catch (err) {
      next(err);
    }
  }
}

export const financialController = new FinancialController();
