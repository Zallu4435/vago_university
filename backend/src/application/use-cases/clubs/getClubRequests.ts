import {
  ClubRequestModel,
  ClubModel,
} from "../../../infrastructure/database/mongoose/models/club.model";

interface GetClubRequestsParams {
  page: number;
  limit: number;
  status: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

interface ClubRequest {
  id: string;
  clubName: string;
  requestedBy: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  type?: string;
}

interface GetClubRequestsResponse {
  clubs: ClubRequest[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetClubRequests {
  async execute({
    page,
    limit,
    status,
    category,
    startDate,
    endDate,
  }: GetClubRequestsParams): Promise<GetClubRequestsResponse> {
    try {
      if (page < 1 || limit < 1) {
        throw new Error("Invalid pagination parameters.");
      }

      const clubQuery: any = {};
      if (category && category.toLowerCase() !== "all") {
        clubQuery.type = { $regex: `^${category}$`, $options: "i" };
      }

      const matchingClubs = await ClubModel.find(clubQuery)
        .select("_id name type")
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query clubs: ${err.message}`);
        });

      const clubIds = matchingClubs.map((club) => club._id);
      if (
        clubIds.length === 0 &&
        category &&
        category.toLowerCase() !== "all"
      ) {
        return {
          clubs: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
        };
      }

      const query: any = {};
      if (status && status.toLowerCase() !== "all") {
        query.status = status;
      }
      if (clubIds.length > 0) {
        query.clubId = { $in: clubIds };
      }
      if (startDate && endDate) {
        query.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const totalItems = await ClubRequestModel.countDocuments(query).catch(
        (err) => {
          throw new Error(`Failed to count club requests: ${err.message}`);
        }
      );
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const rawRequests = await ClubRequestModel.find(query)
        .select("clubId userId status createdAt")
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query club requests: ${err.message}`);
        });

      const clubs: ClubRequest[] = rawRequests.map((req: any) => {
        const club = matchingClubs.find(
          (c) => c._id.toString() === req.clubId?.toString()
        );
        return {
          id: req._id.toString(),
          clubName: club?.name || "Unknown Club",
          requestedBy: req.userId?.email || "Unknown User",
          requestedAt: req.createdAt
            ? new Date(req.createdAt).toISOString()
            : "N/A",
          status: req.status || "pending",
          type: club?.type || "Unknown Type",
        };
      });

      return {
        clubs,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err: any) {
      console.error(`Error in GetClubRequests use case:`, err);
      throw new Error(err.message || "Failed to fetch club join requests.");
    }
  }
}

export const getClubRequests = new GetClubRequests();
