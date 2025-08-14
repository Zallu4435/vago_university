import mongoose from "mongoose";

interface StudentFinancialInfo extends mongoose.Document {
  studentId: mongoose.Types.ObjectId;
  chargeId: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  amount: number;
  paymentDueDate: Date;
  paidAt: Date;
  issuedAt: Date;
  status: "Paid" | "Pending";
  term: string;
  method: string;
}
interface Charge extends mongoose.Document {
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  term: string;
  applicableFor: string;
  createdBy: mongoose.Types.ObjectId;
  status?: "Active" | "Inactive";
}

interface Payment extends mongoose.Document {
  studentId: mongoose.Types.ObjectId;
  date: Date;
  description: string;
  method: "Credit Card" | "Bank Transfer" | "Financial Aid" | "Razorpay" | "stripe";
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  receiptUrl?: string;
  metadata?: Record<string, unknown>;
}

const StudentFinancialInfoSchema = new mongoose.Schema<StudentFinancialInfo>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chargeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charge",
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinancialPayment",
    },
    amount: { type: Number, required: true },
    paymentDueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },
    term: { type: String, required: true },
    paidAt: { type: Date },
    issuedAt: { type: Date, default: Date.now },
    method: { type: String }
  },
  { timestamps: true }
);

const ChargeSchema = new mongoose.Schema<Charge>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    term: { type: String, required: true },
    dueDate: { type: Date, required: true },
    applicableFor: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

const PaymentSchema = new mongoose.Schema<Payment>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    method: {
      type: String,
      enum: ['Credit Card', 'Bank Transfer', 'Financial Aid', 'Razorpay', 'stripe'],
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Failed'],
      default: 'Pending',
    },
    receiptUrl: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }, // Flexible field for Razorpay, Stripe, etc.
  },
  { timestamps: true }
);

export const StudentFinancialInfoModel = mongoose.model<StudentFinancialInfo>(
  "StudentFinancialInfo",
  StudentFinancialInfoSchema
);
export const ChargeModel = mongoose.model<Charge>("Charge", ChargeSchema);
export const PaymentModel = mongoose.model<Payment>(
  "FinancialPayment",
  PaymentSchema
);
