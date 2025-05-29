import { EnrollmentModel } from '../../../infrastructure/database/mongoose/models/enrollment.model';
import { CourseModel } from '../../../infrastructure/database/mongoose/models/course.model';

interface GetEnrollmentsParams {
  page: number;
  limit: number;
  status: string;
}

interface TransformedEnrollment {
  id: string;
  studentName: string;
  studentId: string;
  courseTitle: string;
  requestedAt: string;
  status: string;
  specialization: string;
}

interface GetEnrollmentsResponse {
  enrollments: TransformedEnrollment[];
  totalEnrollments: number;
  totalPages: number;
  currentPage: number;
}

class GetEnrollments {
  async execute({
    page,
    limit,
    status,
  }: GetEnrollmentsParams): Promise<GetEnrollmentsResponse> {
    try {
      if (page < 1 || limit < 1) throw new Error('Invalid pagination params');

      const query: any = {};
      if (status !== 'all') query.status = status;

      const totalEnrollments = await EnrollmentModel.countDocuments(query);
      const totalPages = Math.ceil(totalEnrollments / limit);
      const skip = (page - 1) * limit;

      const enrollments = await EnrollmentModel.find(query)
        .populate('studentId', 'email')
        .populate('courseId', 'title specialization')
        .select('courseId term status requestedAt reason')
        .skip(skip)
        .limit(limit)
        .lean();

      const transformedEnrollments: TransformedEnrollment[] = enrollments.map(enrollment => ({
        id: enrollment._id.toString(),
        studentName: enrollment.studentId?.email || 'Unknown',
        // studentId: enrollment.studentId?._id?.toString() || '',
        courseTitle: enrollment.courseId?.title || 'Unknown Course',
        requestedAt: enrollment.requestedAt?.toISOString() || '',
        status: enrollment.status,
        specialization: enrollment.courseId?.specialization || 'N/A',
      }));

      return {
        enrollments: transformedEnrollments,
        totalEnrollments,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in GetEnrollments use case:`, err);
      throw new Error(err.message || 'Failed to fetch enrollments');
    }
  }
}

export const getEnrollments = new GetEnrollments();
