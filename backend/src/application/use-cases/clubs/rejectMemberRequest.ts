import { MemberRequestModel } from '../../../infrastructure/database/mongoose/models/club.model';

interface RejectMemberRequestParams {
  id: string;
  reason: string;
}

class RejectMemberRequest {
  async execute({ id, reason }: RejectMemberRequestParams): Promise<void> {
    try {
      console.log(`Executing rejectMemberRequest use case with id:`, id, `and reason:`, reason);

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
        { status: 'rejected', rejectionReason: reason, updatedAt: Date.now() },
        { runValidators: true }
      ).catch((err) => {
        throw new Error(`Failed to update member request: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in rejectMemberRequest use case:`, err);
      throw err;
    }
  }
}

export const rejectMemberRequest = new RejectMemberRequest();