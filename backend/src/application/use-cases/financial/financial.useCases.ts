import {
  StudentFinancialInfoModel,
  ChargeModel,
  PaymentModel,
  FinancialAidApplicationModel,
  ScholarshipModel,
  ScholarshipApplicationModel,
} from '../../../infrastructure/database/mongoose/models/financial.model';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface PaymentInput {
  amount: number;
  method: 'Credit Card' | 'Bank Transfer' | 'Financial Aid';
  term: string;
}

interface FinancialAidInput {
  term: string;
  amount: number;
  type: 'Grant' | 'Loan' | 'Scholarship';
  documents: Array<{ name: string; url: string }>;
}

interface ScholarshipApplicationInput {
  scholarshipId: string;
  documents: Array<{ name: string; url: string }>;
}

interface UpdateFinancialAidInput {
  status?: 'Approved' | 'Pending' | 'Rejected';
  amount?: number;
}

interface UpdateScholarshipInput {
  status?: 'Approved' | 'Pending' | 'Rejected';
}

export class GetStudentFinancialInfo {
  async execute(studentId: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      const info = await StudentFinancialInfoModel.findOne({ studentId }).lean();
      if (!info) throw new Error('No financial information found for this student');
      return {
        id: info._id.toString(),
        name: info.name,
        accountBalance: info.accountBalance,
        paymentDueDate: info.paymentDueDate.toISOString(),
        financialAidStatus: info.financialAidStatus,
        term: info.term,
      };
    } catch (err) {
      console.error('GetStudentFinancialInfo Error:', err);
      throw new Error(`Failed to fetch financial info: ${err.message}`);
    }
  }
}

export class GetCurrentCharges {
  async execute(studentId: string, term?: string): Promise<any[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      const query: any = { studentId };
      if (term) query.term = term;
      const charges = await ChargeModel.find(query).lean();
      if (!charges.length) return [];
      return charges.map(charge => ({
        id: charge._id.toString(),
        description: charge.description,
        amount: charge.amount,
        dueDate: charge.dueDate.toISOString(),
        status: charge.status,
        term: charge.term,
      }));
    } catch (err) {
      console.error('GetCurrentCharges Error:', err);
      throw new Error(`Failed to fetch charges: ${err.message}`);
    }
  }
}

export class GetPaymentHistory {
  async execute(studentId: string, filters: { startDate?: string; endDate?: string; status?: string }): Promise<any[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      const query: any = { studentId };
      if (filters.startDate) query.date = { $gte: new Date(filters.startDate) };
      if (filters.endDate) query.date = { ...query.date, $lte: new Date(filters.endDate) };
      if (filters.status) query.status = filters.status;
      const payments = await PaymentModel.find(query).lean();
      if (!payments.length) return [];
      return payments.map(payment => ({
        id: payment._id.toString(),
        date: payment.date.toISOString(),
        description: payment.description,
        method: payment.method,
        amount: payment.amount,
        status: payment.status,
        receiptUrl: payment.receiptUrl,
      }));
    } catch (err) {
      console.error('GetPaymentHistory Error:', err);
      throw new Error(`Failed to fetch payment history: ${err.message}`);
    }
  }
}

export class GetAllPayments {
  async execute(filters: { startDate?: string; endDate?: string; status?: string; page: number; limit: number }): Promise<{ data: any[]; total: number }> {
    try {
      const query: any = {};
      if (filters.startDate) query.date = { $gte: new Date(filters.startDate) };
      if (filters.endDate) query.date = { ...query.date, $lte: new Date(filters.endDate) };
      if (filters.status) query.status = filters.status;

      const total = await PaymentModel.countDocuments(query);
      const payments = await PaymentModel.find(query)
        .skip((filters.page - 1) * filters.limit)
        .limit(filters.limit)
        .lean();

      return {
        data: payments.map(payment => ({
          id: payment._id.toString(),
          studentId: payment.studentId,
          date: payment.date.toISOString(),
          description: payment.description,
          method: payment.method,
          amount: payment.amount,
          status: payment.status,
          receiptUrl: payment.receiptUrl,
        })),
        total,
      };
    } catch (err) {
      console.error('GetAllPayments Error:', err);
      throw new Error(`Failed to fetch payments: ${err.message}`);
    }
  }
}

