import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmissionDocument extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: string;
  studentName: string;
  submittedDate: Date;
  status: 'pending' | 'reviewed' | 'late';
  marks?: number;
  feedback?: string;
  isLate: boolean;
  files: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }>;
}

const SubmissionSchema = new Schema<ISubmissionDocument>({
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  submittedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'late'],
    default: 'pending'
  },
  marks: {
    type: Number,
    min: 0
  },
  feedback: {
    type: String
  },
  isLate: {
    type: Boolean,
    default: false
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
  }]
});

// Create indexes for better query performance
SubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
SubmissionSchema.index({ status: 1 });
SubmissionSchema.index({ submittedDate: 1 });

export const SubmissionModel = mongoose.model<ISubmissionDocument>('Submission', SubmissionSchema); 