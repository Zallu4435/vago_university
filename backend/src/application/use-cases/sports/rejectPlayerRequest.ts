import { SportRequestModel } from '../../../infrastructure/database/mongoose/models/sports.model';

interface RejectPlayerRequestParams {
  id: string;
}

class RejectPlayerRequest {
  async execute({ id }: RejectPlayerRequestParams): Promise<void> {
    try {

      const playerRequest = await SportRequestModel.findById(id).catch((err) => {
        throw new Error(`Failed to find player request: ${err.message}`);
      });

      if (!playerRequest) {
        throw new Error('Player request not found');
      }

      if (playerRequest.status !== 'pending') {
        throw new Error('Player request is not in pending status');
      }

      await SportRequestModel.findByIdAndUpdate(
        id,
        { status: 'rejected', updatedAt: Date.now() },
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