export class MakePayment {
  async execute(studentId: string, input: PaymentInput): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      if (input.amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }
      const payment = new PaymentModel({
        studentId,
        date: new Date(),
        description: `Payment for ${input.term}`,
        method: input.method,
        amount: input.amount,
        status: 'Completed',
      });
      await payment.save();
      return {
        id: payment._id.toString(),
        date: payment.date.toISOString(),
        description: payment.description,
        method: payment.method,
        amount: payment.amount,
        status: payment.status,
      };
    } catch (err) {
      console.error('MakePayment Error:', err);
      throw new Error(`Failed to make payment: ${err.message}`);
    }
  }
}

export class GetFinancialAidApplications {
  async execute(studentId: string, status?: string): Promise<any[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      const query: any = { studentId };
      if (status) query.status = status;
      const applications = await FinancialAidApplicationModel.find(query).lean();
      if (!applications.length) return [];
      return applications.map(app => ({
        id: app._id.toString(),
        studentId: app.studentId.toString(),
        term: app.term,
        status: app.status,
        amount: app.amount,
        type: app.type,
        applicationDate: app.applicationDate.toISOString(),
        documents: app.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          url: doc.url,
          status: doc.status,
        })),
      }));
    } catch (err) {
      console.error('GetFinancialAidApplications Error:', err);
      throw new Error(`Failed to fetch financial aid applications: ${err.message}`);
    }
  }
}

export class GetAllFinancialAidApplications {
  async execute(filters: { status?: string; term?: string; page: number; limit: number }): Promise<{ data: any[]; total: number }> {
    try {
      const query: any = {};
      if (filters.status) query.status = filters.status;
      if (filters.term) query.term = filters.term;

      const total = await FinancialAidApplicationModel.countDocuments(query);
      const applications = await FinancialAidApplicationModel.find(query)
        .skip((filters.page - 1) * filters.limit)
        .limit(filters.limit)
        .lean();

      return {
        data: applications.map(app => ({
          id: app._id.toString(),
          studentId: app.studentId.toString(),
          term: app.term,
          status: app.status,
          amount: app.amount,
          type: app.type,
          applicationDate: app.applicationDate.toISOString(),
          documents: app.documents.map(doc => ({
            id: doc.id,
            name: doc.name,
            url: doc.url,
            status: doc.status,
          })),
        })),
        total,
      };
    } catch (err) {
      console.error('GetAllFinancialAidApplications Error:', err);
      throw new Error(`Failed to fetch financial aid applications: ${err.message}`);
    }
  }
}

export class ApplyForFinancialAid {
  async execute(studentId: string, input: FinancialAidInput): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      if (input.amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }
      if (!input.documents.length) {
        throw new Error('At least one document is required');
      }
      const application = new FinancialAidApplicationModel({
        studentId,
        term: input.term,
        status: 'Pending',
        amount: input.amount,
        type: input.type,
        applicationDate: new Date(),
        documents: input.documents.map(doc => ({
          id: uuidv4(),
          name: doc.name,
          url: doc.url,
          status: 'Pending',
        })),
      });
      await application.save();
      return {
        id: application._id.toString(),
        studentId: application.studentId.toString(),
        term: application.term,
        status: application.status,
        amount: application.amount,
        type: application.type,
        applicationDate: application.applicationDate.toISOString(),
        documents: application.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          url: doc.url,
          status: doc.status,
        })),
      };
    } catch (err) {
      console.error('ApplyForFinancialAid Error:', err);
      throw new Error(`Failed to apply for financial aid: ${err.message}`);
    }
  }
}

