// In payment.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface IPayment extends Document {
  applicationId: string;
  paymentDetails;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    applicationId: { type: String, required: true },
    paymentDetails: { type: Object, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
