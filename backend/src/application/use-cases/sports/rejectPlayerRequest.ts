import { PlayerRequestModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface RejectPlayerRequestParams {
  id: string;
  reason: string;
}

class RejectPlayerRequest {
  async execute({ id, reason }: RejectPlayerRequestParams): Promise<void> {
    try {
      console.log(`Executing rejectPlayerRequest use case with id:`, id, `and reason:`, reason);

      const playerRequest = await PlayerRequestModel.findById(id).catch((err) => {
        throw new Error(`Failed to find player request: ${err.message}`);
      });

      if (!playerRequest) {
        throw new Error('Player request not found');
      }

      if (playerRequest.status !== 'pending') {
        throw new Error('Player request is not in pending status');
      }

      await PlayerRequestModel.findByIdAndUpdate(
        id,
        { status: 'rejected', rejectionReason: reason, updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update player request: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in rejectPlayerRequest use case:`, err);
      throw err;
    }
  }
}

export const rejectPlayerRequest = new RejectPlayerRequest();