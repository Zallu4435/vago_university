import mongoose, { Document, Schema } from "mongoose";

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  chapterId: mongoose.Types.ObjectId;
  progress: number;
  isCompleted: boolean;
  isBookmarked: boolean;
  lastWatchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Diploma",
      required: true,
    },
    chapterId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userProgressSchema.index({ userId: 1, courseId: 1, chapterId: 1 }, { unique: true });

export const UserProgress = mongoose.model<IUserProgress>("UserProgress", userProgressSchema); 