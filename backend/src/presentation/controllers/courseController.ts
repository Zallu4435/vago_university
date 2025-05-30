import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { getCourses } from "../../application/use-cases/course/getCourses";
import { getCourseById } from "../../application/use-cases/course/getCourseById";
import { createCourse } from "../../application/use-cases/course/createCourse";
import { updateCourse } from "../../application/use-cases/course/updateCourse";
import { deleteCourse } from "../../application/use-cases/course/deleteCourse";
import { getEnrollments } from "../../application/use-cases/course/getEnrollments";
import { approveEnrollment } from "../../application/use-cases/course/approveEnrollment";
import { rejectEnrollment } from "../../application/use-cases/course/rejectEnrollment";
import { getCourseRequestDetails } from "../../application/use-cases/course/GetCourseRequestDetails";

class CourseController {
  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = "1",
        limit = "10",
        specialization = "all",
        faculty = "all",
        term = "all",
        search = "",
      } = req.query;

      if (
        isNaN(Number(page)) ||
        isNaN(Number(limit)) ||
        Number(page) < 1 ||
        Number(limit) < 1
      ) {
        return res
          .status(400)
          .json({ error: "Invalid page or limit parameters", code: 400 });
      }

      const result = await getCourses.execute({
        page: Number(page),
        limit: Number(limit),
        specialization: String(specialization),
        faculty: String(faculty),
        term: String(term),
        search: String(search).trim(),
      });

      res.status(200).json({
        courses: result.courses,
        totalPages: result.totalPages,
        totalCourses: result.totalCourses,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getCourses:`, err);
      next(err);
    }
  }

  async getCourseById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid course ID", code: 400 });
      }

      const course = await getCourseById.execute(id);
      if (!course) {
        return res.status(404).json({ error: "Course not found", code: 404 });
      }

      res.status(200).json(course);
    } catch (err) {
      console.error(`Error in getCourseById:`, err);
      next(err);
    }
  }

  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseData = req.body;

      const course = await createCourse.execute(courseData);
      res.status(201).json(course);
    } catch (err) {
      console.error(`Error in createCourse:`, err);
      next(err);
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const courseData = req.body;
      console.log(
        `Received PUT /api/admin/courses/${id} with data:`,
        courseData
      );

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid course ID", code: 400 });
      }

      const course = await updateCourse.execute(id, courseData);
      if (!course) {
        return res.status(404).json({ error: "Course not found", code: 404 });
      }

      res.status(200).json(course);
    } catch (err) {
      console.error(`Error in updateCourse:`, err);
      next(err);
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received DELETE /api/admin/courses/${id}`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid course ID", code: 400 });
      }

      await deleteCourse.execute(id);
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
      console.error(`Error in deleteCourse:`, err);
      next(err);
    }
  }

  async getEnrollments(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = "1",
        limit = "10",
        status = "all",
        specialization,
        term,
      } = req.query;

      if (
        isNaN(Number(page)) ||
        isNaN(Number(limit)) ||
        Number(page) < 1 ||
        Number(limit) < 1
      ) {
        return res
          .status(400)
          .json({ error: "Invalid page or limit parameters", code: 400 });
      }

      const result = await getEnrollments.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
        specialization: specialization ? String(specialization) : undefined,
        term: term ? String(term) : undefined,
      });

      res.status(200).json({
        enrollments: result.enrollments,
        totalPages: result.totalPages,
        totalEnrollments: result.totalEnrollments,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getEnrollments:`, err);
      next(err);
    }
  }

  async approveEnrollment(req: Request, res: Response, next: NextFunction) {
    try {
      const { enrollmentId } = req.params;

      if (!mongoose.isValidObjectId(enrollmentId)) {
        return res
          .status(400)
          .json({ error: "Invalid enrollment ID", code: 400 });
      }

      await approveEnrollment.execute({ enrollmentId });
      res.status(200).json({ message: "Enrollment approved successfully" });
    } catch (err) {
      console.error(`Error in approveEnrollment:`, err);
      next(err);
    }
  }

  async rejectEnrollment(req: Request, res: Response, next: NextFunction) {
    try {
      const { enrollmentId } = req.params;
      const { reason } = req.body;

      if (!mongoose.isValidObjectId(enrollmentId)) {
        return res
          .status(400)
          .json({ error: "Invalid enrollment ID", code: 400 });
      }
      if (!reason) {
        return res
          .status(400)
          .json({ error: "Reason is required for rejection", code: 400 });
      }

      await rejectEnrollment.execute({ enrollmentId, reason });
      res.status(200).json({ message: "Enrollment rejected successfully" });
    } catch (err) {
      console.error(`Error in rejectEnrollment:`, err);
      next(err);
    }
  }

  async getCourseRequestDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid course request ID",
          statusCode: 400,
        });
      }

      const courseRequest = await getCourseRequestDetails.execute(id);
      res.status(200).json({ data: courseRequest });
    } catch (err: any) {
      console.error(`Error in getCourseRequestDetails:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }
}

export const courseController = new CourseController();
