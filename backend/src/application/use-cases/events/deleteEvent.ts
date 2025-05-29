import { CampusEventModel } from "../../../infrastructure/database/mongoose/models/events.model";

class DeleteEvent {
  async execute(id: string): Promise<void> {
    try {
      const event = await CampusEventModel.findByIdAndDelete(id).catch(
        (err) => {
          throw new Error(`Failed to delete event: ${err.message}`);
        }
      );

      if (!event) {
        throw new Error("Event not found");
      }
    } catch (err) {
      console.error(`Error in deleteEvent use case:`, err);
      throw err;
    }
  }
}

export const deleteEvent = new DeleteEvent();
