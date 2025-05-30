import { Router } from "express";
import { courseController } from "../controllers/courseController";

const router = Router();

router.get("/course-enrollments", courseController.getEnrollments);
router.get(
  "/course-enrollments/:id/details",
  courseController.getCourseRequestDetails
);
router.post(
  "/course-enrollments/:enrollmentId/approve",
  courseController.approveEnrollment
);
router.post(
  "/course-enrollments/:enrollmentId/reject",
  courseController.rejectEnrollment
);

router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", courseController.createCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

export default router;
