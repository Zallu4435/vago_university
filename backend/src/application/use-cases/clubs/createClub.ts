import { ClubModel } from "../../../infrastructure/database/mongoose/models/club.model";

interface CreateClubParams {
  name: string;
  category: string;
  description?: string;
  createdBy: string;
  status: string;
}

class CreateClub {
  async execute(data: CreateClubParams): Promise<any> {
    try {
      const sanitizedData = {
        ...data,
        status: data.status.toLowerCase(),
      };

      const club = await ClubModel.create(sanitizedData).catch((err) => {
        throw new Error(`Failed to create club: ${err.message}`);
      });

      return club.toObject();
    } catch (err) {
      console.error(`Error in createClub use case:`, err);
      throw err;
    }
  }
}

export const createClub = new CreateClub();
