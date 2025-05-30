import { CourseModel } from "../../../infrastructure/database/mongoose/models/course.model";
import { EnrollmentModel } from "../../../infrastructure/database/mongoose/models/enrollment.model";

class DeleteCourse {
  async execute(id: string): Promise<void> {
    try {
      const course = await CourseModel.findById(id).catch((err) => {
        throw new Error(`Failed to query course: ${err.message}`);
      });
      if (!course) {
        throw new Error("Course not found");
      }

      await EnrollmentModel.deleteMany({ courseId: id }).catch((err) => {
        throw new Error(`Failed to delete enrollments: ${err.message}`);
      });

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
