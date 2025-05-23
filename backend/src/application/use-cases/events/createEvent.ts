import { CampusEventModel } from '../../../infrastructure/database/mongoose/models/events.model';

interface CreateEventParams {
  name: string;
  organizer: string;
  organizerType: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  description: string;
  maxParticipants: number;
  registrationRequired: boolean;
}

class CreateEvent {
  async execute(data: CreateEventParams): Promise<any> {
    try {
      console.log(`Executing createEvent use case with data:`, data);

      const eventData = { ...data, createdAt: new Date().toISOString() };
      const event = await CampusEventModel.create(eventData).catch((err) => {
        throw new Error(`Failed to create event: ${err.message}`);
      });

      return event.toObject();
    } catch (err) {
      console.error(`Error in createEvent use case:`, err);
      throw err;
    }
  }
}

export const createEvent = new CreateEvent();