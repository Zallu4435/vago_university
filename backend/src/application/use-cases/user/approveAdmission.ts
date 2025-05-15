// backend/src/application/use-cases/admission/approveAdmission.ts
import { Admission } from '../../../infrastructure/database/mongoose/models/admission.model';

class ApproveAdmission {
  async execute(id: string): Promise<void> {
    console.log(`Executing approveAdmission use case with id: ${id}`);

    const admission = await Admission.findById(id);

    if (!admission) {
      throw new Error('Admission not found');
    }

    if (admission.status !== 'pending') {
      throw new Error('Admission already processed');
    }

    admission.status = 'approved';
    await admission.save();
  }
}

export const approveAdmission = new ApproveAdmission();