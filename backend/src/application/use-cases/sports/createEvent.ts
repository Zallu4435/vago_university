import { EventModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface CreateEventParams {
  title: string;
  sportType: string;
  teams: string[];
  dateTime: string;
  venue: string;
  status: string;
}

class CreateEvent {
  async execute(data: CreateEventParams): Promise<any> {
    try {
      console.log(`Executing createEvent use case with data:`, data);

      const event = await EventModel.create(data).catch((err) => {
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