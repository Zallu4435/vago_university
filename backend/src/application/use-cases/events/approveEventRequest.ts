import { EventRequestModel, CampusEventModel } from '../../../infrastructure/database/mongoose/models/events.model';

class ApproveEventRequest {
  async execute(id: string): Promise<void> {
    try {
      console.log(`Executing approveEventRequest use case with id:`, id);

      const eventRequest = await EventRequestModel.findById(id).catch((err) => {
        throw new Error(`Failed to find event request: ${err.message}`);
      });

      if (!eventRequest) {
        throw new Error('Event request not found');
      }

      if (eventRequest.status !== 'pending') {
        throw new Error('Event request is not in pending status');
      }

      await CampusEventModel.create({
        name: eventRequest.eventName,
        organizer: eventRequest.requestedBy,
        organizerType: eventRequest.requesterType,
        type: eventRequest.type,
        date: eventRequest.proposedDate,
        time: '',
        venue: eventRequest.proposedVenue,
        status: 'upcoming',
        description: eventRequest.description,
        maxParticipants: eventRequest.expectedParticipants,
        registrationRequired: true,
        createdAt: eventRequest.requestedAt,
      }).catch((err) => {
        throw new Error(`Failed to create event: ${err.message}`);
      });

      await EventRequestModel.findByIdAndUpdate(
        id,
        { status: 'approved', updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update event request: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in approveEventRequest use case:`, err);
      throw err;
    }
  }
}

export const approveEventRequest = new ApproveEventRequest();