import { FacultyRegister } from '../../../infrastructure/database/mongoose/models/facultyRegister.model';

interface ApproveFacultyParams {
  id: string;
  additionalInfo: {
    department: string;
    startDate: string;
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

    // Update faculty status or details (e.g., mark as approved)
    faculty.department = additionalInfo.department;
    await faculty.save();

    // Mock email sending logic (replace with actual email service integration)
    console.log(`Approval email would be sent to ${faculty.email} with details:`, {
      department: additionalInfo.department,
      startDate: additionalInfo.startDate,
      additionalNotes: additionalInfo.additionalNotes,
    });
  }
}

export const approveFaculty = new ApproveFaculty();