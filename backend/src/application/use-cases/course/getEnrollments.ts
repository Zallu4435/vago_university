import { EnrollmentModel } from '../../../infrastructure/database/mongoose/models/enrollment.model';
import { CourseModel } from '../../../infrastructure/database/mongoose/models/course.model';

interface GetEnrollmentsParams {
  courseId: string;
  page: number;
  limit: number;
  status: string;
}

interface GetEnrollmentsResponse {
  enrollments: any[];
  totalEnrollments: number;
  totalPages: number;
  currentPage: number;
}

class GetEnrollments {
  async execute({
    courseId,
    page,
    limit,
    status,
  }: GetEnrollmentsParams): Promise<GetEnrollmentsResponse> {
    try {
      console.log(`Executing getEnrollments use case with params:`, {
        courseId,
        page,
        limit,
        status,
      });

      // Verify course exists
      const course = await CourseModel.findById(courseId).catch((err) => {
        throw new Error(`Failed to query course: ${err.message}`);
      });
      if (!course) {
        throw new Error('Course not found');
      }

      const query: any = { courseId };
      if (status !== 'all') query.status = status;

      const totalEnrollments = await EnrollmentModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count enrollments: ${err.message}`);
      });
      const totalPages = Math.ceil(totalEnrollments / limit);
      const skip = (page - 1) * limit;

      const enrollments = await EnrollmentModel.find(query)
        .populate('studentId', 'fullName')
        .select('studentId courseId term status requestedAt reason')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query enrollments: ${err.message}`);
        });

      // Transform enrollments to match the EnrollmentRequest interface
      const transformedEnrollments = enrollments.map(enrollment => ({
        id: enrollment._id,
        studentName: enrollment.studentId?.fullName || 'Unknown',
        studentId: enrollment.studentId?._id || enrollment.studentId,
        courseTitle: course.title,
        term: enrollment.term,
        status: enrollment.status,
        requestedAt: enrollment.requestedAt.toISOString(),
        reason: enrollment.reason,
      }));

      return {
        enrollments: transformedEnrollments,
        totalEnrollments,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getEnrollments use case:`, err);
      throw err;
    }
  }
}

export const getEnrollments = new GetEnrollments();