import { EnrollmentModel } from '../../../infrastructure/database/mongoose/models/enrollment.model';
import { CourseModel } from '../../../infrastructure/database/mongoose/models/course.model';

interface RejectEnrollmentParams {
  enrollmentId: string;
  reason: string;
}

class RejectEnrollment {
  async execute({ enrollmentId, reason }: RejectEnrollmentParams): Promise<void> {
    try {
      console.log(`Executing rejectEnrollment use case with params:`, { enrollmentId, reason });

      // Find enrollment by ID
      const enrollment = await EnrollmentModel.findById(enrollmentId).lean();
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      const courseId = enrollment.courseId;

      // Verify course exists
      const course = await CourseModel.findById(courseId).catch((err) => {
        throw new Error(`Failed to query course: ${err.message}`);
      });
      if (!course) {
        throw new Error('Associated course not found');
      }

      // Update enrollment status and reason
      const updatedEnrollment = await EnrollmentModel.findOneAndUpdate(
        { _id: enrollmentId, status: 'Pending' },
        { status: 'Rejected', reason },
        { new: true }
      ).catch((err) => {
        throw new Error(`Failed to update enrollment: ${err.message}`);
      });

      if (!updatedEnrollment) {
        throw new Error('Enrollment not found or already processed');
      }
    } catch (err) {
      console.error(`Error in rejectEnrollment use case:`, err);
      throw new Error(err.message || 'Failed to reject enrollment');
    }
  }
}

export const rejectEnrollment = new RejectEnrollment();
