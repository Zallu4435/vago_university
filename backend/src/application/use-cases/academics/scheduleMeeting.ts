import { MeetingModel } from '../../../infrastructure/database/mongoose/models/meeting.model';
import mongoose from 'mongoose';

interface ScheduleMeetingInput {
  userId: string;
  date: string;
  reason: string;
  preferredTime?: string;
  notes?: string;
}

interface ScheduleMeetingOutput {
  success: boolean;
  message: string;
  meetingId: string;
  meetingTime: string;
  location: string;
}

class ScheduleMeeting {
  async execute({ userId, date, reason, preferredTime, notes }: ScheduleMeetingInput): Promise<ScheduleMeetingOutput> {
    try {
      console.log(`Executing scheduleMeeting use case for userId: ${userId}`);

      const meetingId = new mongoose.Types.ObjectId().toString();
      const meetingTime = new Date(date).toISOString();
      const location = 'Academic Advising Office'; // Example location

      const meeting = new MeetingModel({
        userId,
        date,
        reason,
        preferredTime,
        notes,
        meetingId,
        meetingTime,
        location,
      });

      await meeting.save().catch((err) => {
        throw new Error(`Failed to schedule meeting: ${err.message}`);
      });

      return {
        success: true,
        message: 'Meeting scheduled successfully',
        meetingId,
        meetingTime,
        location,
      };
    } catch (err) {
      console.error(`Error in scheduleMeeting use case:`, err);
      throw err;
    }
  }
}

export const scheduleMeeting = new ScheduleMeeting();