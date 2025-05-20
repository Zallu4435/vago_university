import { FacultyRegister } from '../../../infrastructure/database/mongoose/models/facultyRegister.model';
import { Faculty } from '../../../infrastructure/database/mongoose/models/faculty.model';
import { emailService } from '../../../infrastructure/services/email.service';
import { generatePassword } from '../../../infrastructure/services/passwordService';
import { config } from '../../../config/config';

interface ConfirmOfferParams {
  facultyId: string;
  token: string;
  action: 'accept' | 'reject';
}

class ConfirmFacultyOffer {
  async execute({ facultyId, token, action }: ConfirmOfferParams): Promise<void> {
    try {
      console.log(`Executing confirmFacultyOffer use case with id: ${facultyId}, action: ${action}`);

      const facultyRegister = await FacultyRegister.findById(facultyId);

      if (!facultyRegister) {
        throw new Error('Faculty registration not found');
      }

      if (facultyRegister.status !== 'offered') {
        throw new Error('Faculty registration already processed');
      }

      if (!facultyRegister.confirmationToken || facultyRegister.confirmationToken !== token) {
        throw new Error('Invalid confirmation token');
      }

      if (!facultyRegister.tokenExpiry || new Date() > facultyRegister.tokenExpiry) {
        throw new Error('Confirmation token has expired');
      }

      if (action === 'accept') {
        facultyRegister.status = 'approved';
        facultyRegister.rejectedBy = null;

        // Generate a secure temporary password
        const temporaryPassword = generatePassword();

        // Extract names
        const fullNameParts = facultyRegister.fullName.split(' ');
        const firstName = fullNameParts[0];
        const lastName = fullNameParts.slice(1).join(' ') || '';

        // Create new faculty user with only the fields defined in Faculty model
        const faculty = new Faculty({
          firstName,
          lastName,
          email: facultyRegister.email,
          password: temporaryPassword, // Will be hashed by Faculty model's pre-save middleware
          createdAt: new Date(),
        });

        await faculty.save();

        // Send faculty credentials email
        const loginUrl = `${config.frontendUrl}/faculty/login`;
        await emailService.sendFacultyCredentialsEmail({
          to: facultyRegister.email,
          name: facultyRegister.fullName,
          email: facultyRegister.email,
          password: temporaryPassword,
          loginUrl,
          department: facultyRegister.department,
          additionalInstructions: 'Please log in and change your temporary password as soon as possible for security purposes.',
        });

      } else if (action === 'reject') {
        facultyRegister.status = 'rejected';
        facultyRegister.rejectedBy = 'user';
      } else {
        throw new Error('Invalid action');
      }

      // Clear the token
      facultyRegister.confirmationToken = null;
      facultyRegister.tokenExpiry = null;
      await facultyRegister.save();
    } catch (err) {
      console.error(`Error in confirmFacultyOffer use case:`, err);
      throw err;
    }
  }
}

export const confirmFacultyOffer = new ConfirmFacultyOffer();