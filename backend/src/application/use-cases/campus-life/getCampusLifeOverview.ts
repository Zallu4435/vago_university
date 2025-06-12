import { ClubModel } from "../../../infrastructure/database/mongoose/models/clubs/ClubModel";
import { CampusEventModel } from "../../../infrastructure/database/mongoose/models/events/CampusEventModel";
import { TeamModel } from "../../../infrastructure/database/mongoose/models/sports.model";


class GetCampusLifeOverview {
  async execute(): Promise<{ events: any[]; sports: any[]; clubs: any[] }> {
    try {
      console.log(`Executing getCampusLifeOverview use case`);

      const events = await CampusEventModel.find()
        .select('id title date time location organizer timeframe icon color description fullTime additionalInfo requirements')
        .limit(10)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch events: ${err.message}`);
        });

      const sports = await TeamModel.find()
        .select('id title type teams icon color division headCoach homeGames record upcomingGames')
        .limit(10)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch sports: ${err.message}`);
        });

      const clubs = await ClubModel.find()
        .select('id name type members icon color status role nextMeeting about upcomingEvents')
        .limit(10)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch clubs: ${err.message}`);
        });

      return { events, sports, clubs };
    } catch (err) {
      console.error(`Error in getCampusLifeOverview use case:`, err);
      throw err;
    }
  }
}

export const getCampusLifeOverview = new GetCampusLifeOverview();