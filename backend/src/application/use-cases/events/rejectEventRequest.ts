import { EventRequestModel } from '../../../infrastructure/database/mongoose/models/events.model';

interface RejectEventRequestParams {
  id: string;
  reason: string;
}

class RejectEventRequest {
  async execute({ id, reason }: RejectEventRequestParams): Promise<void> {
    try {
      console.log(`Executing rejectEventRequest use case with id:`, id, `and reason:`, reason);

      const eventRequest = await EventRequestModel.findById(id).catch((err) => {
        throw new Error(`Failed to find event request: ${err.message}`);
      });

      if (!eventRequest) {
        throw new Error('Event request not found');
      }

      if (eventRequest.status !== 'pending') {
        throw new Error('Event request is not in pending status');
      }

      await EventRequestModel.findByIdAndUpdate(
        id,
        { status: 'rejected', rejectionReason: reason, updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update event request: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in rejectEventRequest use case:`, err);
      throw err;
    }
  }
}

export const rejectEventRequest = new RejectEventRequest();