import { ParticipantModel } from '../../../infrastructure/database/mongoose/models/events.model';

class ApproveParticipant {
  async execute(id: string): Promise<void> {
    try {
      console.log(`Executing approveParticipant use case with id:`, id);

      const participant = await ParticipantModel.findById(id).catch((err) => {
        throw new Error(`Failed to find participant: ${err.message}`);
      });

      if (!participant) {
        throw new Error('Participant not found');
      }

      if (participant.status !== 'pending') {
        throw new Error('Participant is not in pending status');
      }

      await ParticipantModel.findByIdAndUpdate(
        id,
        { status: 'confirmed', updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update participant: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in approveParticipant use case:`, err);
      throw err;
    }
  }
}

export const approveParticipant = new ApproveParticipant();