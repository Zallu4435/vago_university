import { TeamModel, SportRequestModel } from '../../../infrastructure/database/mongoose/models/sports.model';
import mongoose from 'mongoose';

interface JoinSportParams {
  sportId: string;
  studentId: string;
  reason: string;
  additionalInfo?: string;
}

interface JoinSportResponse {
  requestId: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
}

class JoinSport {
  async execute({ sportId, studentId, reason, additionalInfo }: JoinSportParams): Promise<JoinSportResponse> {
    try {
      // Verify sport exists
      const sport = await TeamModel.findById(sportId).lean();
      if (!sport) {
        throw new Error('Sport not found');
      }

      // Verify student exists
      const user = await mongoose.model('User').findById(studentId).lean();
      if (!user) {
        throw new Error('Student not found');
      }

      // Check if join request already exists
      const existingRequest = await SportRequestModel.findOne({
        studentId,
        team: sport.title,
      }).lean();
      if (existingRequest) {
        throw new Error('Join request already submitted for this team');
      }

      // Create player request
      const playerRequest = new SportRequestModel({
        sportId,
        userId: studentId,
        status: 'pending',
        whyJoin: reason,
        additionalInfo,
        createdAt: new Date(),
      });

      await playerRequest.save();


      return {
        requestId: playerRequest._id.toString(),
        status: playerRequest.status,
        message: 'Join request submitted successfully',
      };
    } catch (err) {
      console.error(`Error in joinSport use case:`, err);
      throw err;
    }
  }
}

export const joinSport = new JoinSport();