export class GetAvailableScholarships {
  async execute(filters: { status?: string; term?: string }): Promise<any[]> {
    try {
      const query: any = {};
      if (filters.status) query.status = filters.status;
      if (filters.term) query.term = filters.term;
      const scholarships = await ScholarshipModel.find(query).lean();
      if (!scholarships.length) return [];
      return scholarships.map(s => ({
        id: s._id.toString(),
        name: s.name,
        description: s.description,
        amount: s.amount,
        deadline: s.deadline.toISOString(),
        requirements: s.requirements,
        status: s.status,
        term: s.term,
      }));
    } catch (err) {
      console.error('GetAvailableScholarships Error:', err);
      throw new Error(`Failed to fetch scholarships: ${err.message}`);
    }
  }
}

export class GetScholarshipApplications {
  async execute(studentId: string, status?: string): Promise<any[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      const query: any = { studentId };
      if (status) query.status = status;
      const applications = await ScholarshipApplicationModel.find(query).lean();
      if (!applications.length) return [];
      return applications.map(app => ({
        id: app._id.toString(),
        scholarshipId: app.scholarshipId.toString(),
        studentId: app.studentId.toString(),
        status: app.status,
        applicationDate: app.applicationDate.toISOString(),
        documents: app.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          url: doc.url,
          status: doc.status,
        })),
      }));
    } catch (err) {
      console.error('GetScholarshipApplications Error:', err);
      throw new Error(`Failed to fetch scholarship applications: ${err.message}`);
    }
  }
}

export class GetAllScholarshipApplications {
  async execute(filters: { status?: string; page: number; limit: number }): Promise<{ data: any[]; total: number }> {
    try {
      const query: any = {};
      if (filters.status) query.status = filters.status;

      const total = await ScholarshipApplicationModel.countDocuments(query);
      const applications = await ScholarshipApplicationModel.find(query)
        .skip((filters.page - 1) * filters.limit)
        .limit(filters.limit)
        .lean();

      return {
        data: applications.map(app => ({
          id: app._id.toString(),
          scholarshipId: app.scholarshipId.toString(),
          studentId: app.studentId.toString(),
          status: app.status,
          applicationDate: app.applicationDate.toISOString(),
          documents: app.documents.map(doc => ({
            id: doc.id,
            name: doc.name,
            url: doc.url,
            status: doc.status,
          })),
        })),
        total,
      };
    } catch (err) {
      console.error('GetAllScholarshipApplications Error:', err);
      throw new Error(`Failed to fetch scholarship applications: ${err.message}`);
    }
  }
}

export class ApplyForScholarship {
  async execute(studentId: string, input: ScholarshipApplicationInput): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      if (!mongoose.Types.ObjectId.isValid(input.scholarshipId)) {
        throw new Error('Invalid scholarship ID');
      }
      const scholarship = await ScholarshipModel.findById(input.scholarshipId);
      if (!scholarship) {
        throw new Error('No scholarship found with the provided ID');
      }
      if (scholarship.status === 'Closed') {
        throw new Error('Scholarship application is closed');
      }
      const application = new ScholarshipApplicationModel({
        scholarshipId: input.scholarshipId,
        studentId,
        status: 'Pending',
        applicationDate: new Date(),
        documents: input.documents.map(doc => ({
          id: uuidv4(),
          name: doc.name,
          url: doc.url,
          status: 'Pending',
        })),
      });
      await application.save();
      return {
        id: application._id.toString(),
        scholarshipId: application.scholarshipId.toString(),
        studentId: application.studentId.toString(),
        status: application.status,
        applicationDate: application.applicationDate.toISOString(),
        documents: application.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          url: doc.url,
          status: doc.status,
        })),
      };
    } catch (err) {
      console.error('ApplyForScholarship Error:', err);
      throw new Error(`Failed to apply for scholarship: ${err.message}`);
    }
  }
}

