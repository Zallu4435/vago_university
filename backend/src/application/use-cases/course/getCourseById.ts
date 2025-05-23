import { CourseModel } from '../../../infrastructure/database/mongoose/models/course.model';

class GetCourseById {
  async execute(id: string): Promise<any> {
    try {
      console.log(`Executing getCourseById use case with id:`, id);

      const course = await CourseModel.findById(id)
        .select('title specialization faculty credits schedule maxEnrollment currentEnrollment description prerequisites')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query course: ${err.message}`);
        });

      if (!course) {
        throw new Error('Course not found');
      }

      return course;
    } catch (err) {
      console.error(`Error in getCourseById use case:`, err);
      throw err;
    }
  }
}

export const getCourseById = new GetCourseById();