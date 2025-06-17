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
import { CampusEvent, Sport, Club, JoinRequest } from "../../../domain/campus-life/entities/CampusLife";
import { CampusEventModel, EventRequestModel } from "../../../infrastructure/database/mongoose/models/events/CampusEventModel";
import { TeamModel, SportRequestModel } from "../../../infrastructure/database/mongoose/models/sports.model";
import { ClubModel, ClubRequestModel } from "../../../infrastructure/database/mongoose/models/clubs/ClubModel";

export class CampusLifeRepository implements ICampusLifeRepository {
  async getCampusLifeOverview(params: GetCampusLifeOverviewRequestDTO): Promise<CampusLifeOverviewResponseDTO> {
    const events = await CampusEventModel.find()
      .select("title date time location organizer timeframe icon color description fullTime additionalInfo requirements createdAt updatedAt")
      .limit(10)
      .lean();
    const sports = await TeamModel.find()
      .select("title type teams icon color division headCoach homeGames record upcomingGames createdAt updatedAt")
      .limit(10)
      .lean();
    const clubs = await ClubModel.find()
      .select("name type members icon color status role nextMeeting about upcomingEvents createdAt updatedAt")
      .limit(10)
      .lean();

    return {
      events: events.map(
        (e) =>
          new CampusEvent(
            e._id.toString(),
            e.title,
            e.date,
            e.time,
            e.location,
            e.organizer,
            e.timeframe,
            e.icon,
            e.color,
            e.description,
            e.fullTime,
            e.additionalInfo,
            e.requirements,
            e.createdAt.toISOString(),
            e.updatedAt.toISOString()
          )
      ),
      sports: sports.map(
        (s) =>
          new Sport(
            s._id.toString(),
            s.title,
            s.type,
            s.teams,
            s.icon,
            s.color,
            s.division,
            s.headCoach,
            s.homeGames,
            s.record,
            s.upcomingGames,
            s.createdAt.toISOString(),
            s.updatedAt.toISOString()
          )
      ),
      clubs: clubs.map(
        (c) =>
          new Club(
            c._id.toString(),
            c.name,
            c.type,
            c.members,
            c.icon,
            c.color,
            c.status,
            c.role,
            c.nextMeeting,
            c.about,
            c.upcomingEvents,
            c.createdAt.toISOString(),
            c.updatedAt.toISOString()
          )
      ),
    };
  }

  async getEvents(params: GetEventsRequestDTO): Promise<GetEventsResponseDTO> {
    const query: any = {};
    if (params.search) {
      query.title = { $regex: params.search, $options: "i" };
    }
    if (params.status !== "all") {
      const today = new Date().toISOString().split("T")[0];
      query.date = params.status === "upcoming" ? { $gte: today } : { $lt: today };
    }

    const totalItems = await CampusEventModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / params.limit);
    const skip = (params.page - 1) * params.limit;

    const events = await CampusEventModel.find(query)
      .select("title date time location organizer timeframe icon color description fullTime additionalInfo requirements createdAt updatedAt")
      .skip(skip)
      .limit(params.limit)
      .lean();

