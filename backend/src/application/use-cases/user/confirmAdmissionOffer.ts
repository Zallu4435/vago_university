// backend/src/application/use-cases/admission/confirmAdmissionOffer.ts
import { Admission } from '../../../infrastructure/database/mongoose/models/admission.model';
import { User } from '../../../infrastructure/database/mongoose/models/user.model';
import { Register } from '../../../infrastructure/database/mongoose/models/register.model'; 

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

    if (admission.status !== 'offered') {
      throw new Error('Admission already processed');
    }

    if (!admission.confirmationToken || admission.confirmationToken !== token) {
      throw new Error('Invalid confirmation token');
    }

    if (!admission.tokenExpiry || new Date() > admission.tokenExpiry) {
      throw new Error('Confirmation token has expired');
    }

    if (action === 'accept') {
      admission.status = 'approved';
      admission.rejectedBy = null;

      // ✅ Step 1: Fetch hashed password from Register collection
      const registerUser = await Register.findById(admission.registerId);
      if (!registerUser) {
        throw new Error('Register user not found for this admission');
      }

      // ✅ Step 2: Extract names
      const fullNameParts = admission.personal.fullName.split(' ');
      const firstName = fullNameParts[0];
      const lastName = fullNameParts.slice(1).join(' ') || '';

      // ✅ Step 3: Create new user
      const user = new User({
        firstName,
        lastName,
        email: admission.personal.emailAddress,
        password: registerUser.password, // Using hashed password
        createdAt: new Date(),
      });

      await user.save();
    } else if (action === 'reject') {
      admission.status = 'rejected';
      admission.rejectedBy = 'user';
    } else {
      throw new Error('Invalid action');
    }

    // ✅ Clear the token
    admission.confirmationToken = null;
    admission.tokenExpiry = null;
    await admission.save();
  }
}

export const confirmAdmissionOffer = new ConfirmAdmissionOffer();
