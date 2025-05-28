import { ClubRequestModel, ClubModel } from '../../../infrastructure/database/mongoose/models/club.model';

class ApproveClubRequest {
  async execute(id: string): Promise<void> {
    try {
      console.log(`[ApproveClubRequest] Executing with request ID: ${id}`);

      // Fetch the request first
      const clubRequest = await ClubRequestModel.findById(id).lean();
      if (!clubRequest) {
        throw new Error('Club request not found.');
      }

      if (clubRequest.status !== 'pending') {
        throw new Error('Only pending club requests can be approved.');
      }

      // Approve the request
      const updatedRequest = await ClubRequestModel.findByIdAndUpdate(
        id,
        { status: 'approved', updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!updatedRequest) {
        throw new Error('Failed to update the club request.');
      }

      // Increment club's member count
      const updatedClub = await ClubModel.findByIdAndUpdate(
        clubRequest.clubId,
        {
          $inc: { enteredMembers: 1 },
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!updatedClub) {
        throw new Error('Failed to update the club members count.');
      }

    } catch (err) {
      console.error(`[ApproveClubRequest] Error:`, err);
      throw new Error(`ApproveClubRequest failed: ${err.message}`);
    }
  }
}

export const approveClubRequest = new ApproveClubRequest();
