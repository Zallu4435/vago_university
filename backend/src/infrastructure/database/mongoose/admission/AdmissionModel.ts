import mongoose, { Schema, Document, Model } from "mongoose";
import { IAdmission } from "../../../../domain/admission/entities/AdmissionTypes";

interface IAdmissionDocument extends Omit<IAdmission, 'id'>, Document {}

const AdmissionSchema: Schema = new Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    registerId: { type: Schema.Types.ObjectId, required: true, ref: "Register" },
    personal: { type: Object, default: {} },
    choiceOfStudy: { type: [Schema.Types.Mixed], default: [] },
    education: { type: Object, default: {} },
    achievements: { type: Object, default: {} },
    otherInformation: { type: Object, default: {} },
    documents: { type: Object, default: {} },
    declaration: { type: Object, default: {} },
    paymentId: { type: String, required: true },
    rejectedBy: { type: String, enum: ["admin", "user", null], default: null },
    status: { type: String, enum: ["pending", "offered", "approved", "rejected"], default: "pending" },
    confirmationToken: { type: String, default: null },
    tokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Admission: Model<IAdmissionDocument> =
  mongoose.models.Admission || mongoose.model<IAdmissionDocument>("Admission", AdmissionSchema);