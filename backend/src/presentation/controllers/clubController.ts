import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { getClubs } from "../../application/use-cases/clubs/getClubs";
import { getClubById } from "../../application/use-cases/clubs/getClubById";
import { createClub } from "../../application/use-cases/clubs/createClub";
import { updateClub } from "../../application/use-cases/clubs/updateClub";
import { deleteClub } from "../../application/use-cases/clubs/deleteClub";
import { getClubRequests } from "../../application/use-cases/clubs/getClubRequests";
import { approveClubRequest } from "../../application/use-cases/clubs/approveClubRequest";
import { rejectClubRequest } from "../../application/use-cases/clubs/rejectClubRequest";
import { getClubRequestDetails } from "../../application/use-cases/clubs/GetClubRequestDetails";
class ClubController {
  async getClubs(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = "1",
        limit = "10",
        category = "all",
        status = "all",
        dateRange,
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

      let startDate, endDate;
      if (dateRange) {
        try {
          const [start, end] = String(dateRange).split(",");
          startDate = new Date(start);
          endDate = new Date(end);
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res
              .status(400)
              .json({ error: "Invalid dateRange format", code: 400 });
          }
        } catch {
          return res
            .status(400)
            .json({ error: "Invalid dateRange format", code: 400 });
        }
      }

      const result = await getClubs.execute({
        page: Number(page),
        limit: Number(limit),
        category: String(category),
        status: String(status),
        startDate,
        endDate,
      });

      res.status(200).json({
        clubs: result.clubs,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getClubs:`, err);
      next(err);
    }
  }

  async getClubById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received GET /api/admin/clubs/${id}`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid club ID", code: 400 });
      }

      const club = await getClubById.execute(id);
      if (!club) {
        return res.status(404).json({ error: "Club not found", code: 404 });
      }

      res.status(200).json(club);
    } catch (err) {
      console.error(`Error in getClubById:`, err);
      next(err);
    }
  }

  async createClub(req: Request, res: Response, next: NextFunction) {
    try {
      const clubData = req.body;
      console.log(`Received POST /api/admin/clubs with data:`, clubData);

      const club = await createClub.execute(clubData);
      res.status(201).json(club);
    } catch (err) {
      console.error(`Error in createClub:`, err);
      next(err);
    }
  }

  async updateClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const clubData = req.body;
      console.log(`Received PUT /api/admin/clubs/${id} with data:`, clubData);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid club ID", code: 400 });
      }

      const club = await updateClub.execute(id, clubData);
      if (!club) {
        return res.status(404).json({ error: "Club not found", code: 404 });
      }

      res.status(200).json(club);
    } catch (err) {
      console.error(`Error in updateClub:`, err);
      next(err);
    }
  }

  async deleteClub(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received DELETE /api/admin/clubs/${id}`);

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid club ID", code: 400 });
      }

      await deleteClub.execute(id);
      res.status(200).json({ message: "Club deleted successfully" });
    } catch (err) {
      console.error(`Error in deleteClub:`, err);
      next(err);
    }
  }

  async getClubRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = "1",
        limit = "10",
        status = "all",
        category,
        dateRange,
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

      let startDate, endDate;
      if (dateRange) {
        try {
          const [start, end] = String(dateRange).split(",");
          startDate = new Date(start);
          endDate = new Date(end);
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res
              .status(400)
              .json({ error: "Invalid dateRange format", code: 400 });
          }
        } catch {
          return res
            .status(400)
            .json({ error: "Invalid dateRange format", code: 400 });
        }
      }

      const result = await getClubRequests.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
        category: category ? String(category) : undefined,
        startDate,
        endDate,
      });

      res.status(200).json({
        clubs: result.clubs,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getClubRequests:`, err);
      next(err);
    }
  }

  async approveClubRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received POST /api/admin/club-requests/${id}/approve`);

      if (!mongoose.isValidObjectId(id)) {
        return res
          .status(400)
          .json({ error: "Invalid club request ID", code: 400 });
      }

      await approveClubRequest.execute(id);
      res.status(200).json({ message: "Club request approved successfully" });
    } catch (err) {
      console.error(`Error in approveClubRequest:`, err);
      next(err);
    }
  }

  async rejectClubRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(
        `Received POST /api/admin/club-requests/${id}/reject with reason:`
      );

      if (!mongoose.isValidObjectId(id)) {
        return res
          .status(400)
          .json({ error: "Invalid club request ID", code: 400 });
      }

      await rejectClubRequest.execute({ id });
      res.status(200).json({ message: "Club request rejected successfully" });
    } catch (err) {
      console.error(`Error in rejectClubRequest:`, err);
      next(err);
    }
  }

  async getClubRequestDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid club request ID",
          statusCode: 400,
        });
      }

      const clubRequest = await getClubRequestDetails.execute(id);
      res.status(200).json({ data: clubRequest });
    } catch (err: any) {
      console.error(`Error in getClubRequestDetails:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
    }
  }
}

export const clubController = new ClubController();
