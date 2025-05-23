import { ParticipantModel } from '../../../infrastructure/database/mongoose/models/events.model';

interface RejectParticipantParams {
  id: string;
  reason: string;
}

class RejectParticipant {
  async execute({ id, reason }: RejectParticipantParams): Promise<void> {
    try {
      console.log(`Executing rejectParticipant use case with id:`, id, `and reason:`, reason);

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
        { status: 'rejected', rejectionReason: reason, updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update participant: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in rejectParticipant use case:`, err);
      throw err;
    }
  }
}

export const rejectParticipant = new RejectParticipant();