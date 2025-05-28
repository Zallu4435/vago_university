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
import { getMemberRequests } from "../../application/use-cases/clubs/getMemberRequests";
import { approveMemberRequest } from "../../application/use-cases/clubs/approveMemberRequest";
import { rejectMemberRequest } from "../../application/use-cases/clubs/rejectMemberRequest";

class ClubController {
  async getClubs(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = "1",
        limit = "10",
        category = "all",
        status = "all",
      } = req.query;

      console.log(`Received GET /api/admin/clubs with filters:`, {
        page,
        limit,
        category,
        status,
      });

      // Validate query parameters
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

      const result = await getClubs.execute({
        page: Number(page),
        limit: Number(limit),
        category: String(category),
        status: String(status),
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

      const { page = "1", limit = "10", status = "all" } = req.query;

      console.log(`Received GET /api/admin/club-requests with filters:`, {
        page,
        limit,
        status,
      });

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

      const result = await getClubRequests.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
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

  async getMemberRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = "1", limit = "10", status = "all" } = req.query;

      console.log(`Received GET /api/admin/member-requests with filters:`, {
        page,
        limit,
        status,
      });

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

      const result = await getMemberRequests.execute({
        page: Number(page),
        limit: Number(limit),
        status: String(status),
      });

      res.status(200).json({
        clubs: result.clubs,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getMemberRequests:`, err);
      next(err);
    }
  }

  async approveMemberRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(`Received POST /api/admin/member-requests/${id}/approve`);

      if (!mongoose.isValidObjectId(id)) {
        return res
          .status(400)
          .json({ error: "Invalid member request ID", code: 400 });
      }

      await approveMemberRequest.execute(id);
      res.status(200).json({ message: "Member request approved successfully" });
    } catch (err) {
      console.error(`Error in approveMemberRequest:`, err);
      next(err);
    }
  }

  async rejectMemberRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      console.log(
        `Received POST /api/admin/member-requests/${id}/reject with reason:`,
        reason
      );

      if (!mongoose.isValidObjectId(id)) {
        return res
          .status(400)
          .json({ error: "Invalid member request ID", code: 400 });
      }
      if (!reason) {
        return res
          .status(400)
          .json({ error: "Reason is required for rejection", code: 400 });
      }

      await rejectMemberRequest.execute({ id, reason });
      res.status(200).json({ message: "Member request rejected successfully" });
    } catch (err) {
      console.error(`Error in rejectMemberRequest:`, err);
      next(err);
    }
  }
}

export const clubController = new ClubController();
