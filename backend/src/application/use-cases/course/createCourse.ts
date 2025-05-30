import { CourseModel } from "../../../infrastructure/database/mongoose/models/course.model";

interface CreateCourseParams {
  title: string;
  specialization: string;
  faculty: string;
  credits: number;
  schedule: string;
  maxEnrollment: number;
  description?: string;
  prerequisites?: string[];
}

class CreateCourse {
  async execute(data: CreateCourseParams): Promise<any> {
    try {
      const course = await CourseModel.create(data).catch((err) => {
        throw new Error(`Failed to create course: ${err.message}`);
      });

      return course.toObject();
    } catch (err) {
      console.error(`Error in createCourse use case:`, err);
      throw err;
    }
  }
}

export const createCourse = new CreateCourse();
