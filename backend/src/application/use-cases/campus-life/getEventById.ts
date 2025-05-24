import { CampusEventModel } from "../../../infrastructure/database/mongoose/models/events.model";

interface GetEventByIdParams {
  eventId: string;
}

class GetEventById {
  async execute({ eventId }: GetEventByIdParams): Promise<any> {
    try {
      console.log(`Executing getEventById use case with eventId:`, eventId);

      const event = await CampusEventModel.findById(eventId)
        .select('id title date time location organizer timeframe icon color description fullTime additionalInfo requirements')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch event: ${err.message}`);
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