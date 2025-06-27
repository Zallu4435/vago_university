import {
    GetClubsRequestDTO,
    GetClubByIdRequestDTO,
    CreateClubRequestDTO,
    UpdateClubRequestDTO,
    DeleteClubRequestDTO,
  } from "../../../domain/clubs/dtos/ClubRequestDTOs";
  import {
    GetClubsResponseDTO,
    GetClubByIdResponseDTO,
    CreateClubResponseDTO,
    UpdateClubResponseDTO,
    ClubSummaryDTO,
  } from "../../../domain/clubs/dtos/ClubResponseDTOs";
  import {
    GetClubRequestsRequestDTO,
    ApproveClubRequestRequestDTO,
    RejectClubRequestRequestDTO,
    GetClubRequestDetailsRequestDTO,
  } from "../../../domain/clubs/dtos/ClubRequestRequestDTOs";
  import {
    GetClubRequestsResponseDTO,
    GetClubRequestDetailsResponseDTO,
    SimplifiedClubRequestDTO,
  } from "../../../domain/clubs/dtos/ClubRequestResponseDTOs";
  import { IClubsRepository } from "../../../application/clubs/repositories/IClubsRepository";
  import { ClubModel, ClubRequestModel } from "../../../infrastructure/database/mongoose/models/clubs/ClubModel";
  import { User as UserModel } from "../../../infrastructure/database/mongoose/models/user.model";
  import { Club, ClubStatus } from "../../../domain/clubs/entities/Club";
  import { ClubRequest, ClubRequestStatus } from "../../../domain/clubs/entities/ClubRequest";
  import mongoose from "mongoose";
  import { ClubErrorType } from "../../../domain/clubs/enums/ClubErrorType";
  
  export class ClubsRepository implements IClubsRepository {
    async getClubs(params: GetClubsRequestDTO): Promise<GetClubsResponseDTO> {
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
  
      const mappedClubs: ClubSummaryDTO[] = clubs.map((club) => ({
        id: club._id.toString(),
        name: club.name,
        type: club.type,
        createdBy: club.createdBy,
        status: club.status,
        createdAt: new Date(club.createdAt).toISOString(),
        color: club.color,
        icon: club.icon,
        enteredMembers: club.enteredMembers || 0,
      }));
  
      return {
        data: mappedClubs,
        totalItems,
        totalPages,
        currentPage: page,
      };
    }
  
    async getClubById(params: GetClubByIdRequestDTO): Promise<GetClubByIdResponseDTO | null> {
      const club = await ClubModel.findById(params.id).lean();
      if (!club) {
        return null;
      }
  
      return {
        club: new Club({
          id: club._id.toString(),
          name: club.name,
          type: club.type,
          createdBy: club.createdBy,
          status: club.status === 'active' ? ClubStatus.Active : ClubStatus.Inactive,
          members: club.members ? [club.members] : [],
          color: club.color || "#8B5CF6",
          icon: club.icon || "🎓",
          nextMeeting: club.nextMeeting || "",
          about: club.about || "",
          enteredMembers: club.enteredMembers || 0,
          upcomingEvents: club.upcomingEvents || [],
          role: club.role,
          createdAt: club.createdAt,
          updatedAt: club.updatedAt
        }),
      };
    }
  
    async createClub(params: CreateClubRequestDTO): Promise<CreateClubResponseDTO> {
      const newClub = await ClubModel.create({
        ...params,
        status: params.status?.toLowerCase() || "active",
      });
      return {
        club: new Club({
          id: newClub._id.toString(),
          name: newClub.name,
          type: newClub.type,
          createdBy: newClub.createdBy,
          status: newClub.status,
          description: newClub.description,
          members: newClub.members,
          color: newClub.color,
          icon: newClub.icon,
          nextMeeting: newClub.nextMeeting,
          about: newClub.about,
          enteredMembers: newClub.enteredMembers,
          upcomingEvents: newClub.upcomingEvents,
        }),
      };
    }
  
    async updateClub(params: UpdateClubRequestDTO): Promise<UpdateClubResponseDTO | null> {
      const updatedClub = await ClubModel.findByIdAndUpdate(
        params.id,
        { $set: { ...params, updatedAt: new Date() } },
        { new: true }
      ).lean();
      if (!updatedClub) {
        return null;
      }
  
      return {
        club: new Club({
          id: updatedClub._id.toString(),
          name: updatedClub.name,
          type: updatedClub.type,
          createdBy: updatedClub.createdBy,
          status: updatedClub.status,
          description: updatedClub.description,
          members: updatedClub.members,
          color: updatedClub.color,
          icon: updatedClub.icon,
          nextMeeting: updatedClub.nextMeeting,
          about: updatedClub.about,
          enteredMembers: updatedClub.enteredMembers,
          upcomingEvents: updatedClub.upcomingEvents,
        }),
      };
    }
  
    async deleteClub(params: DeleteClubRequestDTO): Promise<void> {
      await ClubModel.findByIdAndDelete(params.id);
    }
  
    async getClubRequests(params: GetClubRequestsRequestDTO): Promise<GetClubRequestsResponseDTO> {
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
  
      if (clubIds.length === 0 && category && category.toLowerCase() !== "all") {
        return {
          data: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
        };
      }
  
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
  
      const mappedRequests: SimplifiedClubRequestDTO[] = rawRequests.map((req: any) => ({
        clubName: req.clubId?.name || "Unknown Club",
        requestedId: req._id.toString(),
        requestedBy: req.userId?.email || "Unknown User",
        type: req.clubId?.type || "Unknown Type",
        requestedAt: req.createdAt ? new Date(req.createdAt).toISOString() : "N/A",
        status: req.status || "pending",
      }));
  
      return {
        data: mappedRequests,
        totalItems,
        totalPages,
        currentPage: page,
      };
    }
  
    async approveClubRequest(params: ApproveClubRequestRequestDTO): Promise<void> {
      const clubRequest = await ClubRequestModel.findById(params.id);
      if (!clubRequest) {
        throw new Error(ClubErrorType.ClubRequestNotFound);
      }
  
      if (clubRequest.status !== ClubRequestStatus.Pending.toString()) {
        throw new Error(ClubErrorType.ClubRequestNotPending);
      }
  
      await ClubRequestModel.findByIdAndUpdate(
        params.id,
        { status: ClubRequestStatus.Approved, updatedAt: new Date() },
        { runValidators: true }
      );
  
      const updatedClub = await ClubModel.findByIdAndUpdate(
        clubRequest.clubId,
        { $inc: { enteredMembers: 1 }, updatedAt: new Date() },
        { new: true }
      );
  
      if (!updatedClub) {
        console.warn(`No club found for ID: ${clubRequest.clubId}`);
      } else {
        console.log(`Members count incremented for club ID: ${clubRequest.clubId}`);
      }
    }
  
    async rejectClubRequest(params: RejectClubRequestRequestDTO): Promise<void> {
      const clubRequest = await ClubRequestModel.findById(params.id);
      if (!clubRequest) {
        throw new Error(ClubErrorType.ClubRequestNotFound);
      }
  
      if (clubRequest.status !== ClubRequestStatus.Pending.toString()) {
        throw new Error(ClubErrorType.ClubRequestNotPending);
      }
  
      await ClubRequestModel.findByIdAndUpdate(
        params.id,
        { status: ClubRequestStatus.Rejected, updatedAt: new Date() },
        { runValidators: true }
      );
    }
  
    async getClubRequestDetails(params: GetClubRequestDetailsRequestDTO): Promise<GetClubRequestDetailsResponseDTO | null> {
      if (!mongoose.isValidObjectId(params.id)) {
        throw new Error(ClubErrorType.InvalidClubRequestId);
      }
  
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
  
      if (!clubRequest) {
        return null;
      }
  
      if (!clubRequest.clubId) {
        throw new Error(ClubErrorType.ClubNotFound);
      }
  
      return {
        clubRequest: {
          id: clubRequest._id.toString(),
          status: clubRequest.status,
          createdAt: clubRequest.createdAt.toISOString(),
          updatedAt: clubRequest.updatedAt.toISOString(),
          whyJoin: clubRequest.whyJoin,
          additionalInfo: clubRequest.additionalInfo || "",
          club: {
            id: (clubRequest.clubId as any)._id.toString(),
            name: (clubRequest.clubId as any).name,
            type: (clubRequest.clubId as any).type,
            about: (clubRequest.clubId as any).about || "",
            nextMeeting: (clubRequest.clubId as any).nextMeeting || "",
            enteredMembers: (clubRequest.clubId as any).enteredMembers || 0,
          },
          user: clubRequest.userId
            ? {
                id: (clubRequest.userId as any)._id.toString(),
                name: `${(clubRequest.userId as any).firstName} ${(clubRequest.userId as any).lastName}`.trim(),
                email: (clubRequest.userId as any).email,
              }
            : undefined,
        },
      };
    }
  }