import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getCoursesComposer } from "../../../infrastructure/services/courses/CourseComposers";
import { getCourseEnrollmentsComposer } from "../../../infrastructure/services/courses/CourseEnrollmentComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const courseRouter = Router();
const courseController = getCoursesComposer();
const courseEnrollmentController = getCourseEnrollmentsComposer();

// Course enrollment routes
courseRouter.get("/course-enrollments", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    courseEnrollmentController.getEnrollments.bind(courseEnrollmentController)
  )
);
courseRouter.get("/course-enrollments/:id/details", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    courseEnrollmentController.getEnrollmentDetails.bind(courseEnrollmentController)
  )
);
courseRouter.post("/course-enrollments/:id/approve", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    courseEnrollmentController.approveEnrollment.bind(courseEnrollmentController)
  )
);
courseRouter.post("/course-enrollments/:id/reject", authMiddleware, (req, res) =>
  expressAdapter(
    req,
    res,
    courseEnrollmentController.rejectEnrollment.bind(courseEnrollmentController)
  )
);

// Course routes
courseRouter.get("/", authMiddleware, (req, res) =>
  expressAdapter(req, res, courseController.getCourses.bind(courseController))
);
courseRouter.get("/:id", authMiddleware, (req, res) =>
  expressAdapter(req, res, courseController.getCourseById.bind(courseController))
);
courseRouter.post("/", authMiddleware, (req, res) =>
  expressAdapter(req, res, courseController.createCourse.bind(courseController))
);
courseRouter.put("/:id", authMiddleware, (req, res) =>
  expressAdapter(req, res, courseController.updateCourse.bind(courseController))
);
courseRouter.delete("/:id", authMiddleware, (req, res) =>
  expressAdapter(req, res, courseController.deleteCourse.bind(courseController))
);

export default courseRouter; 