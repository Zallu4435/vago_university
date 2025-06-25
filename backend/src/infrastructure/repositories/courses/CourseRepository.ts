import {
    GetCoursesRequestDTO,
    GetCourseByIdRequestDTO,
    CreateCourseRequestDTO,
    UpdateCourseRequestDTO,
    DeleteCourseRequestDTO,
  } from "../../../domain/courses/dtos/CourseRequestDTOs";
  import {
    GetCoursesResponseDTO,
    GetCourseByIdResponseDTO,
    CreateCourseResponseDTO,
    UpdateCourseResponseDTO,
    CourseSummaryDTO,
  } from "../../../domain/courses/dtos/CourseResponseDTOs";
  import {
    GetEnrollmentsRequestDTO,
    ApproveEnrollmentRequestDTO,
    RejectEnrollmentRequestDTO,
    GetCourseRequestDetailsRequestDTO,
    GetEnrollmentsResponseDTO,
    GetCourseRequestDetailsResponseDTO,
    SimplifiedEnrollmentDTO,
  } from "../../../domain/courses/dtos/EnrollmentRequestDTOs";
  import { ICoursesRepository } from "../../../application/courses/repositories/ICoursesRepository";
  import { CourseModel, EnrollmentModel } from "../../../infrastructure/database/mongoose/models/courses/CourseModel";
  import { User as UserModel } from "../../../infrastructure/database/mongoose/models/user.model";
  import { Course } from "../../../domain/courses/entities/Course";
  import { Enrollment, EnrollmentStatus } from "../../../domain/courses/entities/CourseEnrollment";
  import { CourseErrorType } from "../../../domain/courses/enums/CourseErrorType";
  import mongoose from "mongoose";
  
  export class CoursesRepository implements ICoursesRepository {
    async getCourses(params: GetCoursesRequestDTO): Promise<GetCoursesResponseDTO> {
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
      if (search) {
        query.$text = { $search: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") };
      }
  
      const skip = (page - 1) * limit;
      const courses = await CourseModel.find(query)
        .select("title specialization faculty term credits")
        .skip(skip)
        .limit(limit)
        .lean();
      const totalItems = await CourseModel.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);
  
      const mappedCourses: CourseSummaryDTO[] = courses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
        specialization: course.specialization,
        faculty: course.faculty,
        term: course.term || "",
        credits: course.credits,
      }));
  
      return {
        data: mappedCourses,
        totalItems,
        totalPages,
        currentPage: page,
      };
    }
  
    async getCourseById(params: GetCourseByIdRequestDTO): Promise<GetCourseByIdResponseDTO | null> {

      const course = await CourseModel.findById(params.id).lean();
      if (!course) {
        return null;
      }
  
      return {
        course: new Course({
          id: course._id.toString(),
          title: course.title,
          specialization: course.specialization,
          faculty: course.faculty,
          credits: course.credits,
          schedule: course.schedule,
          maxEnrollment: course.maxEnrollment,
          currentEnrollment: course.currentEnrollment,
          description: course.description,
          term: course.term,
          prerequisites: course.prerequisites,
        }),
      };
    }
  
    async createCourse(params: CreateCourseRequestDTO): Promise<CreateCourseResponseDTO> {
      const newCourse = await CourseModel.create(params);
      return {
        course: new Course({
          id: newCourse._id.toString(),
          title: newCourse.title,
          specialization: newCourse.specialization,
          faculty: newCourse.faculty,
          credits: newCourse.credits,
          schedule: newCourse.schedule,
          maxEnrollment: newCourse.maxEnrollment,
          currentEnrollment: newCourse.currentEnrollment,
          description: newCourse.description,
          term: newCourse.term,
          prerequisites: newCourse.prerequisites,
        }),
      };
    }
  
    async updateCourse(params: UpdateCourseRequestDTO): Promise<UpdateCourseResponseDTO | null> {
      const updatedCourse = await CourseModel.findByIdAndUpdate(
        params.id,
        { $set: { ...params, updatedAt: new Date() } },
        { new: true }
      ).lean();
      if (!updatedCourse) {
        return null;
      }
  
      return {
        course: new Course({
          id: updatedCourse._id.toString(),
          title: updatedCourse.title,
          specialization: updatedCourse.specialization,
          faculty: updatedCourse.faculty,
          credits: updatedCourse.credits,
          schedule: updatedCourse.schedule,
          maxEnrollment: updatedCourse.maxEnrollment,
          currentEnrollment: updatedCourse.currentEnrollment,
          description: updatedCourse.description,
          term: updatedCourse.term,
          prerequisites: updatedCourse.prerequisites,
        }),
      };
    }
  
    async deleteCourse(params: DeleteCourseRequestDTO): Promise<void> {
      await CourseModel.findByIdAndDelete(params.id);
    }
  
    async getEnrollments(params: GetEnrollmentsRequestDTO): Promise<GetEnrollmentsResponseDTO> {
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
          return {
            data: [],
            totalItems: 0,
            totalPages: 0,
            currentPage: page,
          };
        }
        query.courseId = { $in: courseIds };
      }
  
      const totalItems = await EnrollmentModel.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;
  
      const enrollments = await EnrollmentModel.find(query)
        .populate("studentId", "email")
        .populate("courseId", "title specialization term")
        .select("courseId status requestedAt")
        .skip(skip)
        .limit(limit)
        .lean();
  
      const mappedEnrollments: SimplifiedEnrollmentDTO[] = enrollments.map((enrollment) => ({
        id: enrollment._id.toString(),
        studentName: (enrollment.studentId as any)?.email || "Unknown",
        studentId: (enrollment.studentId as any)?._id?.toString() || "",
        courseTitle: (enrollment.courseId as any)?.title || "Unknown Course",
        requestedAt: enrollment.requestedAt?.toISOString() || "",
        status: enrollment.status,
        specialization: (enrollment.courseId as any)?.specialization || "N/A",
        term: (enrollment.courseId as any)?.term || "N/A",
      }));
  
      return {
        data: mappedEnrollments,
        totalItems,
        totalPages,
        currentPage: page,
      };
    }
  
    async approveEnrollment(params: ApproveEnrollmentRequestDTO): Promise<void> {
      const enrollment = await EnrollmentModel.findById(params.id).lean();
      if (!enrollment) {
        throw new Error(CourseErrorType.EnrollmentNotFound);
      }
  
      if (enrollment.status !== EnrollmentStatus.Pending) {
        throw new Error(CourseErrorType.EnrollmentNotPending);
      }
  
      const course = await CourseModel.findById(enrollment.courseId).lean();
      if (!course) {
        throw new Error(CourseErrorType.CourseNotFound);
      }
      if (course.currentEnrollment >= course.maxEnrollment) {
        throw new Error(CourseErrorType.CourseFull);
      }
  
      await EnrollmentModel.findByIdAndUpdate(
        params.id,
        { status: EnrollmentStatus.Approved, updatedAt: new Date() },
        { runValidators: true }
      );
  
      await CourseModel.findByIdAndUpdate(
        enrollment.courseId,
        { $inc: { currentEnrollment: 1 }, updatedAt: new Date() },
        { new: true }
      );
    }
  
    async rejectEnrollment(params: RejectEnrollmentRequestDTO): Promise<void> {
      const enrollment = await EnrollmentModel.findById(params.id).lean();
      if (!enrollment) {
        throw new Error(CourseErrorType.EnrollmentNotFound);
      }
  
      if (enrollment.status !== EnrollmentStatus.Pending) {
        throw new Error(CourseErrorType.EnrollmentNotPending);
      }
  
      await EnrollmentModel.findByIdAndUpdate(
        params.id,
        { status: EnrollmentStatus.Rejected, updatedAt: new Date() },
        { runValidators: true }
      );
    }
  
    async getCourseRequestDetails(params: GetCourseRequestDetailsRequestDTO): Promise<GetCourseRequestDetailsResponseDTO | null> {
      if (!mongoose.isValidObjectId(params.id)) {
        throw new Error(CourseErrorType.InvalidEnrollmentId);
      }
  
      const enrollment = await EnrollmentModel.findById(params.id)
        .populate({
          path: "studentId",
          select: "firstName lastName email",
        })
        .populate({
          path: "courseId",
          select: "title specialization term faculty credits",
        })
        .lean();
  
      if (!enrollment) {
        return null;
      }
  
      if (!enrollment.courseId) {
        throw new Error(CourseErrorType.CourseNotFound);
      }
  
      return {
        courseRequest: {
          id: enrollment._id.toString(),
          status: enrollment.status,
          createdAt: enrollment.requestedAt.toISOString(),
          updatedAt: enrollment.updatedAt?.toISOString() || new Date().toISOString(),
          reason: enrollment.reason || "No reason provided",
          course: {
            id: (enrollment.courseId as any)._id.toString(),
            title: (enrollment.courseId as any).title,
            specialization: (enrollment.courseId as any).specialization,
            term: (enrollment.courseId as any).term || "",
            faculty: (enrollment.courseId as any).faculty,
            credits: (enrollment.courseId as any).credits,
          },
          user: enrollment.studentId
            ? {
                id: (enrollment.studentId as any)._id.toString(),
                name: `${(enrollment.studentId as any).firstName} ${(enrollment.studentId as any).lastName || ''}`.trim(),
                email: (enrollment.studentId as any).email,
              }
            : undefined,
        },
      };
    }
  }