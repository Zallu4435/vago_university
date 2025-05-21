// backend/src/application/use-cases/admission/approveAdmission.ts
import { Admission } from '../../../infrastructure/database/mongoose/models/admission.model';
import { emailService } from '../../../infrastructure/services/email.service';
import { config } from '../../../config/config';

interface ApproveAdmissionParams {
  id: string;
  additionalInfo?: {
    programDetails?: string;
    startDate?: string;
    scholarshipInfo?: string;
    additionalNotes?: string;
  };
}

class ApproveAdmission {
  async execute({ id, additionalInfo }: ApproveAdmissionParams): Promise<void> {
    console.log(`Executing approveAdmission use case with id: ${id}`);

    const admission = await Admission.findById(id);

    if (!admission) {
      throw new Error('Admission not found');
    }

    if (admission.status !== 'pending') {
      throw new Error('Admission already processed');
    }

    const confirmationToken = this.generateConfirmationToken();
    
    admission.confirmationToken = confirmationToken;
    admission.tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

    admission.status = 'offered';
    
    await admission.save();
    
    const acceptUrl = `${config.frontendUrl}/confirm-admission/${id}/accept?token=${confirmationToken}`;
    const rejectUrl = `${config.frontendUrl}/confirm-admission/${id}/reject?token=${confirmationToken}`;
    
    await emailService.sendAdmissionOfferEmail({
      to: admission.personal.emailAddress,
      name: admission.personal.fullName,
      programDetails: additionalInfo.programDetails || '',
      startDate: admission.createdAt.toDateString() || '',
      scholarshipInfo: additionalInfo.scholarshipInfo || '',
      additionalNotes: additionalInfo.additionalNotes || '',
      acceptUrl,
      rejectUrl,
      expiryDays: 7
    });
  }
  
  private generateConfirmationToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

export const approveAdmission = new ApproveAdmission();