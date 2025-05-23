import { PlayerRequestModel } from '../../../infrastructure/database/mongoose/models/sports.model';

class ApprovePlayerRequest {
  async execute(id: string): Promise<void> {
    try {
      console.log(`Executing approvePlayerRequest use case with id:`, id);

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
        { status: 'approved', updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update player request: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in approvePlayerRequest use case:`, err);
      throw err;
    }
  }
}

export const approvePlayerRequest = new ApprovePlayerRequest();