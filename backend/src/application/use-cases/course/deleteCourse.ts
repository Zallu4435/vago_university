import { CourseModel } from '../../../infrastructure/database/mongoose/models/course.model';
import { EnrollmentModel } from '../../../infrastructure/database/mongoose/models/enrollment.model';

class DeleteCourse {
  async execute(id: string): Promise<void> {
    try {
      console.log(`Executing deleteCourse use case with id:`, id);

      // Check if course exists
      const course = await CourseModel.findById(id).catch((err) => {
        throw new Error(`Failed to query course: ${err.message}`);
      });
      if (!course) {
        throw new Error('Course not found');
      }

      // Delete associated enrollments
      await EnrollmentModel.deleteMany({ courseId: id }).catch((err) => {
        throw new Error(`Failed to delete enrollments: ${err.message}`);
      });

      // Delete the course
      await CourseModel.findByIdAndDelete(id).catch((err) => {
        throw new Error(`Failed to delete course: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in deleteCourse use case:`, err);
      throw err;
    }
  }
}

export const deleteCourse = new DeleteCourse();