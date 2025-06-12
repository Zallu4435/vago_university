import { ClubModel } from "../../../infrastructure/database/mongoose/models/clubs/ClubModel";

interface GetClubByIdParams {
  clubId: string;
}

class GetClubById {
  async execute({ clubId }: GetClubByIdParams): Promise<any> {
    try {
      console.log(`Executing getClubById use case with clubId:`, clubId);

      const club = await ClubModel.findById(clubId)
        .select('id name type members icon color status role nextMeeting about upcomingEvents')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch club: ${err.message}`);
        });

      if (!club) {
        throw new Error('Club not found');
      }

      return club;
    } catch (err) {
      console.error(`Error in getClubById use case:`, err);
      throw err;
    }
  }
}

export const getClubById = new GetClubById();