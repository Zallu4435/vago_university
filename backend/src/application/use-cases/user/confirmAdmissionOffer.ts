// backend/src/application/use-cases/admission/confirmAdmissionOffer.ts
import { Admission } from '../../../infrastructure/database/mongoose/models/admission.model';
import { User } from '../../../infrastructure/database/mongoose/models/user.model';

interface ConfirmOfferParams {
  admissionId: string;
  token: string;
  action: 'accept' | 'reject';
}

class ConfirmAdmissionOffer {
  async execute({ admissionId, token, action }: ConfirmOfferParams): Promise<void> {
    console.log(`Executing confirmAdmissionOffer use case with id: ${admissionId}, action: ${action}`);

    const admission = await Admission.findById(admissionId);

    if (!admission) {
      throw new Error('Admission not found');
    }

    if (admission.status !== 'pending') {
      throw new Error('Admission already processed');
    }

    // Validate token
    if (!admission.confirmationToken || admission.confirmationToken !== token) {
      throw new Error('Invalid confirmation token');
    }

    // Check if token has expired
    if (!admission.tokenExpiry || new Date() > admission.tokenExpiry) {
      throw new Error('Confirmation token has expired');
    }

    if (action === 'accept') {
      // Update admission status
      admission.status = 'approved';
      admission.rejectedBy = null;
      await admission.save();

      // Create a new user based on admission data
      const user = new User({
        email: admission.email,
        fullName: admission.fullName,
        program: admission.program,
        // Add any other fields from admission that should be in the user document
        admissionId: admission._id, // Reference to the original admission
        role: 'student', // Set default role
        createdAt: new Date()
      });

      await user.save();
    } else if (action === 'reject') {
      // Update admission as rejected by user
      admission.status = 'rejected';
      admission.rejectedBy = 'user';
      await admission.save();
    } else {
      throw new Error('Invalid action');
    }

    // Clear the token after processing
    admission.confirmationToken = null;
    admission.tokenExpiry = null;
    await admission.save();
  }
}

export const confirmAdmissionOffer = new ConfirmAdmissionOffer();