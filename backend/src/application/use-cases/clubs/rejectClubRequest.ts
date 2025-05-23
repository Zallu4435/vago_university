import { ClubRequestModel } from '../../../infrastructure/database/mongoose/models/club.model';

interface RejectClubRequestParams {
  id: string;
  reason: string;
}

class RejectClubRequest {
  async execute({ id, reason }: RejectClubRequestParams): Promise<void> {
    try {
      console.log(`Executing rejectClubRequest use case with id:`, id, `and reason:`, reason);

      const clubRequest = await ClubRequestModel.findById(id).catch((err) => {
        throw new Error(`Failed to find club request: ${err.message}`);
      });

      if (!clubRequest) {
        throw new Error('Club request not found');
      }

      if (clubRequest.status !== 'pending') {
        throw new Error('Club request is not in pending status');
      }

      await ClubRequestModel.findByIdAndUpdate(
        id,
        { status: 'rejected', rejectionReason: reason, updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update club request: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in rejectClubRequest use case:`, err);
      throw err;
    }
  }
}

export const rejectClubRequest = new RejectClubRequest();