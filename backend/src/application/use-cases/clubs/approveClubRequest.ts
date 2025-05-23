import { ClubRequestModel, ClubModel } from '../../../infrastructure/database/mongoose/models/club.model';

class ApproveClubRequest {
  async execute(id: string): Promise<void> {
    try {
      console.log(`Executing approveClubRequest use case with id:`, id);

      const clubRequest = await ClubRequestModel.findById(id).catch((err) => {
        throw new Error(`Failed to find club request: ${err.message}`);
      });

      if (!clubRequest) {
        throw new Error('Club request not found');
      }

      if (clubRequest.status !== 'pending') {
        throw new Error('Club request is not in pending status');
      }

      await ClubModel.create({
        name: clubRequest.name,
        category: clubRequest.category,
        description: clubRequest.description,
        createdBy: clubRequest.createdBy,
        status: 'active',
      }).catch((err) => {
        throw new Error(`Failed to create club: ${err.message}`);
      });

      await ClubRequestModel.findByIdAndUpdate(
        id,
        { status: 'approved', updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update club request: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in approveClubRequest use case:`, err);
      throw err;
    }
  }
}

export const approveClubRequest = new ApproveClubRequest();