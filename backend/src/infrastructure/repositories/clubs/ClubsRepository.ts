import {
  GetClubsRequest,
  CreateClubRequest,
  UpdateClubRequest,
  GetClubRequestsRequest,
  ApproveClubRequestRequest,
  RejectClubRequestRequest,
  GetClubRequestDetailsRequest,
  ClubFilter,
} from "../../../domain/clubs/entities/Club";
import { IClubsRepository } from "../../../application/clubs/repositories/IClubsRepository";
import { ClubModel, ClubRequestModel } from "../../../infrastructure/database/mongoose/models/clubs/ClubModel";
import { BaseRepository } from "../../../application/repositories/BaseRepository";
import { Club } from "../../../domain/clubs/entities/ClubTypes";
import mongoose from "mongoose";

export class ClubsRepository extends BaseRepository<Club, CreateClubRequest, UpdateClubRequest, Record<string, unknown>, Club> implements IClubsRepository {
  constructor() {
    super(ClubModel);
  }

  async getClubs(params: GetClubsRequest) {
    const { page, limit, category, status, startDate, endDate, search } = params;
    const query: ClubFilter = {};
    if (category && category.toLowerCase() !== "all") {
      query.type = { $regex: `^${category}$`, $options: "i" };
    }
    if (status && status.toLowerCase() !== "all") {
      query.status = status;
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;
    const clubs = await ClubModel.find(query)
      .select("name type createdBy status createdAt color icon enteredMembers")
      .sort({ updatedAt: -1, createdAt: -1 }) 
      .skip(skip)
      .limit(limit)
      .lean();
    const totalItems = await ClubModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    return { clubs, totalItems, totalPages, currentPage: page };
  }

  // async getClubById(id: string) {
  //   const club = await ClubModel.findById(id).lean();
  //   return { club };
  // }

  // async createClub(params: CreateClubRequest) {
  //   const club = await ClubModel.create({ ...params, status: params.status?.toLowerCase() || "active" });
  //   return { club };
  // }

  // async updateClub(params: UpdateClubRequest) {
  //   const club = await ClubModel.findByIdAndUpdate(
  //     params.id,
  //     { $set: { ...params, updatedAt: new Date() } },
  //     { new: true }
  //   ).lean();
  //   return { club };
  // }

  // async deleteClub(params: DeleteClubRequest): Promise<void> {
  //   await ClubModel.findByIdAndDelete(params.id);
  // }

  async getClubRequests(params: GetClubRequestsRequest) {
    const { page, limit, status, type, startDate, endDate, search } = params;
    const query: ClubFilter = {};
    if (status && status.toLowerCase() !== "all") {
      query.status = status;
    }
    const clubQuery: ClubFilter = {};
    if (type && type.toLowerCase() !== "all") {
      clubQuery.type = { $regex: `^${type}$`, $options: "i" };
    }
    let matchingClubs = [];
    let userIds = [];
    if (search && search.trim() !== "") {
      clubQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }
    matchingClubs = await ClubModel.find(clubQuery).select("_id name type").lean();
    const clubIds = matchingClubs.map((club) => club._id);
    if (search && search.trim() !== "") {
      const userMatches = await mongoose.model('User').find({ email: { $regex: search, $options: "i" } }).select("_id").lean();
      userIds = userMatches.map((u) => u._id);
      if (clubIds.length === 0 && userIds.length === 0) {
        return { rawRequests: [], totalItems: 0, totalPages: 0, currentPage: page };
      }
      query.$or = [];
      if (clubIds.length > 0) query.$or.push({ clubId: { $in: clubIds } });
      if (userIds.length > 0) query.$or.push({ userId: { $in: userIds } });
    } else {
      if (clubIds.length > 0) {
        query.clubId = { $in: clubIds };
      }
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const totalItems = await ClubRequestModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;
    const rawRequests = await ClubRequestModel.find(query)
      .populate("clubId", "name type")
      .populate("userId", "email")
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return { rawRequests, totalItems, totalPages, currentPage: page };
  }

  async approveClubRequest(params: ApproveClubRequestRequest) {
    await ClubRequestModel.findByIdAndUpdate(
      params.id,
      { status: "approved", updatedAt: new Date() },
      { runValidators: true }
    );
    const clubRequest = await ClubRequestModel.findById(params.id);
    if (clubRequest && clubRequest.clubId) {
      await ClubModel.findByIdAndUpdate(
        clubRequest.clubId,
        { $inc: { enteredMembers: 1 }, updatedAt: new Date() },
        { new: true }
      );
    }

    // Send approval notification
    if (clubRequest && clubRequest.userId) {
      const userId = typeof clubRequest.userId === 'string' ? clubRequest.userId : clubRequest.userId._id.toString();
      const clubTitle = typeof clubRequest.clubId === 'string' ? 'a club' : clubRequest.clubId.name || 'a club';
      
      await this.sendRequestApprovalNotification('club', params.id, userId, clubTitle);
    }
  }

  async rejectClubRequest(params: RejectClubRequestRequest) {
    await ClubRequestModel.findByIdAndUpdate(
      params.id,
      { status: "rejected", updatedAt: new Date() },
      { runValidators: true }
    );

    // Send rejection notification
    const clubRequest = await ClubRequestModel.findById(params.id);
    if (clubRequest && clubRequest.userId) {
      const userId = typeof clubRequest.userId === 'string' ? clubRequest.userId : clubRequest.userId._id.toString();
      const clubTitle = typeof clubRequest.clubId === 'string' ? 'a club' : clubRequest.clubId.name || 'a club';
      
      await this.sendRequestRejectionNotification('club', params.id, userId, clubTitle);
    }
  }

  async getClubRequestDetails(params: GetClubRequestDetailsRequest) {
    const clubRequest = await ClubRequestModel.findById(params.id)
      .populate({
        path: "clubId",
        select: "name type about nextMeeting enteredMembers",
      })
      .populate({
        path: "userId",
        select: "firstName lastName email",
      })
      .lean();
    return { clubRequest };
  }
}
  