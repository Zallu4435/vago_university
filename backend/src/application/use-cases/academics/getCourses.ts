import { CourseModel } from '../../../infrastructure/database/mongoose/models/courses/CourseModel';

interface GetCoursesInput {
  // No filters
}

interface GetCoursesResponse {
  courses: any[];
  totalCourses: number;
  totalPages: number;
  currentPage: number;
}

class GetCourses {
  async execute(): Promise<GetCoursesResponse> {
    try {
      const courses = await CourseModel.find()
        .select('title specialization faculty credits term')
        .lean();

      return {
        courses,
        totalCourses: courses.length,
        totalPages: 1,
        currentPage: 1
      };
    } catch (err) {
      console.error(`Error in getCourses use case:`, err);
      throw err;
    }
  }
}

export const getCourses = new GetCourses();
