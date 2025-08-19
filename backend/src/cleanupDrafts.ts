import mongoose from "mongoose";
import { config } from "./config/config";
import { AdmissionDraft } from "./infrastructure/database/mongoose/admission/AdmissionDraftModel";

async function cleanupOldDrafts() {
  try {
    await mongoose.connect(config.database.mongoUri);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await AdmissionDraft.deleteMany({
      createdAt: { $lt: oneDayAgo },
    });

  } catch (err) {
    console.error("Error during cleanup:", err);
  } finally {
    await mongoose.disconnect();
  }
}

cleanupOldDrafts();