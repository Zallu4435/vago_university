import { EnrollmentModel } from '../../../infrastructure/database/mongoose/models/enrollment.model';
import { CourseModel } from '../../../infrastructure/database/mongoose/models/course.model';

interface ApproveEnrollmentParams {
  courseId: string;
  enrollmentId: string;
}

class ApproveEnrollment {
  async execute({ courseId, enrollmentId }: ApproveEnrollmentParams): Promise<void> {
    try {
      console.log(`Executing approveEnrollment use case with params:`, { courseId, enrollmentId });

      // Verify course exists and has capacity
      const course = await CourseModel.findById(courseId).catch((err) => {
        throw new Error(`Failed to query course: ${err.message}`);
      });
      if (!course) {
        throw new Error('Course not found');
      }
      if (course.currentEnrollment >= course.maxEnrollment) {
        throw new Error('Course has reached maximum enrollment');
      }

      // Update enrollment status
      const enrollment = await EnrollmentModel.findOneAndUpdate(
        { _id: enrollmentId, courseId, status: 'Pending' },
        { status: 'Approved' },
        { new: true }
      ).catch((err) => {
        throw new Error(`Failed to update enrollment: ${err.message}`);
      });

      if (!enrollment) {
        throw new Error('Enrollment not found or already processed');
      }

      // Increment currentEnrollment
      await CourseModel.findByIdAndUpdate(
        courseId,
        { $inc: { currentEnrollment: 1 } }
      ).catch((err) => {
        throw new Error(`Failed to update course enrollment count: ${err.message}`);
      });
    } catch (err) {
      console.error(`Error in approveEnrollment use case:`, err);
      throw err;
    }
  }
}

export const approveEnrollment = new ApproveEnrollment();