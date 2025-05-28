import mongoose from 'mongoose';
import { EnrollmentModel } from '../../../infrastructure/database/mongoose/models/enrollment.model';

interface DropCourseInput {
  studentId: string;
  courseId: string;
}

interface DropCourseOutput {
  success: boolean;
  message: string;
}

class DropCourse {
  async execute({ studentId, courseId }: DropCourseInput): Promise<DropCourseOutput> {
    try {
      console.log(`Executing dropCourse use case for studentId: ${studentId}, courseId: ${courseId}`);

      if (!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(studentId)) {
        throw new Error('Invalid student or course ID');
      }

      const enrollment = await EnrollmentModel.findOneAndDelete({
        studentId,
        courseId,
        status: { $in: ['Pending', 'Approved'] },
      }).lean();
      if (!enrollment) {
        throw new Error('Enrollment request not found or already rejected');
      }

      return {
        success: true,
        message: 'Course dropped successfully',
      };
    } catch (err) {
      console.error(`Error in dropCourse use case:`, err);
      throw err;
    }
  }
}

export const dropCourse = new DropCourse(); 