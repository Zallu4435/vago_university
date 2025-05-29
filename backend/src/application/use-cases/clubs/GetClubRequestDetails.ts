import mongoose from "mongoose";
import {
  ClubRequestModel,
  ClubModel,
} from "../../../infrastructure/database/mongoose/models/club.model";
import { User as UserModel } from "../../../infrastructure/database/mongoose/models/user.model";

interface GetClubRequestDetailsInput {
  id: string;
}

interface ClubRequestDetails {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  whyJoin: string;
  additionalInfo: string;
  club: {
    id: string;
    name: string;
    type: string;
    about: string;
    nextMeeting: string;
    enteredMembers: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

class GetClubRequestDetails {
  async execute(id: string): Promise<ClubRequestDetails> {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid club request ID");
      }

      const clubRequest = await ClubRequestModel.findById(id)
        .select(
          "clubId userId status whyJoin additionalInfo createdAt updatedAt"
        )
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch club request: ${err.message}`);
        });

      if (!clubRequest) {
        throw new Error("Club request not found");
      }

      const club = await ClubModel.findById(clubRequest.clubId)
        .select("name type about nextMeeting enteredMembers")
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch club: ${err.message}`);
        });

      if (!club) {
        throw new Error("Associated club not found");
      }

      let user = null;
      if (clubRequest.userId) {
        user = await UserModel.findById(clubRequest.userId)
          .select("firstName lastName email")
          .lean()
          .catch((err) => {
            throw new Error(`Failed to fetch user: ${err.message}`);
          });
      }

      return {
        id: clubRequest._id.toString(),
        status: clubRequest.status,
        createdAt: clubRequest.createdAt.toISOString(),
        updatedAt: clubRequest.updatedAt.toISOString(),
        whyJoin: clubRequest.whyJoin,
        additionalInfo: clubRequest.additionalInfo || "",
        club: {
          id: club._id.toString(),
          name: club.name,
          type: club.type,
          about: club.about || "",
          nextMeeting: club.nextMeeting || "",
          enteredMembers: club.enteredMembers || 0,
        },
        user: user
          ? {
              id: user._id.toString(),
              name: `${user.firstName} ${user.lastName}`.trim(),
              email: user.email,
            }
          : undefined,
      };
    } catch (err) {
      console.error(`Error in getClubRequestDetails use case:`, err);
      throw err;
    }
  }
}

export const getClubRequestDetails = new GetClubRequestDetails();
