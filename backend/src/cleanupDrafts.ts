import mongoose from "mongoose";
import { config } from "./config/env";
import { admissionDraft } from "./infrastructure/database/mongoose/models/admissionDraft.model";

async function cleanupOldDrafts() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected for cleanup");

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await admissionDraft.model.deleteMany({
      createdAt: { $lt: oneDayAgo },
    });

    console.log(`Deleted ${result.deletedCount} old drafts`);
  } catch (err) {
    console.error("Error during cleanup:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
}

cleanupOldDrafts();