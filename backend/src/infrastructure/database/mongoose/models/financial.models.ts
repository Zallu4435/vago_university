import mongoose from 'mongoose';

interface StudentFinancialInfo extends mongoose.Document {
  studentId: mongoose.Types.ObjectId;
  name: string;
  accountBalance: number;
  paymentDueDate: Date;
  financialAidStatus: 'Approved' | 'Pending' | 'Rejected';
  term: string;
}

interface Charge extends mongoose.Document {
  studentId: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'Paid' | 'Pending' | 'Overdue';
  term: string;
}

interface Payment extends mongoose.Document {
  studentId: mongoose.Types.ObjectId;
  date: Date;
  description: string;
  method: 'Credit Card' | 'Bank Transfer' | 'Financial Aid';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  receiptUrl?: string;
}

interface FinancialAidApplication extends mongoose.Document {
  studentId: mongoose.Types.ObjectId;
  term: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  amount: number;
  type: 'Grant' | 'Loan' | 'Scholarship';
  applicationDate: Date;
  documents: Array<{
    id: string;
    name: string;
    url: string;
    status: 'Verified' | 'Pending' | 'Rejected';
  }>;
}

interface Scholarship extends mongoose.Document {
  name: string;
  description: string;
  amount: number;
  deadline: Date;
  requirements: string[];
  status: 'Open' | 'Closed';
  term: string;
}

interface ScholarshipApplication extends mongoose.Document {
  scholarshipId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  status: 'Approved' | 'Pending' | 'Rejected';
  applicationDate: Date;
  documents: Array<{
    id: string;
    name: string;
    url: string;
    status: 'Verified' | 'Pending' | 'Rejected';
  }>;
}

const StudentFinancialInfoSchema = new mongoose.Schema<StudentFinancialInfo>({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  accountBalance: { type: Number, required: true },
  paymentDueDate: { type: Date, required: true },
  financialAidStatus: { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending' },
  term: { type: String, required: true },
}, { timestamps: true });

const ChargeSchema = new mongoose.Schema<Charge>({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  term: { type: String, required: true },
}, { timestamps: true });

const PaymentSchema = new mongoose.Schema<Payment>({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  method: { type: String, enum: ['Credit Card', 'Bank Transfer', 'Financial Aid'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Pending' },
  receiptUrl: { type: String },
}, { timestamps: true });

const FinancialAidApplicationSchema = new mongoose.Schema<FinancialAidApplication>({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  term: { type: String, required: true },
  status: { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Grant', 'Loan', 'Scholarship'], required: true },
  applicationDate: { type: Date, required: true },
  documents: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    status: { type: String, enum: ['Verified', 'Pending', 'Rejected'], default: 'Pending' },
  }],
}, { timestamps: true });

const ScholarshipSchema = new mongoose.Schema<Scholarship>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  deadline: { type: Date, required: true },
  requirements: [{ type: String }],
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  term: { type: String, required: true },
}, { timestamps: true });

const ScholarshipApplicationSchema = new mongoose.Schema<ScholarshipApplication>({
  scholarshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending' },
  applicationDate: { type: Date, required: true },
  documents: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    status: { type: String, enum: ['Verified', 'Pending', 'Rejected'], default: 'Pending' },
  }],
}, { timestamps: true });

export const StudentFinancialInfoModel = mongoose.model<StudentFinancialInfo>('StudentFinancialInfo', StudentFinancialInfoSchema);
export const ChargeModel = mongoose.model<Charge>('Charge', ChargeSchema);
export const PaymentModel = mongoose.model<Payment>('FinancialPayment', PaymentSchema);
export const FinancialAidApplicationModel = mongoose.model<FinancialAidApplication>('FinancialAidApplication', FinancialAidApplicationSchema);
export const ScholarshipModel = mongoose.model<Scholarship>('Scholarship', ScholarshipSchema);
export const ScholarshipApplicationModel = mongoose.model<ScholarshipApplication>('ScholarshipApplication', ScholarshipApplicationSchema);