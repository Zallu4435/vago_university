// backend/src/application/use-cases/admission/deleteAdmission.ts
import { Admission } from '../../../infrastructure/database/mongoose/models/admission.model';

class DeleteAdmission {
  async execute(id: string): Promise<void> {
    console.log(`Executing deleteAdmission use case with id: ${id}`);

    const admission = await Admission.findById(id);

    if (!admission) {
      throw new Error('Admission not found');
    }

    if (admission.status !== 'pending') {
      throw new Error('Can only delete pending admissions');
    }

    // await Admission.deleteOne({ _id: id });
  }
}

export const deleteAdmission = new DeleteAdmission();