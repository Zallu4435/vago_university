import mongoose from 'mongoose';
import { CourseModel } from '../../../infrastructure/database/mongoose/models/course.model';
import { EnrollmentModel } from '../../../infrastructure/database/mongoose/models/enrollment.model';

interface RegisterCourseInput {
  studentId: string;
  courseId: string;
  term: string;
  section: string;
  reason?: string;
}

interface RegisterCourseOutput {
  success: boolean;
  message: string;
  enrollmentId: string;
}

class RegisterCourse {
  async execute({ studentId, courseId, reason }: RegisterCourseInput): Promise<RegisterCourseOutput> {
    try {
      console.log(`Executing registerCourse use case for studentId: ${studentId}, courseId: ${courseId}`);

      if (!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(studentId)) {
        throw new Error('Invalid student or course ID');
      }

      const course = await CourseModel.findById(courseId).lean();
      if (!course) {
        throw new Error('Course not found');
      }

      const existingEnrollment = await EnrollmentModel.findOne({
        studentId,
        courseId,
        status: { $in: ['Pending', 'Approved'] },
      }).lean();
      if (existingEnrollment) {
        throw new Error('Enrollment request already exists for this course and term');
      }

      const enrollment = new EnrollmentModel({
        studentId,
        courseId,
        status: 'Pending',
        requestedAt: new Date(),
        reason,
      });

      await enrollment.save().catch((err) => {
        throw new Error(`Failed to create enrollment request: ${err.message}`);
      });

      // ✅ Atomic update to ensure safe increment of currentEnrollment
      const updatedCourse = await CourseModel.findOneAndUpdate(
        { _id: courseId, currentEnrollment: { $lt: course.maxEnrollment } },
        { $inc: { currentEnrollment: 1 } },
        { new: true }
      );

      if (!updatedCourse) {
        // Optional: Rollback enrollment if course is now full (race condition)
        await EnrollmentModel.findByIdAndDelete(enrollment._id);
        throw new Error('Course has reached maximum enrollment capacity');
      }

      return {
        success: true,
        message: 'Enrollment request submitted successfully',
        enrollmentId: enrollment._id.toString(),
      };
    } catch (err) {
      console.error(`Error in registerCourse use case:`, err);
      throw err;
    }
  }
}

export const registerCourse = new RegisterCourse();