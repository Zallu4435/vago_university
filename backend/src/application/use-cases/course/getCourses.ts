import { CourseModel } from '../../../infrastructure/database/mongoose/models/course.model';

interface GetCoursesParams {
  page: number;
  limit: number;
  specialization: string;
  faculty: string;
  term: string;
  search: string;
}

interface GetCoursesResponse {
  courses: any[];
  totalCourses: number;
  totalPages: number;
  currentPage: number;
}

class GetCourses {
  async execute({
    page,
    limit,
    specialization,
    faculty,
    term,
    search,
  }: GetCoursesParams): Promise<GetCoursesResponse> {
    try {
      console.log(`Executing getCourses use case with params:`, {
        page,
        limit,
        specialization,
        faculty,
        term,
        search,
      });

      const query: any = {};
      if (specialization !== 'all') query.specialization = specialization;
      if (faculty !== 'all') query.faculty = faculty;
      if (term !== 'all') query.schedule = { $regex: term, $options: 'i' };
      if (search) query.$text = { $search: search };

      const totalCourses = await CourseModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count courses: ${err.message}`);
      });
      const totalPages = Math.ceil(totalCourses / limit);
      const skip = (page - 1) * limit;

      const courses = await CourseModel.find(query)
        .select('title specialization faculty credits schedule maxEnrollment currentEnrollment description prerequisites')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query courses: ${err.message}`);
        });

      return {
        courses,
        totalCourses,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getCourses use case:`, err);
      throw err;
    }
  }
}

export const getCourses = new GetCourses();