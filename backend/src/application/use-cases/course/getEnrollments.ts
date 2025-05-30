import { EnrollmentModel } from "../../../infrastructure/database/mongoose/models/enrollment.model";
import { CourseModel } from "../../../infrastructure/database/mongoose/models/course.model";

interface GetEnrollmentsParams {
  page: number;
  limit: number;
  status: string;
  specialization?: string;
  term?: string;
}

interface TransformedEnrollment {
  id: string;
  studentName: string;
  studentId: string;
  courseTitle: string;
  requestedAt: string;
  status: string;
  specialization: string;
  term: string; // Added term to interface
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
    specialization,
    term,
  }: GetEnrollmentsParams): Promise<GetEnrollmentsResponse> {
    try {
      if (page < 1 || limit < 1) throw new Error("Invalid pagination params");

      const query: any = {};
      if (status !== "all") {
        query.status = {
          $regex: `^${status.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          $options: "i",
        };
      }

      let courseIds: string[] | undefined;
      if (
        (specialization && specialization !== "all") ||
        (term && term !== "all")
      ) {
        const courseQuery: any = {};
        if (specialization && specialization !== "all") {
          const formattedSpecialization = specialization.replace(/_/g, " ");
          courseQuery.specialization = {
            $regex: `^${formattedSpecialization.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            )}$`,
            $options: "i",
          };
        }
        if (term && term !== "all") {
          const formattedTerm = term.replace(/_/g, " ");
          courseQuery.term = {
            $regex: `^${formattedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            $options: "i",
          };
        }

        const courses = await CourseModel.find(courseQuery)
          .select("_id")
          .lean();
        courseIds = courses.map((course) => course._id.toString());
        if (courseIds.length === 0) {
          return {
            enrollments: [],
            totalEnrollments: 0,
            totalPages: 0,
            currentPage: page,
          };
        }
        query.courseId = { $in: courseIds };
      }

      const totalEnrollments = await EnrollmentModel.countDocuments(query);
      const totalPages = Math.ceil(totalEnrollments / limit);
      const skip = (page - 1) * limit;

      const enrollments = await EnrollmentModel.find(query)
        .populate("studentId", "email")
        .populate("courseId", "title specialization term")
        .select("courseId status requestedAt reason")
        .skip(skip)
        .limit(limit)
        .lean();

      const transformedEnrollments: TransformedEnrollment[] = enrollments.map(
        (enrollment) => ({
          id: enrollment._id.toString(),
          studentName: enrollment.studentId?.email || "Unknown",
          studentId: enrollment.studentId?._id?.toString() || "",
          courseTitle: enrollment.courseId?.title || "Unknown Course",
          requestedAt: enrollment.requestedAt?.toISOString() || "",
          status: enrollment.status,
          specialization: enrollment.courseId?.specialization || "N/A",
          term: enrollment.courseId?.term || "N/A",
        })
      );

      return {
        enrollments: transformedEnrollments,
        totalEnrollments,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in GetEnrollments use case:`, err);
      throw new Error(err.message || "Failed to fetch enrollments");
    }
  }
}

export const getEnrollments = new GetEnrollments();
