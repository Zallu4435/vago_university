import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { getTeams } from "../../application/use-cases/sports/getTeams";
import { createTeam } from "../../application/use-cases/sports/createTeam";
import { updateTeam } from "../../application/use-cases/sports/updateTeam";
import { deleteTeam } from "../../application/use-cases/sports/deleteTeam";
import { getPlayerRequests } from "../../application/use-cases/sports/getPlayerRequests";
import { approvePlayerRequest } from "../../application/use-cases/sports/approvePlayerRequest";
import { rejectPlayerRequest } from "../../application/use-cases/sports/rejectPlayerRequest";
import { getTeamById } from "../../application/use-cases/sports/GetTeamById";
import { getTeamRequestDetails } from "../../application/use-cases/sports/GetTeamRequestDetails";
class SportsController {
  async getTeams(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = "1",
        limit = "10",
        sportType = "all",
        status = "all",
        coach = "all",
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

      const result = await getTeams.execute({
        page: Number(page),
        limit: Number(limit),
        sportType: String(sportType),
        status: String(status),
        coach: String(coach),
      });

      res.status(200).json({
        teams: result.teams,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getTeams:`, err);
      res
        .status(400)
        .json({ error: err.message || "Failed to fetch teams", code: 400 });
      next(err);
    }
  }
  async createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const teamData = req.body;
      const team = await createTeam.execute(teamData);
      res.status(201).json(team);
    } catch (err) {
      console.error(`Error in createTeam:`, err);
      next(err);
    }
  }

  async updateTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const teamData = req.body;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid team ID", code: 400 });
      }

      const team = await updateTeam.execute(id, teamData);
      if (!team) {
        return res.status(404).json({ error: "Team not found", code: 404 });
      }

      res.status(200).json(team);
    } catch (err) {
      console.error(`Error in updateTeam:`, err);
      next(err);
    }
  }

  async deleteTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid team ID", code: 400 });
      }

      await deleteTeam.execute(id);
      res.status(200).json({ message: "Team deleted successfully" });
    } catch (err) {
      console.error(`Error in deleteTeam:`, err);
      next(err);
    }
  }

  async getPlayerRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = "1",
        limit = "10",
        status = "all",
        sportType = "all",
        startDate,
        endDate,
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

      const result = await getPlayerRequests.execute({
        page: Number(page),
        limit: Number(limit),
        type: String(sportType), // Map sportType to type
        status: String(status),
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
      });

      res.status(200).json({
        playerRequests: result.playerRequests,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        currentPage: result.currentPage,
      });
    } catch (err) {
      console.error(`Error in getPlayerRequests:`, err);
      res.status(400).json({
        error: err.message || "Failed to fetch player requests",
        code: 400,
      });
      next(err);
    }
  }

  async approvePlayerRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res
          .status(400)
          .json({ error: "Invalid player request ID", code: 400 });
      }

      await approvePlayerRequest.execute(id);
      res.status(200).json({ message: "Player request approved successfully" });
    } catch (err) {
      console.error(`Error in approvePlayerRequest:`, err);
      next(err);
    }
  }

  async rejectPlayerRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res
          .status(400)
          .json({ error: "Invalid player request ID", code: 400 });
      }

      await rejectPlayerRequest.execute({ id });
      res.status(200).json({ message: "Player request rejected successfully" });
    } catch (err) {
      console.error(`Error in rejectPlayerRequest:`, err);
      next(err);
    }
  }

  async getTeamById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid team ID", code: 400 });
      }

      const team = await getTeamById.execute(id);
      if (!team) {
        return res.status(404).json({ error: "Team not found", code: 404 });
      }

      res.status(200).json(team);
    } catch (err) {
      console.error(`Error in getTeamById:`, err);
      res
        .status(500)
        .json({ error: err.message || "Failed to fetch team", code: 500 });
      next(err);
    }
  }

  async getTeamRequestDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid team request ID",
          statusCode: 400,
        });
      }

      const teamRequest = await getTeamRequestDetails.execute(id);
      res.status(200).json({ data: teamRequest });
    } catch (err: any) {
      console.error(`Error in getTeamRequestDetails:`, err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        statusCode: 500,
      });
      next(err);
    }
  }
}

export const sportsController = new SportsController();
