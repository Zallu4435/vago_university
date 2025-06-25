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
import {
  GetSportsResponseDTO,
  GetSportByIdResponseDTO,
  CreateSportResponseDTO,
  UpdateSportResponseDTO,
  GetSportRequestsResponseDTO,
  GetSportRequestDetailsResponseDTO,
  JoinSportResponseDTO,
  SportSummaryDTO,
} from "../../../domain/sports/dtos/SportResponseDTOs";
import { Sport, SportStatus } from "../../../domain/sports/entities/Sport";
import { SportRequest, SportRequestStatus } from "../../../domain/sports/entities/SportRequest";
import { TeamModel, SportRequestModel } from "../../../infrastructure/database/mongoose/models/sports.model";
import { User as UserModel } from "../../../infrastructure/database/mongoose/models/user.model";
import mongoose from "mongoose";

export class SportsRepository implements ISportsRepository {
  async getSports(params: GetSportsRequestDTO): Promise<GetSportsResponseDTO> {
    
    const { page, limit, sportType, status, coach } = params;
    const query: any = {};


    if (sportType !== "all") {
      query.type = { $regex: `^${sportType}$`, $options: "i" };
    }
    if (status !== "all") {
      query.status = { $regex: `^${status}$`, $options: "i" };
    }

    if (coach !== "all") {
      const [startDate, endDate] = coach.split(",").map((date) => date.trim());
      if (!startDate || !endDate) {
        throw new Error("Invalid coach date range format. Expected: startDate,endDate");
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format in coach parameter");
      }

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    const totalItems = await TeamModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    const sports = await TeamModel.find(query)
      .select("title type headCoach status createdAt icon color participants")
      .skip(skip)
      .limit(limit)
      .lean();
    
    const mappedSports: SportSummaryDTO[] = sports.map((sport) => ({
      id: sport._id.toString(),
      title: sport.title,
      type: sport.type,
      headCoach: sport.headCoach,
      playerCount: sport.participants || 0,
      status: sport.status,
      formedOn: sport.createdAt.toISOString(),
      logo: "",
      division: "",
      participants: sport.participants || 0,
      icon: sport.icon,
      color: sport.color,
      createdAt: new Date(sport.createdAt).toISOString()
    }));

    const response = {
      sports: mappedSports,
      totalItems,
      totalPages,
      currentPage: page
    };

    return response;
  }

  async getSportById(params: GetSportByIdRequestDTO): Promise<GetSportByIdResponseDTO | null> {
    const sport = await TeamModel.findById(params.id).lean();
    if (!sport) {
      return null;
    }

    return {
      sport: new Sport({
        id: sport._id.toString(),
        title: sport.title,
        type: sport.type,
        headCoach: sport.headCoach,
        playerCount: sport.playerCount,
        status: sport.status === "active" ? SportStatus.Active : SportStatus.Inactive,
        formedOn: sport.formedOn,
        logo: sport.logo,
        division: sport.division,
        participants: sport.participants || 0,
        icon: sport.icon,
        color: sport.color,
        createdAt: sport.createdAt,
        updatedAt: sport.updatedAt,
      }),
    };
  }

  async createSport(params: CreateSportRequestDTO): Promise<CreateSportResponseDTO> {
    const newSport = await TeamModel.create({
      ...params,
      status: params.status?.toLowerCase() || "active",
    });

    return {
      sport: new Sport({
        id: newSport._id.toString(),
        title: newSport.title,
        type: newSport.type,
        headCoach: newSport.headCoach,
        playerCount: newSport.playerCount,
        status: newSport.status,
        formedOn: newSport.formedOn,
        logo: newSport.logo,
        division: newSport.division,
        participants: newSport.participants || 0,
        icon: newSport.icon,
        color: newSport.color,
        createdAt: newSport.createdAt,
        updatedAt: newSport.updatedAt,
      }),
    };
  }

  async updateSport(params: UpdateSportRequestDTO): Promise<UpdateSportResponseDTO | null> {
    const updatedSport = await TeamModel.findByIdAndUpdate(
      params.id,
      { $set: { ...params, updatedAt: new Date() } },
      { new: true }
    ).lean();

    if (!updatedSport) {
      return null;
    }

    return {
      sport: new Sport({
        id: updatedSport._id.toString(),
        title: updatedSport.title,
        type: updatedSport.type,
        headCoach: updatedSport.headCoach,
        playerCount: updatedSport.playerCount,
        status: updatedSport.status,
        formedOn: updatedSport.formedOn,
        logo: updatedSport.logo,
        division: updatedSport.division,
        participants: updatedSport.participants || 0,
        icon: updatedSport.icon,
        color: updatedSport.color,
        createdAt: updatedSport.createdAt,
        updatedAt: updatedSport.updatedAt,
      }),
    };
  }

  async deleteSport(params: DeleteSportRequestDTO): Promise<void> {
    await TeamModel.findByIdAndDelete(params.id);
  }

  async getSportRequests(params: GetSportRequestsRequestDTO): Promise<GetSportRequestsResponseDTO> {
    const { page, limit, status, type, startDate, endDate } = params;
    const query: any = {};

    if (status && status.toLowerCase() !== "all") {
      query.status = status;
    }

    const sportQuery: any = {};
    if (type && type.toLowerCase() !== "all") {
      sportQuery.type = { $regex: `^${type}$`, $options: "i" };
    }

    const matchingSports = await TeamModel.find(sportQuery)
      .select("_id title type")
      .lean();
    const sportIds = matchingSports.map((sport) => sport._id);

    if (sportIds.length === 0 && type && type.toLowerCase() !== "all") {
      return {
        requests: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: page
      };
    }

    if (sportIds.length > 0) {
      query.sportId = { $in: sportIds };
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
      .populate({
        path: "sportId",
        select: "title type"
      })
      .populate({
        path: "userId",
        select: "email"
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const mappedRequests = requests.map((request: any) => ({
      sportName: request.sportId?.title || "Unknown Sport",
      requestId: request._id.toString(),
      requestedBy: request.userId?.email || "Unknown User",
      type: request.sportId?.type || "Unknown Type",
      requestedAt: new Date(request.createdAt).toISOString(),
      status: request.status
    }));

    return {
      requests: mappedRequests,
      totalItems,
      totalPages,
      currentPage: page
    };
  }

  async approveSportRequest(params: ApproveSportRequestRequestDTO): Promise<void> {
    const sportRequest = await SportRequestModel.findById(params.id);
    if (!sportRequest) {
      throw new Error("Sport request not found");
    }

    if (sportRequest.status !== SportRequestStatus.Pending.toString()) {
      throw new Error("Sport request is not in pending status");
    }

    await SportRequestModel.findByIdAndUpdate(
      params.id,
      { status: SportRequestStatus.Approved, updatedAt: new Date() },
      { runValidators: true }
    );

    const updatedSport = await TeamModel.findByIdAndUpdate(
      sportRequest.sportId,
      { $inc: { participants: 1 }, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedSport) {
      console.warn(`No sport found for ID: ${sportRequest.sportId}`);
    } else {
      console.log(`Participants count incremented for sport ID: ${sportRequest.sportId}`);
    }
  }

  async rejectSportRequest(params: RejectSportRequestRequestDTO): Promise<void> {
    const sportRequest = await SportRequestModel.findById(params.id);
    if (!sportRequest) {
      throw new Error("Sport request not found");
    }

    if (sportRequest.status !== SportRequestStatus.Pending.toString()) {
      throw new Error("Sport request is not in pending status");
    }

    await SportRequestModel.findByIdAndUpdate(
      params.id,
      { status: SportRequestStatus.Rejected, updatedAt: new Date() },
      { runValidators: true }
    );
  }

  async getSportRequestDetails(params: GetSportRequestDetailsRequestDTO): Promise<GetSportRequestDetailsResponseDTO | null> {
    if (!mongoose.isValidObjectId(params.id)) {
      throw new Error("Invalid sport request ID");
    }

    const sportRequest = await SportRequestModel.findById(params.id)
      .populate({
        path: "sportId",
        select: "title type headCoach participants division",
      })
      .populate({
        path: "userId",
        select: "firstName lastName email",
      })
      .lean();

    if (!sportRequest) {
      return null;
    }

    if (!sportRequest.sportId) {
      throw new Error("Sport not found");
    }

    return {
      sportRequest: {
        id: sportRequest._id.toString(),
        status: sportRequest.status,
        createdAt: sportRequest.createdAt.toISOString(),
        updatedAt: sportRequest.updatedAt.toISOString(),
        whyJoin: sportRequest.whyJoin,
        additionalInfo: sportRequest.additionalInfo || "",
        sport: {
          id: (sportRequest.sportId as any)._id.toString(),
          title: (sportRequest.sportId as any).title,
          type: (sportRequest.sportId as any).type,
          headCoach: (sportRequest.sportId as any).headCoach || "Unknown",
          playerCount: (sportRequest.sportId as any).participants || 0,
          division: (sportRequest.sportId as any).division || "N/A",
        },
        user: sportRequest.userId
          ? {
              id: (sportRequest.userId as any)._id.toString(),
              name: `${(sportRequest.userId as any).firstName} ${(sportRequest.userId as any).lastName}`.trim(),
              email: (sportRequest.userId as any).email,
            }
          : undefined,
      },
    };
  }

  async joinSport(params: JoinSportRequestDTO): Promise<JoinSportResponseDTO> {
    const sport = await TeamModel.findById(params.sportId).lean();
    if (!sport) {
      throw new Error("Sport not found");
    }

    const user = await UserModel.findById(params.studentId).lean();
    if (!user) {
      throw new Error("Student not found");
    }

    const existingRequest = await SportRequestModel.findOne({
      userId: params.studentId,
      sportId: params.sportId,
    }).lean();

    if (existingRequest) {
      throw new Error("Join request already submitted for this sport");
    }

    const sportRequest = new SportRequestModel({
      sportId: params.sportId,
      userId: params.studentId,
      status: SportRequestStatus.Pending,
      whyJoin: params.reason,
      additionalInfo: params.additionalInfo,
      createdAt: new Date(),
    });

    await sportRequest.save();

    return {
      requestId: sportRequest._id.toString(),
      status: sportRequest.status,
      message: "Join request submitted successfully",
    };
  }
} 