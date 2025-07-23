import { ISportsRepository } from "../../../application/sports/repositories/ISportsRepository";
import {
  GetSportsRequestDTO,
  GetSportByIdRequestDTO,
  CreateSportRequestDTO,
  UpdateSportRequestDTO,
  DeleteSportRequestDTO,
  GetSportRequestsRequestDTO,
  ApproveSportRequestRequestDTO,
  RejectSportRequestRequestDTO,
  GetSportRequestDetailsRequestDTO,
  JoinSportRequestDTO,
} from "../../../domain/sports/dtos/SportRequestDTOs";
import { TeamModel, SportRequestModel } from "../../../infrastructure/database/mongoose/models/sports.model";
import { User as UserModel } from "../../database/mongoose/auth/user.model";
import mongoose from "mongoose";

export class SportsRepository implements ISportsRepository {
  async getSports(params: GetSportsRequestDTO): Promise<any> {
    const { page, limit, sportType, status, coach, startDate, endDate, search } = params;
    const query: any = {};
    if (sportType && sportType !== "all") {
      query.type = { $regex: `^${sportType}$`, $options: "i" };
    }
    if (status && status !== "all") {
      query.status = { $regex: `^${status}$`, $options: "i" };
    }
    if (coach && coach !== "all") {
      query.headCoach = { $regex: coach, $options: "i" };
    }
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { headCoach: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { division: { $regex: search, $options: "i" } },
      ];
    }
    const totalItems = await TeamModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;
    const sports = await TeamModel.find(query)
      .skip(skip)
      .limit(limit)
      .lean();
    return { sports, totalItems, totalPages, currentPage: page };
  }

  async getSportById(params: GetSportByIdRequestDTO): Promise<any> {
    return await (TeamModel as any).findById(params.id).lean();
  }

  async createSport(params: CreateSportRequestDTO): Promise<any> {
    return await (TeamModel as any).create({ ...params, status: params.status?.toLowerCase() || "active" });
  }

  async updateSport(params: UpdateSportRequestDTO): Promise<any> {
    return await (TeamModel as any).findByIdAndUpdate(
      params.id,
      { $set: { ...params, updatedAt: new Date() } },
      { new: true }
    ).lean();
  }

  async deleteSport(params: DeleteSportRequestDTO): Promise<void> {
    await TeamModel.findByIdAndDelete(params.id);
  }

  async getSportRequests(params: GetSportRequestsRequestDTO): Promise<any> {
    const { page, limit, status, type, startDate, endDate, search } = params;
    const query: any = {};
    if (status && status.toLowerCase() !== "all") {
      query.status = status;
    }
    const sportQuery: any = {};
    if (type && type.toLowerCase() !== "all") {
      sportQuery.type = { $regex: `^${type}$`, $options: "i" };
    }
    // Search logic for sport title/type or user email
    let matchingSports = [];
    let userIds: any[] = [];
    if (search && search.trim() !== "") {
      sportQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }
    matchingSports = await TeamModel.find(sportQuery).select("_id title type").lean();
    const sportIds = matchingSports.map((sport) => sport._id);
    if (search && search.trim() !== "") {
      const userMatches = await UserModel.find({ email: { $regex: search, $options: "i" } }).select("_id").lean();
      userIds = userMatches.map((u) => u._id);
      // If no matches in either, return empty result
      if (sportIds.length === 0 && userIds.length === 0) {
        return { requests: [], totalItems: 0, totalPages: 0, currentPage: page };
      }
      // If matches, build $or for sportId/userId
      query.$or = [];
      if (sportIds.length > 0) query.$or.push({ sportId: { $in: sportIds } });
      if (userIds.length > 0) query.$or.push({ userId: { $in: userIds } });
    } else {
      if (sportIds.length > 0) {
        query.sportId = { $in: sportIds };
      }
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    const totalItems = await SportRequestModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;
    const requests = await SportRequestModel.find(query)
      .populate({ path: "sportId", select: "title type" })
      .populate({ path: "userId", select: "email" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return { requests, totalItems, totalPages, currentPage: page };
  }

  async approveSportRequest(params: ApproveSportRequestRequestDTO): Promise<void> {
    await SportRequestModel.findByIdAndUpdate(
      params.id,
      { status: "approved", updatedAt: new Date() },
      { runValidators: true }
    );
    // Increment participants in TeamModel can be handled in use case if needed
  }

  async rejectSportRequest(params: RejectSportRequestRequestDTO): Promise<void> {
    await SportRequestModel.findByIdAndUpdate(
      params.id,
      { status: "rejected", updatedAt: new Date() },
      { runValidators: true }
    );
  }

  async getSportRequestDetails(params: GetSportRequestDetailsRequestDTO): Promise<any> {
    return await SportRequestModel.findById(params.id)
      .populate({ path: "sportId", select: "title type headCoach participants division" })
      .populate({ path: "userId", select: "firstName lastName email" })
      .lean();
  }

  async joinSport(params: JoinSportRequestDTO): Promise<any> {
    // Only create the join request, do not check for existence or throw errors
    const sportRequest = new SportRequestModel({
      sportId: params.sportId,
      userId: params.studentId,
      status: "pending",
      whyJoin: params.reason,
      additionalInfo: params.additionalInfo,
      createdAt: new Date(),
    });
    await sportRequest.save();
    return sportRequest;
  }
} 