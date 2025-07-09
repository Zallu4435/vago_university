import mongoose from "mongoose";
import { ICampusLifeRepository } from "../../../application/campus-life/repositories/ICampusLifeRepository";
import {
  GetCampusLifeOverviewRequestDTO,
  GetEventsRequestDTO,
  GetEventByIdRequestDTO,
  GetSportsRequestDTO,
  GetSportByIdRequestDTO,
  GetClubsRequestDTO,
  GetClubByIdRequestDTO,
  JoinClubRequestDTO,
  JoinSportRequestDTO,
  JoinEventRequestDTO,
  CampusLifeOverviewResponseDTO,
  GetEventsResponseDTO,
  GetEventByIdResponseDTO,
  GetSportsResponseDTO,
  GetSportByIdResponseDTO,
  GetClubsResponseDTO,
  GetClubByIdResponseDTO,
  JoinClubResponseDTO,
  JoinSportResponseDTO,
  JoinEventResponseDTO,
} from "../../../domain/campus-life/dtos/CampusLifeDTOs";
import { CampusEvent, Sport, Club, JoinRequest, SportType } from "../../../domain/campus-life/entities/CampusLife";
import { CampusEventModel, EventRequestModel } from "../../../infrastructure/database/mongoose/models/events/CampusEventModel";
import { TeamModel, SportRequestModel } from "../../../infrastructure/database/mongoose/models/sports.model";
import { ClubModel, ClubRequestModel } from "../../../infrastructure/database/mongoose/models/clubs/ClubModel";

export class CampusLifeRepository implements ICampusLifeRepository {
  async findEvents(query: any, skip: number, limit: number) {
    return (CampusEventModel as any).find(query)
      .select("title date time location organizer timeframe icon color description fullTime additionalInfo requirements createdAt updatedAt")
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async findEventById(eventId: string) {
    return (CampusEventModel as any).findById(eventId)
      .select("title date time location organizer timeframe icon color description fullTime additionalInfo requirements createdAt updatedAt")
      .lean();
  }

  async findSports(query: any) {
    return (TeamModel as any).find(query)
      .select("title type teams icon color division headCoach homeGames record upcomingGames createdAt updatedAt")
      .lean();
  }

  async findSportById(sportId: string) {
    return (TeamModel as any).findById(sportId)
      .select("title type teams icon color division headCoach homeGames record upcomingGames createdAt updatedAt")
      .lean();
  }

  async findClubs(query: any) {
    return (ClubModel as any).find(query)
      .select("name type members icon color status role nextMeeting about upcomingEvents createdAt updatedAt")
      .lean();
  }

  async findClubById(clubId: string) {
    return (ClubModel as any).findById(clubId)
      .select("name type members icon color status role nextMeeting about upcomingEvents createdAt updatedAt")
      .lean();
  }

  async findEventRequestsByUser(userId: string) {
    return (EventRequestModel as any).find({ userId }).lean();
  }

  async findSportRequestsByUser(userId: string) {
    return (SportRequestModel as any).find({ userId }).lean();
  }

  async findClubRequestsByUser(userId: string) {
    return (ClubRequestModel as any).find({ userId }).lean();
  }

  async countEvents(query: any) {
    return (CampusEventModel as any).countDocuments(query);
  }

  async countSports(query: any) {
    return (TeamModel as any).countDocuments(query);
  }

  async countClubs(query: any) {
    return (ClubModel as any).countDocuments(query);
  }

  async getCampusLifeOverview(params: GetCampusLifeOverviewRequestDTO): Promise<any> {
    const events = await (CampusEventModel as any).find()
      .select("title date time location organizer timeframe icon color description fullTime additionalInfo requirements createdAt updatedAt")
      .limit(10)
      .lean();
    const sports = await (TeamModel as any).find()
      .select("title type teams icon color division headCoach homeGames record upcomingGames createdAt updatedAt")
      .limit(10)
      .lean();
    const clubs = await (ClubModel as any).find()
      .select("name type members icon color status role nextMeeting about upcomingEvents createdAt updatedAt")
      .limit(10)
      .lean();
    return { events, sports, clubs };
  }

  async getEvents(params: GetEventsRequestDTO): Promise<any> {
    const query: any = {};
    if (params.search) {
      query.title = { $regex: params.search, $options: "i" };
    }
    if (params.status !== "all") {
      const today = new Date().toISOString().split("T")[0];
      query.date = params.status === "upcoming" ? { $gte: today } : { $lt: today };
    }
    const totalItems = await this.countEvents(query);
    const totalPages = Math.ceil(totalItems / params.limit);
    const skip = (params.page - 1) * params.limit;
    const events = await this.findEvents(query, skip, params.limit);
    let requests: any[] = [];
    if (params.userId) {
      requests = await this.findEventRequestsByUser(params.userId);
    }
    return { events, requests, totalItems, totalPages, currentPage: params.page };
  }

  async getEventById(params: GetEventByIdRequestDTO): Promise<any> {
    return await this.findEventById(params.eventId);
  }

  async getSports(params: GetSportsRequestDTO): Promise<any> {
    const query: any = {};
    if (params.type) {
      query.type = params.type;
    }
    if (params.search) {
      query.title = { $regex: params.search, $options: "i" };
    }
    const totalItems = await this.countSports(query);
    const sports = await this.findSports(query);
    let requests: any[] = [];
    if (params.userId) {
      requests = await this.findSportRequestsByUser(params.userId);
    }
    return { sports, requests, totalItems };
  }

  async getSportById(params: GetSportByIdRequestDTO): Promise<any> {
    return await this.findSportById(params.sportId);
  }

  async getClubs(params: GetClubsRequestDTO): Promise<any> {
    const query: any = {};
    if (params.search) {
      query.name = { $regex: params.search, $options: "i" };
    }
    if (params.type) {
      query.type = { $regex: params.type, $options: "i" };
    }
    if (params.status !== "all") {
      query.status = params.status;
    }
    const totalItems = await this.countClubs(query);
    const clubs = await this.findClubs(query);
    let requests: any[] = [];
    if (params.userId) {
      requests = await this.findClubRequestsByUser(params.userId);
    }
    return { clubs, requests, totalItems };
  }

  async getClubById(params: GetClubByIdRequestDTO): Promise<any> {
    return await this.findClubById(params.clubId);
  }

  async joinClub(params: JoinClubRequestDTO): Promise<any> {
    const newRequest = new (ClubRequestModel as any)({
      clubId: params.clubId,
      userId: params.studentId,
      status: "pending",
      whyJoin: params.reason,
      additionalInfo: params.additionalInfo || "",
      createdAt: new Date(),
    });
    await newRequest.save();
    return newRequest;
  }

  async joinSport(params: JoinSportRequestDTO): Promise<any> {
    const newRequest = new (SportRequestModel as any)({
      sportId: params.sportId,
      userId: params.studentId,
      status: "pending",
      whyJoin: params.reason,
      additionalInfo: params.additionalInfo || "",
      createdAt: new Date(),
    });
    await newRequest.save();
    return newRequest;
  }

  async joinEvent(params: JoinEventRequestDTO): Promise<any> {
    const newRequest = new (EventRequestModel as any)({
      eventId: params.eventId,
      userId: params.studentId,
      status: "pending",
      whyJoin: params.reason,
      additionalInfo: params.additionalInfo || "",
      createdAt: new Date(),
    });
    await newRequest.save();
    return newRequest;
  }
}