import { FacultyRegister } from '../../../infrastructure/database/mongoose/models/facultyRegister.model';

class RejectFaculty {
  async execute(id: string): Promise<void> {
    try {
      console.log(`Executing rejectFaculty use case with id: ${id}`);

      const faculty = await FacultyRegister.findById(id);

      if (!faculty) {
        throw new Error('Faculty not found');
      }

      if (faculty.status && faculty.status !== 'pending') {
        throw new Error('Faculty registration already processed');
      }

      faculty.status = 'rejected';
      faculty.rejectedBy = 'admin';
      await faculty.save();
    } catch (err) {
      console.error(`Error in rejectFaculty use case:`, err);
      throw err;
    }
  }
}

export const rejectFaculty = new RejectFaculty();