import { FacultyRegister } from '../../../infrastructure/database/mongoose/models/facultyRegister.model';
import { config } from '../../../config/config';
import { emailService } from '../../../infrastructure/services/email.service';

interface ApproveFacultyParams {
  id: string;
  additionalInfo: {
    department: string;
    position: string;
    startDate: string;
    salary?: string;
    benefits?: string;
    additionalNotes?: string;
  };
}

class ApproveFaculty {
  async execute({ id, additionalInfo }: ApproveFacultyParams): Promise<void> {
    console.log(`Executing approveFaculty use case with id: ${id}`, additionalInfo);

    const faculty = await FacultyRegister.findById(id);

    if (!faculty) {
      throw new Error('Faculty not found');
    }

    if (faculty.status !== 'pending') {
      throw new Error('Faculty registration already processed');
    }

    // Generate a confirmation token
    const confirmationToken = this.generateConfirmationToken();

    // Update faculty status and details
    faculty.department = additionalInfo.department;
    faculty.status = 'offered';
    faculty.confirmationToken = confirmationToken;
    faculty.tokenExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Token valid for 14 days

    await faculty.save();

    // Generate acceptance and rejection URLs with token
    const baseUrl = config.frontendUrl;
    const acceptUrl = `${baseUrl}/confirm-faculty/${faculty._id}/accept?token=${confirmationToken}`;
    const rejectUrl = `${baseUrl}/confirm-faculty/${faculty._id}/reject?token=${confirmationToken}`;

    // Send faculty offer email
    await emailService.sendFacultyOfferEmail({
      to: faculty.email,
      name: faculty.fullName,
      department: additionalInfo.department,
      position: additionalInfo.position,
      startDate: additionalInfo.startDate,
      salary: additionalInfo.salary,
      benefits: additionalInfo.benefits,
      additionalNotes: additionalInfo.additionalNotes,
      acceptUrl,
      rejectUrl,
      expiryDays: 14 // Offer valid for 14 days
    });

    console.log(`Faculty offer email sent to ${faculty.email}`);
  }

  private generateConfirmationToken(): string {
    // Generate a random token
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

export const approveFaculty = new ApproveFaculty();