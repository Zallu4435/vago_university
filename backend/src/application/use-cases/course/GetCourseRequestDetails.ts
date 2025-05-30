import mongoose from 'mongoose';
import { EnrollmentModel } from '../../../infrastructure/database/mongoose/models/enrollment.model';
import { CourseModel } from '../../../infrastructure/database/mongoose/models/course.model';
import { User as UserModel } from '../../../infrastructure/database/mongoose/models/user.model';

interface GetCourseRequestDetailsInput {
  id: string;
}

interface CourseRequestDetails {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  reason: string;
  additionalInfo?: string;
  course: {
    id: string;
    title: string;
    specialization: string;
    term: string;
    faculty: string;
    credits: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

class GetCourseRequestDetails {
  async execute(id: string): Promise<CourseRequestDetails> {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('Invalid course request ID');
      }

      const courseRequest = await EnrollmentModel.findById(id)
        .select('courseId studentId status reason requestedAt updatedAt')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch course request: ${err.message}`);
        });

      if (!courseRequest) {
        throw new Error('Course request not found');
      }

      const course = await CourseModel.findById(courseRequest.courseId)
        .select('title specialization term faculty credits')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch course: ${err.message}`);
        });

      if (!course) {
        throw new Error('Associated course not found');
      }

      let user = null;
      if (courseRequest.studentId) {
        user = await UserModel.findById(courseRequest.studentId)
          .select('firstName lastName email')
          .lean()
          .catch((err) => {
            throw new Error(`Failed to fetch user: ${err.message}`);
          });
      }

      return {
        id: courseRequest._id.toString(),
        status: courseRequest.status,
        createdAt: courseRequest.requestedAt.toISOString(),
        updatedAt: courseRequest.updatedAt?.toISOString() || new Date().toISOString(),
        reason: courseRequest.reason || 'No reason provided',
        additionalInfo: courseRequest.additionalInfo || undefined,
        course: {
          id: course._id.toString(),
          title: course.title,
          specialization: course.specialization,
          term: course.term,
          faculty: course.faculty,
          credits: course.credits,
        },
        user: user
          ? {
              id: user._id.toString(),
              name: `${user.firstName} ${user.lastName || ''}`.trim(),
              email: user.email,
            }
          : undefined,
      };
    } catch (err) {
      console.error(`Error in GetCourseRequestDetails use case:`, err);
      throw err;
    }
  }
}

export const getCourseRequestDetails = new GetCourseRequestDetails();