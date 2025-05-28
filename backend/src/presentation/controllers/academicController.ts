import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { getStudentInfo } from "../../application/use-cases/academics/getStudentInfo";
import { getGradeInfo } from "../../application/use-cases/academics/getGradeInfo";
import { getCourses } from "../../application/use-cases/academics/getCourses";
import { getAcademicHistory } from "../../application/use-cases/academics/getAcademicHistory";
import { getProgramInfo } from "../../application/use-cases/academics/getProgramInfo";
import { getProgressInfo } from "../../application/use-cases/academics/getProgressInfo";
import { getRequirementsInfo } from "../../application/use-cases/academics/getRequirementsInfo";
import { registerCourse } from "../../application/use-cases/academics/registerCourse";
import { dropCourse } from "../../application/use-cases/academics/dropCourse";
import { requestTranscript } from "../../application/use-cases/academics/requestTranscript";
import { scheduleMeeting } from "../../application/use-cases/academics/scheduleMeeting";

class AcademicController {
  async getStudentInfo(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(`Received GET /api/academic/student-info`);

      if (!req.user) {
        return res.status(401).json({
          error: {
            message: "Unauthorized: User not authenticated",
            code: "UNAUTHORIZED",
            status: 401,
          },
        });
      }

      console.log(req.user, "kokokkoooooo");

      const result = await getStudentInfo.execute({ userId: req.user.id });

      res.status(200).json(result);
    } catch (err: any) {
      console.error(`Error in getStudentInfo:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        },
      });
    }
  }

  async getGradeInfo(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(`Received GET /api/academic/grade-info`);

      if (!req.user) {
        return res.status(401).json({
          error: {
            message: "Unauthorized: User not authenticated",
            code: "UNAUTHORIZED",
            status: 401,
          },
        });
      }

      const result = await getGradeInfo.execute({ userId: req.user.id });

      res.status(200).json(result);
    } catch (err: any) {
      console.error(`Error in getGradeInfo:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        },
      });
    }
  }

  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(`Received GET /api/academic/courses`);

      const result = await getCourses.execute();

      res.status(200).json(result);
    } catch (err: any) {
      console.error(`Error in getCourses:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        },
      });
    }
  }

  async getAcademicHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { startTerm, endTerm } = req.query;

      console.log(`Received GET /api/academic/history with filters:`, {
        startTerm,
        endTerm,
      });

      if (!req.user) {
        return res.status(401).json({
          error: {
            message: "Unauthorized: User not authenticated",
            code: "UNAUTHORIZED",
            status: 401,
          },
        });
      }

      const result = await getAcademicHistory.execute({
        userId: req.user.id,
        startTerm: startTerm ? String(startTerm) : undefined,
        endTerm: endTerm ? String(endTerm) : undefined,
      });

      res.status(200).json(result);
    } catch (err: any) {
      console.error(`Error in getAcademicHistory:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        },
      });
    }
  }

  async getProgramInfo(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(`Received GET /api/academic/program-info`);

      if (!req.user) {
        return res.status(401).json({
          error: {
            message: "Unauthorized: User not authenticated",
            code: "UNAUTHORIZED",
            status: 401,
          },
        });
      }

      const result = await getProgramInfo.execute({ userId: req.user.id });

      res.status(200).json(result);
    } catch (err: any) {
      console.error(`Error in getProgramInfo:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        },
      });
    }
  }

  async getProgressInfo(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(`Received GET /api/academic/progress-info`);

      if (!req.user) {
        return res.status(401).json({
          error: {
            message: "Unauthorized: User not authenticated",
            code: "UNAUTHORIZED",
            status: 401,
          },
        });
      }

      const result = await getProgressInfo.execute({ userId: req.user.id });

      res.status(200).json(result);
    } catch (err: any) {
      console.error(`Error in getProgressInfo:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        },
      });
    }
  }

  async getRequirementsInfo(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(`Received GET /api/academic/requirements-info`);

      if (!req.user) {
        return res.status(401).json({
          error: {
            message: "Unauthorized: User not authenticated",
            code: "UNAUTHORIZED",
            status: 401,
          },
        });
      }

      const result = await getRequirementsInfo.execute({ userId: req.user.id });

      res.status(200).json(result);
    } catch (err: any) {
      console.error(`Error in getRequirementsInfo:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        },
      });
    }
  }

  async registerCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const { term, section } = req.body;

      console.log(
        `Received POST /api/academic/register/${courseId} with body:`,
        { term, section }
      );

      if (!mongoose.isValidObjectId(courseId)) {
        return res.status(400).json({
          error: {
            message: "Invalid course ID",
            code: "INVALID_ID",
            status: 400,
          },
        });
      }

      if (!term || !section) {
        return res.status(400).json({
          error: {
            message: "Term and section are required",
            code: "INVALID_PARAMETERS",
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({
          error: {
            message: "Unauthorized: User not authenticated",
            code: "UNAUTHORIZED",
            status: 401,
          },
        });
      }

      const result = await registerCourse.execute({
        studentId: req.user.id,
        courseId,
        term,
        section,
      });

      res.status(200).json(result);
    } catch (err: any) {
      console.error(`Error in registerCourse:`, err);
      res.status(err.message.includes("not found") ? 404 : 500).json({
        error: {
          message: err.message,
          code: err.message.includes("not found")
            ? "NOT_FOUND"
            : "INTERNAL_SERVER_ERROR",
          status: err.message.includes("not found") ? 404 : 500,
        },
      });
    }
  }

  async dropCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;

      console.log(`Received DELETE /api/academic/register/${courseId}`);

      if (!mongoose.isValidObjectId(courseId)) {
        return res.status(400).json({
          error: {
            message: "Invalid course ID",
            code: "INVALID_ID",
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({
          error: {
            message: "Unauthorized: User not authenticated",
            code: "UNAUTHORIZED",
            status: 401,
          },
        });
      }

      const result = await dropCourse.execute({
        userId: req.user.id,
        courseId,
      });

      res.status(200).json(result);
    } catch (err: any) {
      console.error(`Error in dropCourse:`, err);
      res.status(err.message.includes("not found") ? 404 : 500).json({
        error: {
          message: err.message,
          code: err.message.includes("not found")
            ? "NOT_FOUND"
            : "INTERNAL_SERVER_ERROR",
          status: err.message.includes("not found") ? 404 : 500,
        },
      });
    }
  }

  async requestTranscript(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryMethod, address, email } = req.body;

      console.log(`Received POST /api/academic/request-transcript with body:`, {
        deliveryMethod,
        address,
        email,
      });

      if (!deliveryMethod || !["electronic", "mail"].includes(deliveryMethod)) {
        return res.status(400).json({
          error: {
            message: 'Invalid delivery method; must be "electronic" or "mail"',
            code: "INVALID_PARAMETERS",
            status: 400,
          },
        });
      }

      if (deliveryMethod === "mail" && !address) {
        return res.status(400).json({
          error: {
            message: "Address is required for mail delivery",
            code: "INVALID_PARAMETERS",
            status: 400,
          },
        });
      }

      if (deliveryMethod === "electronic" && !email) {
        return res.status(400).json({
          error: {
            message: "Email is required for electronic delivery",
            code: "INVALID_PARAMETERS",
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({
          error: {
            message: "Unauthorized: User not authenticated",
            code: "UNAUTHORIZED",
            status: 401,
          },
        });
      }

      const result = await requestTranscript.execute({
        userId: req.user.id,
        deliveryMethod,
        address,
        email,
      });

      res.status(200).json(result);
    } catch (err: any) {
      console.error(`Error in requestTranscript:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        },
      });
    }
  }

  async scheduleMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, reason, preferredTime, notes } = req.body;

      console.log(`Received POST /api/academic/schedule-meeting with body:`, {
        date,
        reason,
        preferredTime,
        notes,
      });

      if (!date || !reason) {
        return res.status(400).json({
          error: {
            message: "Date and reason are required",
            code: "INVALID_PARAMETERS",
            status: 400,
          },
        });
      }

      // Validate ISO date format
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/.test(date)) {
        return res.status(400).json({
          error: {
            message: "Invalid date format; must be ISO date",
            code: "INVALID_DATE",
            status: 400,
          },
        });
      }

      if (preferredTime && !["morning", "afternoon"].includes(preferredTime)) {
        return res.status(400).json({
          error: {
            message: 'Invalid preferred time; must be "morning" or "afternoon"',
            code: "INVALID_PARAMETERS",
            status: 400,
          },
        });
      }

      if (!req.user) {
        return res.status(401).json({
          error: {
            message: "Unauthorized: User not authenticated",
            code: "UNAUTHORIZED",
            status: 401,
          },
        });
      }

      const result = await scheduleMeeting.execute({
        userId: req.user.id,
        date,
        reason,
        preferredTime,
        notes,
      });

      res.status(200).json(result);
    } catch (err: any) {
      console.error(`Error in scheduleMeeting:`, err);
      res.status(500).json({
        error: {
          message: err.message,
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        },
      });
    }
  }
}

export const academicController = new AcademicController();
