import { EnrollmentModel } from '../../../infrastructure/database/mongoose/models/enrollment.model';
import { CourseModel } from '../../../infrastructure/database/mongoose/models/course.model';

interface RejectEnrollmentParams {
  courseId: string;
  enrollmentId: string;
  reason: string;
}

class RejectEnrollment {
  async execute({ courseId, enrollmentId, reason }: RejectEnrollmentParams): Promise<void> {
    try {
      console.log(`Executing rejectEnrollment use case with params:`, { courseId, enrollmentId, reason });

      // Verify course exists
      const course = await CourseModel.findById(courseId).catch((err) => {
        throw new Error(`Failed to query course: ${err.message}`);
      });
      if (!course) {
        throw new Error('Course not found');
      }

      // Update enrollment status and reason
      const enrollment = await EnrollmentModel.findOneAndUpdate(
        { _id: enrollmentId, courseId, status: 'Pending' },
        { status: 'Rejected', reason },
        { new: true }
      ).catch((err) => {
        throw new Error(`Failed to update enrollment: ${err.message}`);
      });

      if (!enrollment) {
        throw new Error('Enrollment not found or already processed');
      }
    } catch (err) {
      console.error(`Error in rejectEnrollment use case:`, err);
      throw err;
    }
  }
}

export const rejectEnrollment = new RejectEnrollment();