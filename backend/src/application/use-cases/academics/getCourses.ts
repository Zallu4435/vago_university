import { CourseModel } from '../../../infrastructure/database/mongoose/models/course.model';

interface GetCoursesInput {
  // No filters
}

interface Course {
  code: string;
  title: string;
  credits: number;
  instructor: string;
  schedule: string;
  id: number;
}

interface GetCoursesOutput {
  courses: Course[];
}

class GetCourses {
  async execute(): Promise<GetCoursesOutput>   {
    try {
      console.log(`Executing getCourses use case with no filters`);

      const courses = await CourseModel.find()
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch courses: ${err.message}`);
        });

      return { courses };
    } catch (err) {
      console.error(`Error in getCourses use case:`, err);
      throw err;
    }
  }
}

export const getCourses = new GetCourses();
