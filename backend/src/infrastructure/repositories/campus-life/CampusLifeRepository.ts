import { ICampusLifeRepository } from "../../../application/campus-life/repositories/ICampusLifeRepository";
import { CampusEventModel, EventRequestModel } from "../../../infrastructure/database/mongoose/models/events/CampusEventModel";
import { TeamModel, SportRequestModel } from "../../../infrastructure/database/mongoose/models/sports.model";
import { ClubModel, ClubRequestModel } from "../../../infrastructure/database/mongoose/models/clubs/ClubModel";
import { CampusEventFilter, CampusLifeOverviewRequest, ClubFilter, ClubsRequest, EventsRequest, JoinClubRequest, JoinEventRequest, JoinSportRequest, RawCampusEvent, RawClub, RawSport, SportFilter, SportsRequest, RawJoinRequest } from "../../../domain/campus-life/entities/CampusLife";
type WithStringId<T> = Omit<T, "_id"> & { _id: string };
type WithStringIdArray<T> = WithStringId<T>[];
 
export class CampusLifeRepository implements ICampusLifeRepository {
  async findEvents(query, skip: number, limit: number) {
    return CampusEventModel.find(query)
      .select("title date time location organizer timeframe icon color description fullTime additionalInfo requirements createdAt updatedAt")
      .skip(skip)
      .limit(limit)
      .lean();
  } 

  async findEventById(eventId: string) {
    return CampusEventModel.findById(eventId)
      .select("title date time location organizer timeframe icon color description fullTime additionalInfo requirements createdAt updatedAt")
      .lean();
  }

  async findSports(query) {
    return TeamModel.find(query)
      .select("title type teams icon color division headCoach homeGames record upcomingGames createdAt updatedAt")
      .lean();
  }

  async findSportById(sportId: string) {
    return TeamModel.findById(sportId)
      .select("title type teams icon color division headCoach homeGames record upcomingGames createdAt updatedAt")
      .lean();
  }

  async findClubs(query) {
    return ClubModel.find(query)
      .select("name type members icon color status role nextMeeting about upcomingEvents createdAt updatedAt")
      .lean();
  }

  async findClubById(clubId: string) {
    return ClubModel.findById(clubId)
      .select("name type members icon color status role nextMeeting about upcomingEvents createdAt updatedAt")
      .lean();
  }

  async findEventRequestsByUser(userId: string) {
    return EventRequestModel.find({ userId }).lean();
  }

  async findSportRequestsByUser(userId: string) {
    return SportRequestModel.find({ userId }).lean();
  }

  async findClubRequestsByUser(userId: string) {
    return ClubRequestModel.find({ userId }).lean();
  }

  async countEvents(query) {
    return CampusEventModel.countDocuments(query);
  }

  async countSports(query) {
    return TeamModel.countDocuments(query);
  }

  async countClubs(query) { 
    return ClubModel.countDocuments(query);
  }

  async getCampusLifeOverview(params: CampusLifeOverviewRequest) {
    const events = await CampusEventModel.find()
      .select("title date time location organizer timeframe icon color description fullTime additionalInfo requirements createdAt updatedAt")
      .limit(10)
      .lean<WithStringId<RawCampusEvent[]>>({ getters: true });

    const sports = await TeamModel.find()
      .select("title type teams icon color division headCoach homeGames record upcomingGames createdAt updatedAt")
      .limit(10)
      .lean<WithStringId<RawSport[]>>({ getters: true });
    const clubs = await ClubModel.find()
      .select("name type members icon color status role nextMeeting about upcomingEvents createdAt updatedAt")
      .limit(10)
      .lean<WithStringId<RawClub[]>>({ getters: true });
    return { events, sports, clubs };
  }

