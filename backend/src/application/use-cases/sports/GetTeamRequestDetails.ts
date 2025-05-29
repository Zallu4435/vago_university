import mongoose from 'mongoose';
import { SportRequestModel, TeamModel } from '../../../infrastructure/database/mongoose/models/sports.model';
import { User as UserModel } from '../../../infrastructure/database/mongoose/models/user.model';

interface GetTeamRequestDetailsInput {
  id: string;
}

interface TeamRequestDetails {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  whyJoin: string;
  additionalInfo: string;
  team: {
    id: string;
    name: string;
    sportType: string;
    coach: string;
    playerCount: number;
    division: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

class GetTeamRequestDetails {
  async execute(id: string): Promise<TeamRequestDetails> {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('Invalid team request ID');
      }

      const teamRequest = await SportRequestModel.findById(id)
        .select('sportId userId status whyJoin additionalInfo createdAt updatedAt')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch team request: ${err.message}`);
        });

      if (!teamRequest) {
        throw new Error('Team request not found');
      }

      const team = await TeamModel.findById(teamRequest.sportId)
        .select('title type headCoach participants division')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch team: ${err.message}`);
        });

      if (!team) {
        throw new Error('Associated team not found');
      }

      let user = null;
      if (teamRequest.userId) {
        user = await UserModel.findById(teamRequest.userId)
          .select('firstName lastName email')
          .lean()
          .catch((err) => {
            throw new Error(`Failed to fetch user: ${err.message}`);
          });
      }

      return {
        id: teamRequest._id.toString(),
        status: teamRequest.status,
        createdAt: teamRequest.createdAt.toISOString(),
        updatedAt: teamRequest.updatedAt.toISOString(),
        whyJoin: teamRequest.whyJoin,
        additionalInfo: teamRequest.additionalInfo || '',
        team: {
          id: team._id.toString(),
          name: team.title,
          sportType: team.type,
          coach: team.headCoach || 'Unknown',
          playerCount: team.participants || 0,
          division: team.division || 'N/A',
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
      console.error(`Error in getTeamRequestDetails use case:`, err);
      throw err;
    }
  }
}

export const getTeamRequestDetails = new GetTeamRequestDetails();