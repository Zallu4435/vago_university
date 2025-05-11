import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true },
    paymentDetails: { type: Object, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);