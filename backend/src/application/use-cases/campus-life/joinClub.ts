import { ClubModel, ClubRequestModel } from '../../../infrastructure/database/mongoose/models/club.model';
import mongoose from 'mongoose';

interface JoinClubParams {
  clubId: string;
  studentId: string;
  reason: string;
  additionalInfo?: string;
}

interface JoinClubResponse {
  requestId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
}

class JoinClub {
  async execute({ clubId, studentId, reason, additionalInfo = '' }: JoinClubParams): Promise<JoinClubResponse> {
    try {
      console.log(`Executing joinClub use case with params:`, { clubId, studentId, reason, additionalInfo });

      if (!mongoose.Types.ObjectId.isValid(clubId)) {
        throw new Error('Invalid club ID format');
      }

      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID format');
      }

      // Check if club exists
      const club = await ClubModel.findById(clubId).lean();
      if (!club) {
        throw new Error('Club not found');
      }

      // Check if student exists
      const UserModel = mongoose.model('User');
      const user = await UserModel.findById(studentId).lean();
      if (!user) {
        throw new Error('Student not found');
      }

      // Check for existing request
      const existingRequest = await ClubRequestModel.findOne({
        clubId,
        userId: studentId,
      }).lean();

      if (existingRequest) {
        throw new Error('Join request already submitted for this club');
      }

      // Create new join request
      const newRequest = new ClubRequestModel({
        clubId,
        userId: studentId,
        status: 'pending',
        whyJoin: reason,
        additionalInfo,
        createdAt: new Date(),
      });

      await newRequest.save();

      return {
        requestId: newRequest._id.toString(),
        status: newRequest.status,
        message: 'Join request submitted successfully',
      };
    } catch (err: any) {
      console.error('Error in joinClub use case:', err);
      throw new Error(err.message || 'Failed to submit join request');
    }
  }
}

export const joinClub = new JoinClub();
