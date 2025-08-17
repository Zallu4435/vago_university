import { ISportsRepository } from "../../../application/sports/repositories/ISportsRepository";
import { TeamModel, SportRequestModel } from "../../../infrastructure/database/mongoose/models/sports.model";
import { User as UserModel } from "../../database/mongoose/auth/user.model";
import { Sport, SportDocument, SportFilter } from "../../../domain/sports/entities/SportTypes";
import { BaseRepository } from "../../../application/repositories/BaseRepository";

export class SportsRepository extends BaseRepository<Sport, Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, SportDocument> implements ISportsRepository {
  constructor() {
    super(TeamModel);
  }

  async getSports(page: number, limit: number, sportType: string, status: string, coach: string, startDate: string, endDate: string, search: string) {
    const query: SportFilter = {};
    if (sportType && sportType !== "all") {
      query.type = { $regex: `^${sportType}$`, $options: "i" };
    }
    if (status && status !== "all") {

      const normalizedStatus = status.toLowerCase();
      query.status = { $regex: `^${normalizedStatus}$`, $options: "i" };
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
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return { sports: sports as unknown as SportDocument[], totalItems, totalPages, currentPage: page };
  }

  // async getSportById(id: string) {
  //   return await TeamModel.findById(id).lean();
  // }

  // async createSport(params: CreateSportData) {
  //   return await TeamModel.create({ ...params, status: params.status?.toLowerCase() || "active" });
  // }

  // async updateSport(params: UpdateSportData) {
  //   return await TeamModel.findByIdAndUpdate(
  //     params.id,
  //     { $set: { ...params, updatedAt: new Date() } },
  //     { new: true }
  //   ).lean();
  // }

  // async deleteSport(id: string): Promise<void> {
  //   await TeamModel.findByIdAndDelete(id);
  // }

  async getSportRequests(page: number, limit: number, status: string, type: string, startDate: string, endDate: string, search: string) {
    const query: SportFilter = {};
    if (status && status.toLowerCase() !== "all") {
      query.status = status;
    }
    const sportQuery: SportFilter = {};
    if (type && type.toLowerCase() !== "all") {
      sportQuery.type = { $regex: `^${type}$`, $options: "i" };
    }
    let matchingSports = [];
    let userIds = [];
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
      if (sportIds.length === 0 && userIds.length === 0) {
        return { requests: [], totalItems: 0, totalPages: 0, currentPage: page };
      }
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

  async approveSportRequest(id: string): Promise<void> {
    await SportRequestModel.findByIdAndUpdate(
      id,
      { status: "approved", updatedAt: new Date() },
      { runValidators: true }
    );

    // Send approval notification
    const sportRequest = await SportRequestModel.findById(id);
    if (sportRequest && sportRequest.userId) {
      const userId = typeof sportRequest.userId === 'string' ? sportRequest.userId : sportRequest.userId._id.toString();
      const sportTitle = typeof sportRequest.sportId === 'string' ? 'a sport' : sportRequest.sportId.title || 'a sport';
      
      await this.sendRequestApprovalNotification('sport', id, userId, sportTitle);
    }
  }

  async rejectSportRequest(id: string): Promise<void> {
    await SportRequestModel.findByIdAndUpdate(
      id,
      { status: "rejected", updatedAt: new Date() },
      { runValidators: true }
    );

    // Send rejection notification
    const sportRequest = await SportRequestModel.findById(id);
    if (sportRequest && sportRequest.userId) {
      const userId = typeof sportRequest.userId === 'string' ? sportRequest.userId : sportRequest.userId._id.toString();
      const sportTitle = typeof sportRequest.sportId === 'string' ? 'a sport' : sportRequest.sportId.title || 'a sport';
      
      await this.sendRequestRejectionNotification('sport', id, userId, sportTitle);
    }
  }

  async getSportRequestDetails(id: string) {
    return await SportRequestModel.findById(id)
      .populate({ path: "sportId", select: "title type headCoach participants division" })
      .populate({ path: "userId", select: "firstName lastName email" })
      .lean();
  }

  async joinSport(id: string) {
    const sportRequest = new SportRequestModel({
      sportId: id,
      userId: id,
      status: "pending",
      whyJoin: "",
      additionalInfo: "",
      createdAt: new Date(),
    });
    await sportRequest.save();
    return sportRequest;
  }
} 