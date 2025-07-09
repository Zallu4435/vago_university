import {
  GetClubsRequestDTO,
  GetClubByIdRequestDTO,
  CreateClubRequestDTO,
  UpdateClubRequestDTO,
  DeleteClubRequestDTO,
} from "../../../domain/clubs/dtos/ClubRequestDTOs";
import {
  GetClubRequestsRequestDTO,
  ApproveClubRequestRequestDTO,
  RejectClubRequestRequestDTO,
  GetClubRequestDetailsRequestDTO,
} from "../../../domain/clubs/dtos/ClubRequestRequestDTOs";
import { IClubsRepository } from "../../../application/clubs/repositories/IClubsRepository";
import { ClubModel, ClubRequestModel } from "../../../infrastructure/database/mongoose/models/clubs/ClubModel";
import mongoose from "mongoose";

export class ClubsRepository implements IClubsRepository {
  async getClubs(params: GetClubsRequestDTO): Promise<any> {
    const { page, limit, category, status, startDate, endDate } = params;
    const query: any = {};
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
    const skip = (page - 1) * limit;
    const clubs = await ClubModel.find(query)
      .select("name type createdBy status createdAt color icon enteredMembers")
      .skip(skip)
      .limit(limit)
      .lean();
    const totalItems = await ClubModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    return { clubs, totalItems, totalPages, currentPage: page };
  }

  async getClubById(params: GetClubByIdRequestDTO): Promise<any> {
    return await ClubModel.findById(params.id).lean();
  }

  async createClub(params: CreateClubRequestDTO): Promise<any> {
    return await ClubModel.create({ ...params, status: params.status?.toLowerCase() || "active" });
  }

  async updateClub(params: UpdateClubRequestDTO): Promise<any> {
    return await ClubModel.findByIdAndUpdate(
      params.id,
      { $set: { ...params, updatedAt: new Date() } },
      { new: true }
    ).lean();
  }

  async deleteClub(params: DeleteClubRequestDTO): Promise<void> {
    await ClubModel.findByIdAndDelete(params.id);
  }

  async getClubRequests(params: GetClubRequestsRequestDTO): Promise<any> {
    const { page, limit, status, category, startDate, endDate } = params;
    const query: any = {};
    if (status && status.toLowerCase() !== "all") {
      query.status = status;
    }
    const clubQuery: any = {};
    if (category && category.toLowerCase() !== "all") {
      clubQuery.type = { $regex: `^${category}$`, $options: "i" };
    }
    const matchingClubs = await ClubModel.find(clubQuery)
      .select("_id name type")
      .lean();
    const clubIds = matchingClubs.map((club) => club._id);
    if (clubIds.length > 0) {
      query.clubId = { $in: clubIds };
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
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return { rawRequests, totalItems, totalPages, currentPage: page };
  }

  async approveClubRequest(params: ApproveClubRequestRequestDTO): Promise<any> {
    // Update club request status
    await ClubRequestModel.findByIdAndUpdate(
      params.id,
      { status: "approved", updatedAt: new Date() },
      { runValidators: true }
    );
    // Get the club request to find the associated club
    const clubRequest = await ClubRequestModel.findById(params.id);
    if (clubRequest && clubRequest.clubId) {
      // Increment enteredMembers count
      await ClubModel.findByIdAndUpdate(
        clubRequest.clubId,
        { $inc: { enteredMembers: 1 }, updatedAt: new Date() },
        { new: true }
      );
    }
  }

  async rejectClubRequest(params: RejectClubRequestRequestDTO): Promise<any> {
    await ClubRequestModel.findByIdAndUpdate(
      params.id,
      { status: "rejected", updatedAt: new Date() },
      { runValidators: true }
    );
  }

  async getClubRequestDetails(params: GetClubRequestDetailsRequestDTO): Promise<any> {
    return await ClubRequestModel.findById(params.id)
      .populate({
        path: "clubId",
        select: "name type about nextMeeting enteredMembers",
      })
      .populate({
        path: "userId",
        select: "firstName lastName email",
      })
      .lean();
  }
}
  