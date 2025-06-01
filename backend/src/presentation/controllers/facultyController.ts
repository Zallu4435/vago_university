import { Request, Response, NextFunction } from "express";
import { getFaculty } from "../../application/use-cases/faculty/getFaculty";
import { getFacultyById } from "../../application/use-cases/faculty/getFacultyById";
import { approveFaculty } from "../../application/use-cases/faculty/approveFaculty";
import mongoose from "mongoose";
import { confirmFacultyOffer } from "../../application/use-cases/faculty/confirmFacultyOffer";
import { rejectFaculty } from "../../application/use-cases/faculty/rejectFaculty";
import { downloadCertificate } from "../../application/use-cases/faculty/downloadCertificate";

class FacultyController {
  async getFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = "1",
        status = "all",
        department = "all_departments",
        dateRange = "all",
        limit = "5",
      } = req.query;

      if (
        isNaN(Number(page)) ||
        isNaN(Number(limit)) ||
        Number(page) < 1 ||
        Number(limit) < 1
      ) {
        return res
          .status(400)
          .json({ error: "Invalid page or limit parameters" });
      }

      const result = await getFaculty.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
        department: String(department),
        dateRange: String(dateRange),
      });

      res.status(200).json({
        faculty: result.faculty,
        totalFaculty: result.totalFaculty,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getFaculty:`, err);
      next(err);
    }
  }

  async getFacultyById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received GET /api/admin/faculty/${id}`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid faculty ID" });
      }

      const faculty = await getFacultyById.execute(id);

      if (!faculty) {
        return res.status(404).json({ error: "Faculty not found" });
      }

      res.status(200).json(faculty);
    } catch (err) {
      console.error(`Error in getFacultyById:`, err);
      next(err);
    }
  }

  async approveFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(req, "frontend request");
      const { department, startDate, additionalNotes } = req.body;

      console.log(
        `Received POST /api/admin/faculty/${id}/approve with details:`,
        {
          department,
          startDate,
          additionalNotes,
        }
      );

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid faculty ID" });
      }

      if (!department || !startDate) {
        return res
          .status(400)
          .json({ error: "Department and startDate are required" });
      }

      await approveFaculty.execute({
        id,
        additionalInfo: {
          department,
          startDate,
          additionalNotes,
        },
      });

      res.status(200).json({ message: "Faculty approval email sent" });
    } catch (err) {
      console.error(`Error in approveFaculty:`, err);
      next(err);
    }
  }

  async rejectFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received POST /api/admin/faculty/${id}/reject`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid faculty ID" });
      }

      await rejectFaculty.execute(id);

      res.status(200).json({ message: "Faculty registration rejected" });
    } catch (err) {
      console.error(`Error in rejectFaculty:`, err);
      next(err);
    }
  }

  async confirmOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, action } = req.params;
      const { token } = req.query;

      console.log(`Received POST /api/admin/faculty/${id}/confirm/${action}`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid faculty ID" });
      }

      if (!token || typeof token !== "string") {
        return res.status(400).json({ error: "Token is required" });
      }

      if (action !== "accept" && action !== "reject") {
        return res.status(400).json({ error: "Invalid action" });
      }

      await confirmFacultyOffer.execute({
        facultyId: id,
        token,
        action: action as "accept" | "reject",
      });

      res.status(200).json({
        message:
          action === "accept"
            ? "Faculty offer accepted and faculty account created"
            : "Faculty offer rejected",
      });
    } catch (err) {
      console.error(`Error in confirmOffer:`, err);
      next(err);
    }
  }

 async downloadCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { facultyId } = req.params;
      const { url, type } = req.query;

      console.log(`Received GET /api/admin/faculty/${facultyId}/certificate with url: ${url}, type: ${type}`);

      if (!mongoose.isValidObjectId(facultyId)) {
        return res.status(400).json({ error: 'Invalid faculty ID' });
      }

      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Certificate URL is required' });
      }

      if (!url.match(/^https:\/\/res\.cloudinary\.com\/vago-university\/image\/upload\/v[0-9]+\/faculty-documents\/[a-zA-Z0-9]+\.pdf$/)) {
        return res.status(400).json({ error: 'Invalid certificate URL' });
      }

      if (!type || !['cv', 'certificate'].includes(String(type).toLowerCase())) {
        return res.status(400).json({ error: 'Invalid document type. Must be "cv" or "certificate"' });
      }

      // Assuming req.user is set by an authentication middleware
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { fileStream, fileSize, fileName } = await downloadCertificate.execute({
        facultyId,
        certificateUrl: url,
        requestingUserId: userId,
        type: String(type),
      });

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', fileSize.toString());

      fileStream.pipe(res);
    } catch (err: any) {
      console.error(`Error in downloadCertificate:`, err);

      if (err.message === 'Faculty not found') {
        return res.status(404).json({ error: 'Faculty not found' });
      }
      if (err.message === 'Certificate file not found') {
        return res.status(404).json({ error: 'Certificate file not found' });
      }
      if (err.message === 'Unauthorized access to certificate') {
        return res.status(403).json({ error: 'Unauthorized access to certificate' });
      }
      if (err.message === 'Authentication required') {
        return res.status(401).json({ error: 'Authentication required' });
      }
      if (err.message === 'Invalid document type. Must be "cv" or "certificate"') {
        return res.status(400).json({ error: 'Invalid document type. Must be "cv" or "certificate"' });
      }

      res.status(500).json({ error: 'Failed to download certificate' });
      next(err);
    }
  }
}

export const facultyController = new FacultyController();
