import { MemberRequestModel } from '../../../infrastructure/database/mongoose/models/club.model';

class ApproveMemberRequest {
  async execute(id: string): Promise<void> {
    try {
      console.log(`Executing approveMemberRequest use case with id:`, id);

      const memberRequest = await MemberRequestModel.findById(id).catch((err) => {
        throw new Error(`Failed to find member request: ${err.message}`);
      });

      if (!memberRequest) {
        throw new Error('Member request not found');
      }

      if (memberRequest.status !== 'pending') {
        throw new Error('Member request is not in pending status');
      }

      await MemberRequestModel.findByIdAndUpdate(
        id,
        { status: 'approved', updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update member request: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in approveMemberRequest use case:`, err);
      throw err;
    }
  }
}

export const approveMemberRequest = new ApproveMemberRequest();