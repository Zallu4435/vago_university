import { Router } from 'express';
import { courseController } from '../controllers/courseController';

const router = Router();

// Course management routes
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// Enrollment management routes
router.get('/:courseId/enrollments', courseController.getEnrollments);
router.post('/:courseId/enrollments/:enrollmentId/approve', courseController.approveEnrollment);
router.post('/:courseId/enrollments/:enrollmentId/reject', courseController.rejectEnrollment);

export default router;