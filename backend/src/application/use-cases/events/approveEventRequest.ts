import {
  EventRequestModel,
  CampusEventModel,
} from "../../../infrastructure/database/mongoose/models/events.model";

class ApproveEventRequest {
  async execute(id: string): Promise<void> {
    try {
      const eventRequest = await EventRequestModel.findById(id).catch((err) => {
        throw new Error(`Failed to find event request: ${err.message}`);
      });

      if (!eventRequest) {
        throw new Error("Event request not found");
      }

      if (eventRequest.status !== "pending") {
        throw new Error("Event request is not in pending status");
      }

      await EventRequestModel.findByIdAndUpdate(
        id,
        { status: "approved", updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update event request: ${err.message}`);
      });

      const updatedEvent = await CampusEventModel.findByIdAndUpdate(
        eventRequest.eventId,
        { $inc: { participantsCount: 1 } },
        { new: true }
      ).catch((err) => {
        throw new Error(
          `Failed to increment participants count: ${err.message}`
        );
      });

      if (!updatedEvent) {
        console.warn(
          `No matching campus event found for ID: ${eventRequest.eventId}`
        );
      } else {
        console.log(
          `Participants count incremented for event ID: ${eventRequest.eventId}`
        );
      }
    } catch (err) {
      console.error(`Error in approveEventRequest use case:`, err);
      throw err;
    }
  }
}

export const approveEventRequest = new ApproveEventRequest();
