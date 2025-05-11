import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User" }, // Optional
    personal: { type: Object, default: {} },
    choiceOfStudy: { type: Array, default: [] },
    education: { type: Object, default: {} },
    achievements: { type: Object, default: {} },
    otherInformation: { type: Object, default: {} },
    documents: { type: Object, default: {} },
    declaration: { type: Object, default: {} },
    paymentId: { type: mongoose.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true }
);

export const Admission = mongoose.model("Admission", admissionSchema);