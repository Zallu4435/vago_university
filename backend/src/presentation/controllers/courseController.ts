import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { getCourses } from '../../application/use-cases/course/getCourses';
import { getCourseById } from '../../application/use-cases/course/getCourseById';
import { createCourse } from '../../application/use-cases/course/createCourse';
import { updateCourse } from '../../application/use-cases/course/updateCourse';
import { deleteCourse } from '../../application/use-cases/course/deleteCourse';
import { getEnrollments } from '../../application/use-cases/course/getEnrollments';
import { approveEnrollment } from '../../application/use-cases/course/approveEnrollment';
import { rejectEnrollment } from '../../application/use-cases/course/rejectEnrollment';

class CourseController {
  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = '1',
        limit = '10',
        specialization = 'all',
        faculty = 'all',
        term = 'all',
        search = '',
      } = req.query;

      console.log(`Received GET /api/admin/courses with filters:`, {
        page,
        limit,
        specialization,
        faculty,
        term,
        search,
      });

      // Validate query parameters
      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
        return res.status(400).json({ error: 'Invalid page or limit parameters', code: 400 });
      }

      const result = await getCourses.execute({
        page: Number(page),
        limit: Number(limit),
        specialization: String(specialization),
        faculty: String(faculty),
        term: String(term),
        search: String(search),
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
      console.log(`Received GET /api/admin/courses/${id}`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid course ID', code: 400 });
      }

      const course = await getCourseById.execute(id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found', code: 404 });
      }

      res.status(200).json(course);
    } catch (err) {
      console.error(`Error in getCourseById:`, err);
      next(err);
    }
  }

  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseData = req.body; // Removed sanitize
      console.log(`Received POST /api/admin/courses with data:`, courseData);

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
      const courseData = req.body; // Removed sanitize
      console.log(`Received PUT /api/admin/courses/${id} with data:`, courseData);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid course ID', code: 400 });
      }

      const course = await updateCourse.execute(id, courseData);
      if (!course) {
        return res.status(404).json({ error: 'Course not found', code: 404 });
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
        return res.status(400).json({ error: 'Invalid course ID', code: 400 });
      }

      await deleteCourse.execute(id);
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
      console.error(`Error in deleteCourse:`, err);
      next(err);
    }
  }

  async getEnrollments(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10', status = 'all' } = req.query;


      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
        return res.status(400).json({ error: 'Invalid page or limit parameters', code: 400 });
      }

      const result = await getEnrollments.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
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
        return res.status(400).json({ error: 'Invalid enrollment ID', code: 400 });
      }

      await approveEnrollment.execute({ enrollmentId });
      res.status(200).json({ message: 'Enrollment approved successfully' });
    } catch (err) {
      console.error(`Error in approveEnrollment:`, err);
      next(err);
    }
  }

  async rejectEnrollment(req: Request, res: Response, next: NextFunction) {
    try {
      const { enrollmentId } = req.params;
      const { reason } = req.body; // Removed sanitize

      if (!mongoose.isValidObjectId(enrollmentId)) {
        return res.status(400).json({ error: 'Invalid enrollment ID', code: 400 });
      }
      if (!reason) {
        return res.status(400).json({ error: 'Reason is required for rejection', code: 400 });
      }

      await rejectEnrollment.execute({ enrollmentId, reason });
      res.status(200).json({ message: 'Enrollment rejected successfully' });
    } catch (err) {
      console.error(`Error in rejectEnrollment:`, err);
      next(err);
    }
  }
}

export const courseController = new CourseController();