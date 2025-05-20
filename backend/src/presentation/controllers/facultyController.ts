import { Request, Response, NextFunction } from 'express';
import { getFaculty } from '../../application/use-cases/faculty/getFaculty';
import { getFacultyById } from '../../application/use-cases/faculty/getFacultyById';
import { approveFaculty } from '../../application/use-cases/faculty/approveFaculty';
import mongoose from 'mongoose';

class FacultyController {
  async getFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 5,
        department = 'all',
        qualification = 'all',
        experience = 'all',
      } = req.query;

      console.log(`Received GET /api/admin/faculty with filters:`, {
        page,
        limit,
        department,
        qualification,
        experience,
      });

      console.log("reached reached reached");

      // Validate query parameters
      if (isNaN(Number(page)) || isNaN(Number(limit)) || Number(page) < 1 || Number(limit) < 1) {
        return res.status(400).json({ error: 'Invalid page or limit parameters' });
      }

      const result = await getFaculty.execute({
        page: Number(page),
        limit: Number(limit),
        department: String(department),
        qualification: String(qualification),
        experience: String(experience),
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
        return res.status(400).json({ error: 'Invalid faculty ID' });
      }

      const faculty = await getFacultyById.execute(id);

      if (!faculty) {
        return res.status(404).json({ error: 'Faculty not found' });
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
      const { department, startDate, additionalNotes } = req.body;

      console.log(`Received POST /api/admin/faculty/${id}/approve with details:`, {
        department,
        startDate,
        additionalNotes,
      });

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid faculty ID' });
      }

      if (!department || !startDate) {
        return res.status(400).json({ error: 'Department and startDate are required' });
      }

      await approveFaculty.execute({
        id,
        additionalInfo: {
          department,
          startDate,
          additionalNotes,
        },
      });

      res.status(200).json({ message: 'Faculty approval email sent' });
    } catch (err) {
      console.error(`Error in approveFaculty:`, err);
      next(err);
    }
  }
}

export const facultyController = new FacultyController();