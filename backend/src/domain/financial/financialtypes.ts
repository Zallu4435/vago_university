import mongoose from "mongoose";

export interface ChargeProps {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  amount: number;
  term: string;
  dueDate: Date;
  applicableFor: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: "Active" | "Inactive";
}

export interface PaymentProps {
  _id?: mongoose.Types.ObjectId;
  studentId: string;
  date: Date;
  description: string;
  method: "Credit Card" | "Bank Transfer" | "Financial Aid" | "Razorpay" | "stripe";
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  receiptUrl?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
} 