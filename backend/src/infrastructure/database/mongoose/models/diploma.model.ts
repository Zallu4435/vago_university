import mongoose, { Schema, Document } from 'mongoose';

export interface IDiploma extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  duration: string;
  prerequisites: string[];
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  videoIds: mongoose.Types.ObjectId[];
  students?: mongoose.Types.ObjectId[];
}

const diplomaSchema = new Schema<IDiploma>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    prerequisites: [{
      type: String,
      trim: true,
    }],
    status: {
      type: Boolean,
      default: true,
    },
    videoIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Video',
    }],
    students: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
diplomaSchema.index({ title: 1 });
diplomaSchema.index({ category: 1 });
diplomaSchema.index({ status: 1 });

export const Diploma = mongoose.model<IDiploma>('Diploma', diplomaSchema); 