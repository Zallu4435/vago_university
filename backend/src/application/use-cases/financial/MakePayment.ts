import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";
import { PaymentModel } from "../../../infrastructure/database/mongoose/models/financial.model";
import { StudentFinancialInfoModel } from "../../../infrastructure/database/mongoose/models/financial.model";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

interface PaymentInput {
  amount: number;
  method: "Credit Card" | "Bank Transfer" | "Financial Aid" | "Razorpay";
  term: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

export class MakePayment {
  async execute(studentId: string, input: PaymentInput): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error("Invalid student ID");
      }

      if (input.amount <= 0) {
        throw new Error("Amount must be greater than zero");
      }

      if (input.method === "Razorpay") {
        // If Razorpay paymentId/orderId/signature exist → this is the second phase (payment confirmation)
        if (
          input.razorpayPaymentId &&
          input.razorpayOrderId &&
          input.razorpaySignature
        ) {
          console.log("Verifying Razorpay payment...");

          const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
            .digest("hex");

          if (generatedSignature !== input.razorpaySignature) {
            throw new Error("Invalid payment signature");
          }

          const payment = await PaymentModel.findOneAndUpdate(
            { "metadata.razorpayOrderId": input.razorpayOrderId, studentId },
            {
              $set: {
                "metadata.razorpayPaymentId": input.razorpayPaymentId,
                "metadata.razorpaySignature": input.razorpaySignature,
                status: "Completed",
                date: new Date(),
                description: `Payment for ${input.term}`,
              },
            },
            { new: true }
          );

          if (!payment) throw new Error("Payment record not found");

          await StudentFinancialInfoModel.updateMany(
            { studentId, term: input.term, status: "Pending" },
            { $set: { status: "Completed" } }
          );

          return {
            id: payment._id.toString(),
            date: payment.date.toISOString(),
            description: payment.description,
            method: payment.method,
            amount: payment.amount,
            status: payment.status,
            metadata: payment.metadata,
          };
        } else {
          // First phase: create Razorpay order
          console.log("Creating Razorpay order...");

          const shortStudentId = studentId.slice(-6); // e.g. last 6 characters of ObjectId
          const shortReceipt = `r_${shortStudentId}_${Date.now()}`; // < 40 chars
          console.log("Generated receipt:", shortReceipt);

          const order = await razorpay.orders.create({
            amount: input.amount * 100,
            currency: "INR",
            receipt: shortReceipt,
          });

          const payment = new PaymentModel({
            studentId,
            amount: input.amount,
            method: input.method,
            term: input.term,
            date: new Date(),
            description: `Payment for ${input.term}`,
            status: "Pending",
            metadata: { razorpayOrderId: order.id },
          });

          await payment.save();

          return {
            id: payment._id.toString(),
            orderId: order.id,
            amount: payment.amount,
            currency: "INR",
            status: payment.status,
          };
        }
      } else {
        // Non-Razorpay payments
        const payment = new PaymentModel({
          studentId,
          date: new Date(),
          description: `Payment for ${input.term}`,
          method: input.method,
          amount: input.amount,
          status: "Completed",
        });

        await payment.save();

        await StudentFinancialInfoModel.updateMany(
          { studentId, term: input.term, status: "Pending" },
          { $set: { status: "Paid", method: input.method } }
        );

        return {
          id: payment._id.toString(),
          date: payment.date.toISOString(),
          description: payment.description,
          method: payment.method,
          amount: payment.amount,
          status: payment.status,
        };
      }
    } catch (err) {
      console.error("--- MakePayment Error ---");
      console.error(err);
      throw new Error(`Failed to process payment: ${(err as Error).message}`);
    }
  }
}

export const makePayment = new MakePayment();
