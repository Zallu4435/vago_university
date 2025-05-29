import { EnrollmentModel } from "../../../infrastructure/database/mongoose/models/enrollment.model";
import { CourseModel } from "../../../infrastructure/database/mongoose/models/course.model";

interface ApproveEnrollmentParams {
  enrollmentId: string;
}

class ApproveEnrollment {
  async execute({ enrollmentId }: ApproveEnrollmentParams): Promise<void> {
    try {
      console.log(`Executing approveEnrollment use case with params:`, {
        enrollmentId,
      });

      // Find enrollment to get courseId
      const enrollment = await EnrollmentModel.findById(enrollmentId).lean();
      if (!enrollment) {
        throw new Error("Enrollment not found");
      }

      const courseId = enrollment.courseId;

      // Verify course exists and has capacity
      const course = await CourseModel.findById(courseId).catch((err) => {
        throw new Error(`Failed to query course: ${err.message}`);
      });
      if (!course) {
        throw new Error("Course not found");
      }
      if (course.currentEnrollment >= course.maxEnrollment) {
        throw new Error('Course has reached maximum enrollment');
      }

      // Update enrollment status
      const updatedEnrollment = await EnrollmentModel.findOneAndUpdate(
        {
          _id: enrollmentId,
          status: { $regex: "^pending$", $options: "i" }, // Case-insensitive match
        },
        { status: "approved" },
        { new: true }
      ).catch((err) => {
        throw new Error(`Failed to update enrollment: ${err.message}`);
      });

      if (!updatedEnrollment) {
        throw new Error("Enrollment not found or already processed");
      }

      // Increment currentEnrollment
      await CourseModel.findByIdAndUpdate(courseId, {
        $inc: { currentEnrollment: 1 },
      }).catch((err) => {
        throw new Error(
          `Failed to update course enrollment count: ${err.message}`
        );
      });
    } catch (err) {
      console.error(`Error in approveEnrollment use case:`, err);
      throw err;
    }
  }
}

export const approveEnrollment = new ApproveEnrollment();
