import { ICoursesRepository } from "../../../application/courses/repositories/ICoursesRepository";
import { CourseModel, EnrollmentModel } from "../../../infrastructure/database/mongoose/models/courses/CourseModel";
import mongoose from "mongoose";
import {
  GetEnrollmentsRequest,
  ApproveEnrollmentRequest,
  RejectEnrollmentRequest,
  GetCourseRequestDetailsRequest,
} from "../../../domain/courses/entities/EnrollmentRequestEntities";
import {
  GetCoursesRequest,
  CreateCourseRequest,
  UpdateCourseRequest,
  DeleteCourseRequest,
  CourseFilter,
} from "../../../domain/courses/entities/CourseRequestEntities";
import { PopulatedEnrollment } from "../../../domain/courses/entities/EnrollmentResponseEntities";
import { BaseRepository } from "../../../application/repositories/BaseRepository";
import { ICourseDocument } from "../../../domain/courses/entities/coursetypes";

type WithStringId<T> = Omit<T, "_id"> & { _id: string };

export class CoursesRepository extends BaseRepository<ICourseDocument, CreateCourseRequest, UpdateCourseRequest, Record<string, unknown>, ICourseDocument> implements ICoursesRepository {
  constructor() {
    super(CourseModel);
  }

  async getCourses(params: GetCoursesRequest) {
    const { page, limit, specialization, faculty, term, search } = params;
    const query: CourseFilter = {};
    if (specialization && specialization !== "all") {
      const formattedSpecialization = specialization.replace(/_/g, " ");
      query.specialization = {
        $regex: `^${formattedSpecialization.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      };
    }
    if (faculty && faculty !== "all") {
      const formattedFaculty = faculty
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      query.faculty = {
        $regex: `^${formattedFaculty.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      };
    }
    if (term && term !== "all") {
      const formattedTerm = term
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      query.term = {
        $regex: `^${formattedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      };
    }
    if (search && search.trim()) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { specialization: { $regex: escapedSearch, $options: "i" } },
        { faculty: { $regex: escapedSearch, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;
    const courses = await CourseModel.find(query)
      .select("title specialization faculty term credits currentEnrollment maxEnrollment")
      .sort(search ? {} : { updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const totalItems = await CourseModel.countDocuments(query);
    return { courses, totalItems, page, limit };
  }

  async getCourseById(id: string) {
    return CourseModel.findById(id).lean();
  }

  async createCourse(params: CreateCourseRequest) {
    return CourseModel.create(params);
  }

  async updateCourse(params: UpdateCourseRequest) {
    return CourseModel.findByIdAndUpdate(
      params.id,
      { $set: { ...params, updatedAt: new Date() } },
      { new: true }
    ).lean();
  }

  async deleteCourse(params: DeleteCourseRequest) {
    await CourseModel.findByIdAndDelete(params.id);
  }

  async getEnrollments(params: GetEnrollmentsRequest) {
    const { page, limit, status, specialization, faculty, term, search } = params;
    const query: CourseFilter = {};
    if (status && status.toLowerCase() !== "all") {
      query.status = {
        $regex: `^${status.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`,
        $options: "i",
      };
    }
    let courseIds: string[] | undefined;
    if ((specialization && specialization !== "all") || (faculty && faculty !== "all") || (term && term !== "all") || (search && search.trim())) {
      const courseQuery: CourseFilter = {};
      if (specialization && specialization !== "all") {
        const formattedSpecialization = specialization.replace(/_/g, " ");
        courseQuery.specialization = {
          $regex: `^${formattedSpecialization.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`,
          $options: "i",
        };
      }
      if (faculty && faculty !== "all") {
        const formattedFaculty = faculty
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        courseQuery.faculty = {
          $regex: `^${formattedFaculty.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`,
          $options: "i",
        };
      }
      if (term && term !== "all") {
        const formattedTerm = term.replace(/_/g, " ");
        courseQuery.term = {
          $regex: `^${formattedTerm.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`,
          $options: "i",
        };
      }
      if (search && search.trim()) {
        const escapedSearch = search.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
        courseQuery.$or = [
          { title: { $regex: escapedSearch, $options: "i" } },
          { specialization: { $regex: escapedSearch, $options: "i" } },
          { faculty: { $regex: escapedSearch, $options: "i" } },
        ];
      }
      const courses = await CourseModel.find(courseQuery).select("_id").lean();
      courseIds = courses.map((course) => course._id.toString());
      if (courseIds.length === 0) {
        return { enrollments: [], totalItems: 0, page, limit };
      }
      query.courseId = { $in: courseIds };
    }
    const totalItems = await EnrollmentModel.countDocuments(query);
    const skip = (page - 1) * limit;
    const enrollments = await EnrollmentModel.find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .populate("studentId", "email firstName lastName")
      .populate("courseId", "title specialization term faculty credits")
      .select("courseId status requestedAt studentId reason createdAt updatedAt")
      .skip(skip)
      .limit(limit)
      .lean<PopulatedEnrollment[]>({ getters: true });
    return { enrollments, totalItems, page, limit };
  }

  async approveEnrollment(params: ApproveEnrollmentRequest) {
    await EnrollmentModel.findByIdAndUpdate(params.enrollmentId, { status: "Approved" });

    const enrollment = await EnrollmentModel.findById(params.enrollmentId);
    if (enrollment && enrollment.studentId) {
      const userId = typeof enrollment.studentId === 'string' ? enrollment.studentId : enrollment.studentId._id.toString();
      const courseTitle = typeof enrollment.courseId === 'string' ? 'a course' : enrollment.courseId.title || 'a course';
      
      await this.sendRequestApprovalNotification('course enrollment', params.enrollmentId, userId, courseTitle);
    }
  }

  async rejectEnrollment(params: RejectEnrollmentRequest) {
    await EnrollmentModel.findByIdAndUpdate(params.enrollmentId, { status: "Rejected" });

    const enrollment = await EnrollmentModel.findById(params.enrollmentId);
    if (enrollment && enrollment.studentId) {
      const userId = typeof enrollment.studentId === 'string' ? enrollment.studentId : enrollment.studentId._id.toString();
      const courseTitle = typeof enrollment.courseId === 'string' ? 'a course' : enrollment.courseId.title || 'a course';
      
      await this.sendRequestRejectionNotification('course enrollment', params.enrollmentId, userId, courseTitle);
    }
  }

  async getCourseRequestDetails(params: GetCourseRequestDetailsRequest) {
    if (!mongoose.isValidObjectId(params.id)) {
      return null;
    }
    return EnrollmentModel.findById(params.id)
      .populate({
        path: "studentId",
        select: "firstName lastName email",
      })
      .populate({
        path: "courseId",
        select: "title specialization term faculty credits",
      })
      .lean<PopulatedEnrollment>({ getters: true });
  }
}