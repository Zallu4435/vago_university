// backend/src/application/use-cases/admission/getAdmissionById.ts
import { Admission } from '../../../infrastructure/database/mongoose/models/admission.model';

interface AdmissionDetails {
  admission: any;
}

class GetAdmissionById {
  async execute(id: string): Promise<AdmissionDetails | null> {
    console.log(`Executing getAdmissionById use case with id: ${id}`);

    const admission = await Admission.findById(id).lean();

    if (!admission) {
      return null;
    }

    return {
      admission: admission
    };
  }
}

export const getAdmissionById = new GetAdmissionById();