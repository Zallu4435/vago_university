import mongoose, { Schema, Document } from 'mongoose';
import { Assignment } from '../../../../domain/assignments/entities/Assignment';

export interface IAssignmentDocument extends Document {
  title: string;
  subject: string;
  dueDate: Date;
  maxMarks: number;
  description: string;
  files: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'closed';
  totalSubmissions: number;
  averageMarks?: number;
}

const AssignmentSchema = new Schema<IAssignmentDocument>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  maxMarks: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  files: [{
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'draft'
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  averageMarks: {
    type: Number,
    default: 0
  }
});

// Update the updatedAt field before saving
AssignmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const AssignmentModel = mongoose.model<IAssignmentDocument>('Assignment', AssignmentSchema); 