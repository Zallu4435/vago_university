import { ClubModel } from "../../../infrastructure/database/mongoose/models/club.model";

interface GetClubsParams {
  page: number;
  limit: number;
  category: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
}

interface Club {
  id: string;
  name: string;
  description: string;
  type: string;
  createdBy: string;
  status: string;
  createdAt: string;
  members: string[];
  color: string;
  icon: string;
}

interface GetClubsResponse {
  clubs: Club[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetClubs {
  async execute({
    page,
    limit,
    category,
    status,
    startDate,
    endDate,
  }: GetClubsParams): Promise<GetClubsResponse> {
    try {
      const query: any = {};
      if (category !== "all") {
        query.type = { $regex: `^${category}$`, $options: "i" };
      }
      if (status !== "all") {
        query.status = status;
      }
      if (startDate && endDate) {
        query.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const totalItems = await ClubModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count clubs: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const clubs = await ClubModel.find(query)
        .select(
          "name description type createdBy status createdAt members color icon"
        )
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query clubs: ${err.message}`);
        });

      // Map clubs to ensure consistent output format
      const formattedClubs = clubs.map(
        (club): Club => ({
          id: club._id.toString(),
          name: club.name,
          description: club.description,
          type: club.type,
          createdBy: club.createdBy,
          status: club.status,
          createdAt: new Date(club.createdAt).toISOString(),
          members: club.members,
          color: club.color,
          icon: club.icon,
        })
      );

      return {
        clubs: formattedClubs,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getClubs use case:`, err);
      throw err;
    }
  }
}

export const getClubs = new GetClubs();
