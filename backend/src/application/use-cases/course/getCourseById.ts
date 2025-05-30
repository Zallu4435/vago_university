import { CourseModel } from "../../../infrastructure/database/mongoose/models/course.model";

class GetCourseById {
  async execute(id: string): Promise<any> {
    try {
      const course = await CourseModel.findById(id)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query course: ${err.message}`);
        });

      if (!course) {
        throw new Error("Course not found");
      }

      return course;
    } catch (err) {
      console.error(`Error in getCourseById use case:`, err);
      throw err;
    }
  }
}

export const getCourseById = new GetCourseById();
