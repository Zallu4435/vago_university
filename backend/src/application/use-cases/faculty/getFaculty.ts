import { FacultyRegister } from '../../../infrastructure/database/mongoose/models/facultyRegister.model';

interface GetFacultyParams {
  page: number;
  limit: number;
  department: string;
  qualification: string;
  experience: string;
}

interface GetFacultyResponse {
  faculty: any[];
  totalFaculty: number;
  totalPages: number;
  currentPage: number;
}

class GetFaculty {
  async execute({
    page,
    limit,
    department,
    qualification,
    experience,
  }: GetFacultyParams): Promise<GetFacultyResponse> {
    try {
      console.log(`Executing getFaculty use case with params:`, {
        page,
        limit,
        department,
        qualification,
        experience,
      });

      const query: any = {};
      if (department !== 'all') query.department = department;
      if (qualification !== 'all') query.qualification = qualification;
      if (experience !== 'all') query.experience = experience;

      const totalFaculty = await FacultyRegister.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count faculty documents: ${err.message}`);
      });
      const totalPages = Math.ceil(totalFaculty / limit);
      const skip = (page - 1) * limit;

      const faculty = await FacultyRegister.find(query)
        .select('fullName email phone department qualification experience aboutMe cvUrl certificatesUrl createdAt')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query faculty: ${err.message}`);
        });

      return {
        faculty,
        totalFaculty,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getFaculty use case:`, err);
      throw err;
    }
  }
}

export const getFaculty = new GetFaculty();