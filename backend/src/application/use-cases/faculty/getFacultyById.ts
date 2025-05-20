import { FacultyRegister } from '../../../infrastructure/database/mongoose/models/facultyRegister.model';

interface FacultyDetails {
  faculty: any;
}

class GetFacultyById {
  async execute(id: string): Promise<FacultyDetails | null> {
    console.log(`Executing getFacultyById use case with id: ${id}`);

    const faculty = await FacultyRegister.findById(id)
      .select('fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt status')
      .lean();

    if (!faculty) {
      return null;
    }

    return {
      faculty,
    };
  }
}

export const getFacultyById = new GetFacultyById();