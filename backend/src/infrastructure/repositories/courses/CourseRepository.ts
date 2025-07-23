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
    // Debug: Log all courses in the database before filtering
    const allCourses = await CourseModel.find({}).lean();
    console.log('[CourseRepository] ALL courses in DB:', allCourses);
    console.log('[CourseRepository] getCourses called with params:', params);
    const query: any = {};
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
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [
        { title: searchRegex },
        { specialization: searchRegex },
        { faculty: searchRegex },
        { description: searchRegex }
      ];
    }
    console.log('[CourseRepository] MongoDB query:', JSON.stringify(query, null, 2));
    const skip = (page - 1) * limit;
    const courses = await CourseModel.find(query)
      .select("title specialization faculty term credits")
      .sort(search ? {} : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const totalItems = await CourseModel.countDocuments(query);
    console.log(`[CourseRepository] courses found: ${courses.length}, totalItems: ${totalItems}`);
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
    const { page, limit, status, specialization, faculty, term, search } = params;
    const query: any = {};
    if (status && status.toLowerCase() !== "all") {
      query.status = {
        $regex: `^${status.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`,
        $options: "i",
      };
    }
    let courseIds: string[] | undefined;
    if ((specialization && specialization !== "all") || (faculty && faculty !== "all") || (term && term !== "all") || (search && search.trim())) {
      const courseQuery: any = {};
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
        const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i");
        courseQuery.$or = [
          { title: searchRegex },
          { specialization: searchRegex },
          { faculty: searchRegex },
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
      .populate("studentId", "email firstName lastName")
      .populate("courseId", "title specialization term faculty credits")
      .select("courseId status requestedAt studentId reason createdAt updatedAt")
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