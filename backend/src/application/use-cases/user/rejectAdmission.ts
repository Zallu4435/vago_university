// backend/src/application/use-cases/admission/rejectAdmission.ts
import { Admission } from '../../../infrastructure/database/mongoose/models/admission.model';

class RejectAdmission {
  async execute(id: string): Promise<void> {
    console.log(`Executing rejectAdmission use case with id: ${id}`);

    const admission = await Admission.findById(id);

    if (!admission) {
      throw new Error('Admission not found');
    }

    if (admission.status !== 'pending') {
      throw new Error('Admission already processed');
    }

    admission.status = 'rejected';
    admission.rejectedBy = 'admin';
    await admission.save();
  }
}

export const rejectAdmission = new RejectAdmission();