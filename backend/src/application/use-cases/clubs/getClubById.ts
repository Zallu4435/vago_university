import { ClubModel } from "../../../infrastructure/database/mongoose/models/club.model";

class GetClubById {
  async execute(id: string): Promise<any> {
    try {
      const club = await ClubModel.findById(id)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query club: ${err.message}`);
        });

      if (!club) {
        throw new Error("Club not found");
      }

      return club;
    } catch (err) {
      console.error(`Error in getClubById use case:`, err);
      throw err;
    }
  }
}

export const getClubById = new GetClubById();
