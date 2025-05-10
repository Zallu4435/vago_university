// src/infrastructure/database/mongoose/models/admission.model.ts

import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    personal: Object,
    choiceOfStudy: Object,
    education: Object,
    achievements: Object,
    otherInformation: Object,
    documents: Object,
    paymentDetails: Object,
  },
  { timestamps: true }
);

export const Admission = mongoose.model("Admission", admissionSchema);
