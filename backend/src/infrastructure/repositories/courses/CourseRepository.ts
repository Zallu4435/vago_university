import {
  GetCoursesRequestDTO,
  GetCourseByIdRequestDTO,
  CreateCourseRequestDTO,
  UpdateCourseRequestDTO,
  DeleteCourseRequestDTO,
} from "../../../domain/courses/dtos/CourseRequestDTOs";
import {
  GetEnrollmentsRequestDTO,
  ApproveEnrollmentRequestDTO,
  RejectEnrollmentRequestDTO,
  GetCourseRequestDetailsRequestDTO,
} from "../../../domain/courses/dtos/EnrollmentRequestDTOs";
import { ICoursesRepository } from "../../../application/courses/repositories/ICoursesRepository";
import { CourseModel, EnrollmentModel } from "../../../infrastructure/database/mongoose/models/courses/CourseModel";
import mongoose from "mongoose";

export class CoursesRepository implements ICoursesRepository {
  async getCourses(params: GetCoursesRequestDTO) {
    const { page, limit, specialization, faculty, term, search } = params;
    const query: any = {};
    if (specialization && specialization !== "all") {
      const formattedSpecialization = specialization.replace(/_/g, " ");
      query.specialization = {
        $regex: `^${formattedSpecialization.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      };
    }
    if (faculty && faculty !== "all") {
      query.faculty = {
        $regex: `^${faculty.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      };
    }
    if (term && term !== "all") {
      const formattedTerm = term.replace(/_/g, " ");
      query.term = {
        $regex: `^${formattedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      };
    }
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [
        { title: searchRegex },
        { specialization: searchRegex },
        { faculty: searchRegex },
        { description: searchRegex }
      ];
    }
    const skip = (page - 1) * limit;
    const courses = await CourseModel.find(query)
      .select("title specialization faculty term credits")
      .sort(search ? {} : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const totalItems = await CourseModel.countDocuments(query);
    return { courses, totalItems, page, limit };
  }

  async getCourseById(params: GetCourseByIdRequestDTO) {
    return CourseModel.findById(params.id).lean();
  }

  async createCourse(params: CreateCourseRequestDTO) {
    return CourseModel.create(params);
  }

  async updateCourse(params: UpdateCourseRequestDTO) {
    return CourseModel.findByIdAndUpdate(
      params.id,
      { $set: { ...params, updatedAt: new Date() } },
      { new: true }
    ).lean();
  }

  async deleteCourse(params: DeleteCourseRequestDTO) {
    await CourseModel.findByIdAndDelete(params.id);
  }

  async getEnrollments(params: GetEnrollmentsRequestDTO) {
    const { page, limit, status, specialization, term } = params;
    const query: any = {};
    if (status && status.toLowerCase() !== "all") {
      query.status = {
        $regex: `^${status.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      };
    }
    let courseIds: string[] | undefined;
    if ((specialization && specialization !== "all") || (term && term !== "all")) {
      const courseQuery: any = {};
      if (specialization && specialization !== "all") {
        const formattedSpecialization = specialization.replace(/_/g, " ");
        courseQuery.specialization = {
          $regex: `^${formattedSpecialization.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
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
      .populate("studentId", "email")
      .populate("courseId", "title specialization term")
      .select("courseId status requestedAt")
      .skip(skip)
      .limit(limit)
      .lean();
    return { enrollments, totalItems, page, limit };
  }

  async approveEnrollment(params: ApproveEnrollmentRequestDTO) {
    return EnrollmentModel.findById(params.enrollmentId).lean();
  }

  async rejectEnrollment(params: RejectEnrollmentRequestDTO) {
    return EnrollmentModel.findById(params.enrollmentId).lean();
  }

  async getCourseRequestDetails(params: GetCourseRequestDetailsRequestDTO) {
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
      .lean();
  }
}