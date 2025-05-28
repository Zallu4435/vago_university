import { CampusEventModel, EventRequestModel } from '../../../infrastructure/database/mongoose/models/events.model';
import mongoose from 'mongoose';

interface JoinEventParams {
  eventId: string;
  studentId: string;
  reason: string;
  additionalInfo?: string;
}

interface JoinEventResponse {
  requestId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
}

class JoinEvent {
  async execute({
    eventId,
    studentId,
    reason,
    additionalInfo,
  }: JoinEventParams): Promise<JoinEventResponse> {
    try {
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new Error('Invalid event ID');
      }
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }

      const event = await CampusEventModel.findById(eventId).lean();
      if (!event) throw new Error('Event not found');

      const user = await mongoose.model('User').findById(studentId).lean();
      if (!user) throw new Error('Student (User) not found');

      const existing = await EventRequestModel.findOne({ eventId, userId: studentId }).lean();
      if (existing) throw new Error('You have already requested to join this event.');
  
      const eventRequest = await EventRequestModel.create({
        eventId,
        userId: studentId,
        status: 'pending',
        whyJoin: reason,
        additionalInfo,
        createdAt: new Date(),
      });

      return {
        requestId: eventRequest._id.toString(),
        status: eventRequest.status,
        message: 'Join request submitted successfully',
      };
    } catch (err: any) {
      console.error('[JoinEvent] Error:', err.message || err);
      throw new Error(`Failed to join event: ${err.message}`);
    }
  }
}

export const joinEvent = new JoinEvent();
