import { CampusEventModel } from '../../../infrastructure/database/mongoose/models/events.model';

interface UpdateEventParams {
  name?: string;
  organizer?: string;
  organizerType?: string;
  type?: string;
  date?: string;
  time?: string;
  venue?: string;
  status?: string;
  description?: string;
  maxParticipants?: number;
  registrationRequired?: boolean;
}

class UpdateEvent {
  async execute(id: string, data: UpdateEventParams): Promise<any> {
    try {
      console.log(`Executing updateEvent use case with id:`, id, `and data:`, data);

      const event = await CampusEventModel.findByIdAndUpdate(
        id,
        { ...data, updatedAt: Date.now() },
        { new: true, runValidators: true }
      )
        .select('name organizer organizerType type date time venue status description maxParticipants registrationRequired participants createdAt')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to update event: ${err.message}`);
        });

      if (!event) {
        throw new Error('Event not found');
      }

      return event;
    } catch (err) {
      console.error(`Error in updateEvent use case:`, err);
      throw err;
    }
  }
}

export const updateEvent = new UpdateEvent();