    return {
      events: events.map(
        (e) =>
          new CampusEvent(
            e._id.toString(),
            e.title,
            e.date,
            e.time,
            e.location,
            e.organizer,
            e.timeframe,
            e.icon,
            e.color,
            e.description,
            e.fullTime,
            e.additionalInfo,
            e.requirements,
            e.createdAt.toISOString(),
            e.updatedAt.toISOString()
          )
      ),
      totalItems,
      totalPages,
      currentPage: params.page,
    };
  }

  async getEventById(params: GetEventByIdRequestDTO): Promise<GetEventByIdResponseDTO | null> {
    const event = await CampusEventModel.findById(params.eventId)
      .select("title date time location organizer timeframe icon color description fullTime additionalInfo requirements createdAt updatedAt")
      .lean();
    if (!event) return null;

    return {
      event: new CampusEvent(
        event._id.toString(),
        event.title,
        event.date,
        event.time,
        event.location,
        event.organizer,
        event.timeframe,
        event.icon,
        event.color,
        event.description,
        event.fullTime,
        event.additionalInfo,
        event.requirements,
        event.createdAt.toISOString(),
        event.updatedAt.toISOString()
      ),
    };
  }

  async getSports(params: GetSportsRequestDTO): Promise<GetSportsResponseDTO> {
    const query: any = {};
    if (params.type) {
      query.type = params.type;
    }
    if (params.search) {
      query.title = { $regex: params.search, $options: "i" };
    }

    const totalItems = await TeamModel.countDocuments(query);
    const sports = await TeamModel.find(query)
      .select("title type teams icon color division headCoach homeGames record upcomingGames createdAt updatedAt")
      .lean();

    return {
      sports: sports.map(
        (s) =>
          new Sport(
            s._id.toString(),
            s.title,
            s.type,
            s.teams,
            s.icon,
            s.color,
            s.division,
            s.headCoach,
            s.homeGames,
            s.record,
            s.upcomingGames,
            s.createdAt.toISOString(),
            s.updatedAt.toISOString()
          )
      ),
      totalItems,
    };
  }

  async getSportById(params: GetSportByIdRequestDTO): Promise<GetSportByIdResponseDTO | null> {
    const sport = await TeamModel.findById(params.sportId)
      .select("title type teams icon color division headCoach homeGames record upcomingGames createdAt updatedAt")
      .lean();
    if (!sport) return null;

    return {
      sport: new Sport(
        sport._id.toString(),
        sport.title,
        sport.type,
        sport.teams,
        sport.icon,
        sport.color,
        sport.division,
        sport.headCoach,
        sport.homeGames,
        sport.record,
        sport.upcomingGames,
        sport.createdAt.toISOString(),
        sport.updatedAt.toISOString()
      ),
    };
  }

  async getClubs(params: GetClubsRequestDTO): Promise<GetClubsResponseDTO> {
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

    const totalItems = await ClubModel.countDocuments(query);
    const clubs = await ClubModel.find(query)
      .select("name type members icon color status role nextMeeting about upcomingEvents createdAt updatedAt")
      .lean();

    return {
      clubs: clubs.map(
        (c) =>
          new Club(
            c._id.toString(),
            c.name,
            c.type,
            c.members,
            c.icon,
            c.color,
            c.status,
            c.role,
            c.nextMeeting,
            c.about,
            c.upcomingEvents,
            c.createdAt.toISOString(),
            c.updatedAt.toISOString()
          )
      ),
      totalItems,
    };
  }

  async getClubById(params: GetClubByIdRequestDTO): Promise<GetClubByIdResponseDTO | null> {
    const club = await ClubModel.findById(params.clubId)
      .select("name type members icon color status role nextMeeting about upcomingEvents createdAt updatedAt")
      .lean();
    if (!club) return null;

    return {
      club: new Club(
        club._id.toString(),
        club.name,
        club.type,
        club.members,
        club.icon,
        club.color,
        club.status,
        club.role,
        club.nextMeeting,
        club.about,
        club.upcomingEvents,
        club.createdAt.toISOString(),
        club.updatedAt.toISOString()
      ),
    };
  }

  async joinClub(params: JoinClubRequestDTO): Promise<JoinClubResponseDTO> {
    const club = await ClubModel.findById(params.clubId).lean();
    if (!club) {
      throw new Error("Club not found");
    }

    const user = await mongoose.model("User").findById(params.studentId).lean();
    if (!user) {
      throw new Error("Student not found");
    }

    const existingRequest = await ClubRequestModel.findOne({
      clubId: params.clubId,
      userId: params.studentId,
    }).lean();
    if (existingRequest) {
      throw new Error("Join request already submitted for this club");
    }

    const newRequest = new ClubRequestModel({
      clubId: params.clubId,
      userId: params.studentId,
      status: "pending",
      whyJoin: params.reason,
      additionalInfo: params.additionalInfo || "",
      createdAt: new Date(),
    });

    await newRequest.save();

    return {
      requestId: newRequest._id.toString(),
      status: newRequest.status,
      message: "Join request submitted successfully",
    };
  }

  async joinSport(params: JoinSportRequestDTO): Promise<JoinSportResponseDTO> {
    const sport = await TeamModel.findById(params.sportId).lean();
    if (!sport) {
      throw new Error("Sport not found");
    }

    const user = await mongoose.model("User").findById(params.studentId).lean();
    if (!user) {
      throw new Error("Student not found");
    }

    const existingRequest = await SportRequestModel.findOne({
      sportId: params.sportId,
      userId: params.studentId,
    }).lean();

    if (existingRequest) {
      throw new Error("Join request already submitted for this sport");
    }

    const newRequest = new SportRequestModel({
      sportId: params.sportId,
      userId: params.studentId,
      status: "pending",
      whyJoin: params.reason,
      additionalInfo: params.additionalInfo || "",
      createdAt: new Date(),
    });

    await newRequest.save();

    return {
      requestId: newRequest._id.toString(),
      status: newRequest.status,
      message: "Join request submitted successfully",
    };
  }

  async joinEvent(params: JoinEventRequestDTO): Promise<JoinEventResponseDTO> {
    const event = await CampusEventModel.findById(params.eventId).lean();
    if (!event) {
      throw new Error("Event not found");
    }

    const user = await mongoose.model("User").findById(params.studentId).lean();
    if (!user) {
      throw new Error("Student not found");
    }

    const existingRequest = await EventRequestModel.findOne({
      eventId: params.eventId,
      userId: params.studentId,
    }).lean();
    if (existingRequest) {
      throw new Error("Join request already submitted for this event");
    }

    const newRequest = new EventRequestModel({
      eventId: params.eventId,
      userId: params.studentId,
      status: "pending",
      whyJoin: params.reason,
      additionalInfo: params.additionalInfo || "",
      createdAt: new Date(),
    });

    await newRequest.save();

    return {
      requestId: newRequest._id.toString(),
      status: newRequest.status,
      message: "Join request submitted successfully",
    };
  }
}