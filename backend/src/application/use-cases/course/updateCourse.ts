import { CourseModel } from '../../../infrastructure/database/mongoose/models/course.model';

interface UpdateCourseParams {
  title?: string;
  specialization?: string;
  faculty?: string;
  credits?: number;
  schedule?: string;
  maxEnrollment?: number;
  description?: string;
  prerequisites?: string[];
}

class UpdateCourse {
  async execute(id: string, data: UpdateCourseParams): Promise<any> {
    try {
      console.log(`Executing updateCourse use case with id:`, id, `and data:`, data);

      const course = await CourseModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).lean().catch((err) => {
        throw new Error(`Failed to update course: ${err.message}`);
      });

      if (!course) {
        throw new Error('Course not found');
      }

      return course;
    } catch (err) {
      console.error(`Error in updateCourse use case:`, err);
      throw err;
    }
  }
}

export const updateCourse = new UpdateCourse();