export class UploadDocument {
  async execute(file: Express.Multer.File, type: 'financial-aid' | 'scholarship'): Promise<any> {
    try {
      if (!file) {
        throw new Error('File is required');
      }
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `financial/${type}`,
            public_id: `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
      return { url: (result as any).secure_url };
    } catch (err) {
      console.error('UploadDocument Error:', err);
      throw new Error(`Failed to upload document: ${err.message}`);
    }
  }
}

export class GetPaymentReceipt {
  async execute(studentId: string, paymentId: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(paymentId)) {
        throw new Error('Invalid student or payment ID');
      }
      const payment = await PaymentModel.findOne({ _id: paymentId, studentId }).lean();
      if (!payment) throw new Error('No payment found with the provided ID');
      if (!payment.receiptUrl) throw new Error('No receipt available for this payment');
      return { url: payment.receiptUrl };
    } catch (err) {
      console.error('GetPaymentReceipt Error:', err);
      throw new Error(`Failed to fetch receipt: ${err.message}`);
    }
  }
}

export class UpdateFinancialAidApplication {
  async execute(studentId: string, applicationId: string, input: UpdateFinancialAidInput): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new Error('Invalid student or application ID');
      }
      if (input.amount !== undefined && input.amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }
      const application = await FinancialAidApplicationModel.findOneAndUpdate(
        { _id: applicationId, studentId },
        { $set: input },
        { new: true }
      ).lean();
      if (!application) throw new Error('No financial aid application found with the specified ID');
      return {
        id: application._id.toString(),
        studentId: application.studentId.toString(),
        term: application.term,
        status: application.status,
        amount: application.amount,
        type: application.type,
        applicationDate: application.applicationDate.toISOString(),
        documents: application.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          url: doc.url,
          status: doc.status,
        })),
      };
    } catch (err) {
      console.error('UpdateFinancialAidApplication Error:', err);
      throw new Error(`Failed to update financial aid application: ${err.message}`);
    }
  }
}

export class UpdateScholarshipApplication {
  async execute(studentId: string, applicationId: string, input: UpdateScholarshipInput): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new Error('Invalid student or application ID');
      }
      const application = await ScholarshipApplicationModel.findOneAndUpdate(
        { _id: applicationId, studentId },
        { $set: input },
        { new: true }
      ).lean();
      if (!application) throw new Error('No scholarship application found with the specified ID');
      return {
        id: application._id.toString(),
        scholarshipId: application.scholarshipId.toString(),
        studentId: application.studentId.toString(),
        status: application.status,
        applicationDate: application.applicationDate.toISOString(),
        documents: application.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          url: doc.url,
          status: doc.status,
        })),
      };
    } catch (err) {
      console.error('UpdateScholarshipApplication Error:', err);
      throw new Error(`Failed to update scholarship application: ${err.message}`);
    }
  }
}

export const getStudentFinancialInfo = new GetStudentFinancialInfo();
export const getCurrentCharges = new GetCurrentCharges();
export const getPaymentHistory = new GetPaymentHistory();
export const getAllPayments = new GetAllPayments();
export const makePayment = new MakePayment();
export const getFinancialAidApplications = new GetFinancialAidApplications();
export const getAllFinancialAidApplications = new GetAllFinancialAidApplications();
export const applyForFinancialAid = new ApplyForFinancialAid();
export const getAvailableScholarships = new GetAvailableScholarships();
export const getScholarshipApplications = new GetScholarshipApplications();
export const getAllScholarshipApplications = new GetAllScholarshipApplications();
export const applyForScholarship = new ApplyForScholarship();
export const uploadDocument = new UploadDocument();
export const getPaymentReceipt = new GetPaymentReceipt();
export const updateFinancialAidApplication = new UpdateFinancialAidApplication();
export const updateScholarshipApplication = new UpdateScholarshipApplication();