import { CampusEventModel } from '../../../infrastructure/database/mongoose/models/events.model';

class GetEventById {
  async execute(id: string): Promise<any> {
    try {
      console.log(`Executing getEventById use case with id:`, id);

      const event = await CampusEventModel.findById(id)
        .select('name organizer organizerType type date time venue status description maxParticipants registrationRequired participants createdAt')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query event: ${err.message}`);
        });

      if (!event) {
        throw new Error('Event not found');
      }

      return event;
    } catch (err) {
      console.error(`Error in getEventById use case:`, err);
      throw err;
    }
  }
}

export const getEventById = new GetEventById();