  async getEvents(params: EventsRequest) {
    const query: CampusEventFilter = {};
    const hasFilter = !!(params.search || (params.status && params.status !== 'all'));
    if (params.search) {
      query.title = { $regex: params.search, $options: "i" };
    }
    if (params.status && params.status !== "all") {
      const today = new Date().toISOString().split("T")[0];
      query.date = params.status === "upcoming" ? { $gte: today } : { $lte: today };
    }
    
    const skip = (params.page - 1) * params.limit;
    const totalItems = await this.countEvents(query);
    const totalPages = Math.ceil(totalItems / params.limit);
    const currentPage = params.page;
    
    let events;
    if (!hasFilter) {
      events = await CampusEventModel.find()
        .select("title date time location organizer timeframe icon color description fullTime additionalInfo requirements createdAt updatedAt")
        .skip(skip)
        .limit(params.limit)
        .lean();
    } else {
      events = await this.findEvents(query, skip, params.limit); 
    }
    
    let requests = [];
    if (params.userId) {
      requests = await this.findEventRequestsByUser(params.userId);
    }
    return { events, requests, totalItems, totalPages, currentPage };
  }

  async getEventById(id: string) {
    return await this.findEventById(id);
  }

  async getSports(params: SportsRequest) {
    const query: SportFilter = {};
    if (params.type) {
      query.type = params.type;
    }
    if (params.search) {
      query.title = { $regex: params.search, $options: "i" };
    }
    const totalItems = await this.countSports(query);
    const sports = await TeamModel.find(query)
      .select("title type teams icon color division headCoach homeGames record upcomingGames createdAt updatedAt")
      .lean<WithStringIdArray<RawSport>>({ getters: true });
    let requests = [];
    if (params.userId) {
      requests = await this.findSportRequestsByUser(params.userId);
    }
    return { sports, requests, totalItems };
  }

  async getSportById(id: string) {
    return await TeamModel.findById(id)
      .select("title type teams icon color division headCoach homeGames record upcomingGames createdAt updatedAt")
      .lean<WithStringId<RawSport>>({ getters: true });
  }

  async getClubs(params: ClubsRequest) {
    const query: ClubFilter = {};
    const hasFilter = !!(params.search || params.type || (params.status && params.status !== 'all'));
    if (params.search) {
      query.name = { $regex: params.search, $options: "i" };
    }
    if (params.type) {
      query.type = { $regex: params.type, $options: "i" };
    }
    if (params.status && params.status !== "all") {
      query.status = params.status;
    }
    let clubs;
    if (!hasFilter) {
      clubs = await ClubModel.find()
        .select("name type members icon color status role nextMeeting about upcomingEvents createdAt updatedAt")
        .limit(5)
        .lean();
    } else {
      clubs = await this.findClubs(query);
    }
    const totalItems = await this.countClubs(query);
    let requests = [];
    if (params.userId) {
      requests = await this.findClubRequestsByUser(params.userId);
    }
    return { clubs, requests, totalItems };
  }

  async getClubById(id: string) {
    return await ClubModel.findById(id)
      .select("name type members icon color status role nextMeeting about upcomingEvents createdAt updatedAt")
      .lean<WithStringId<RawClub>>({ getters: true });
  }

  async joinClub(params: JoinClubRequest) {
    const newRequest = new ClubRequestModel({
      clubId: params.clubId,
      userId: params.studentId,
      status: "pending",
      whyJoin: params.reason,
      additionalInfo: params.additionalInfo || "",
      createdAt: new Date(),
    });
    await newRequest.save();
    return newRequest.toObject({ getters: true }) as WithStringId<RawJoinRequest>;
  }

  async joinSport(params: JoinSportRequest) {
    const newRequest = new SportRequestModel({
      sportId: params.sportId,
      userId: params.studentId,
      status: "pending",
      whyJoin: params.reason,
      additionalInfo: params.additionalInfo || "",
      createdAt: new Date(),
    });
    await newRequest.save();
    return newRequest.toObject({ getters: true }) as WithStringId<RawJoinRequest>;
  }

  async joinEvent(params: JoinEventRequest) {
    const newRequest = new EventRequestModel({
      eventId: params.eventId,
      userId: params.studentId,
      status: "pending",
      whyJoin: params.reason,
      additionalInfo: params.additionalInfo || "",
      createdAt: new Date(),
    });
    await newRequest.save();
    return newRequest.toObject({ getters: true }) as WithStringId<RawJoinRequest>;
  }
}