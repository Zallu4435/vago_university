import { ParticipantModel } from '../../../infrastructure/database/mongoose/models/events.model';

class DeleteParticipant {
  async execute(id: string): Promise<void> {
    try {
      console.log(`Executing deleteParticipant use case with id:`, id);

      const participant = await ParticipantModel.findByIdAndDelete(id).catch((err) => {
        throw new Error(`Failed to delete participant: ${err.message}`);
      });

      if (!participant) {
        throw new Error('Participant not found');
      }
    } catch (err) {
      console.error(`Error in deleteParticipant use case:`, err);
      throw err;
    }
  }
}

export const deleteParticipant = new DeleteParticipant();