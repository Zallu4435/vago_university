import mongoose, { Schema } from "mongoose";
import { EnquiryStatus, IEnquiry } from "../../../../domain/enquiry/entities/EnquiryTypes";

const enquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(EnquiryStatus),
      default: EnquiryStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

enquirySchema.index({ status: 1 });
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ email: 1 });
enquirySchema.index({ subject: "text", message: "text" });

export const Enquiry = mongoose.model<IEnquiry>("Enquiry", enquirySchema); 