import mongoose from 'mongoose';
import { EventRequestModel } from '../../../infrastructure/database/mongoose/models/events.model';
import { User as UserModel } from '../../../infrastructure/database/mongoose/models/user.model';

interface GetEventRequestDetailsInput {
  id: string;
}

interface EventRequestDetails {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  whyJoin :string;
  additionalInfo: string;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    participantsCount: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

class GetEventRequestDetails {
  async execute(id: string): Promise<EventRequestDetails> {
    try {
      console.log(`Executing getEventRequestDetails use case for id: ${id}`);

      // Validate ID
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('Invalid event request ID');
      }

      // Fetch event request and populate event and user details
      const eventRequest = await EventRequestModel.findById(id)
        .populate({
          path: 'eventId',
          select: 'title description date location participantsCount', // Fixed 'participants' to 'participantsCount'
        })
        .populate({
          path: 'userId',
          select: 'firstName lastName email',
          model: UserModel,
        })
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch event request: ${err.message}`);
        });

      if (!eventRequest) {
        throw new Error('Event request not found');
      }

      if (!eventRequest.eventId) {
        throw new Error('Associated event not found');
      }

      return {
        id: eventRequest._id.toString(),
        status: eventRequest.status,
        createdAt: eventRequest.createdAt.toISOString(),
        updatedAt: eventRequest.updatedAt.toISOString(),
        whyJoin: eventRequest.whyJoin,
        additionalInfo: eventRequest.additionalInfo,
        event: {
          id: eventRequest.eventId._id.toString(),
          title: eventRequest.eventId.title,
          description: eventRequest.eventId.description,
          date: eventRequest.eventId.date,
          location: eventRequest.eventId.location,
          participantsCount: eventRequest.eventId.participantsCount,
        },
        user: eventRequest.userId
          ? {
              id: eventRequest.userId._id.toString(),
              name: `${eventRequest.userId.firstName} ${eventRequest.userId.lastName}`.trim(),
              email: eventRequest.userId.email,
            }
          : undefined,
      };
    } catch (err) {
      console.error(`Error in getEventRequestDetails use case:`, err);
      throw err;
    }
  }
}

export const getEventRequestDetails = new GetEventRequestDetails();