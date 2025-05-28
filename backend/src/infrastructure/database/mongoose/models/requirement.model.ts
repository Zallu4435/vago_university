import mongoose, { Schema, Document } from 'mongoose';

export interface IRequirementSub {
  percentage: number;
  completed: number;
  total: number;
}

export interface IRequirements extends Document {
  studentId: string;
  core: IRequirementSub;
  elective: IRequirementSub;
  general: IRequirementSub;
  createdAt: Date;
  updatedAt: Date;
}

const RequirementSubSchema = new Schema<IRequirementSub>({
  percentage: { type: Number, required: true },
  completed: { type: Number, required: true },
  total: { type: Number, required: true },
});

const RequirementsSchema = new Schema<IRequirements>({
  studentId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  core: { type: RequirementSubSchema, required: true },
  elective: { type: RequirementSubSchema, required: true },
  general: { type: RequirementSubSchema, required: true },
}, { timestamps: true });

export const RequirementsModel = mongoose.model<IRequirements>('Requirements', RequirementsSchema);