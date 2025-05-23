import { ParticipantModel } from '../../../infrastructure/database/mongoose/models/events.model';

interface GetParticipantsParams {
  page: number;
  limit: number;
  status: string;
}

interface GetParticipantsResponse {
  participants: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

class GetParticipants {
  async execute({
    page,
    limit,
    status,
  }: GetParticipantsParams): Promise<GetParticipantsResponse> {
    try {
      console.log(`Executing getParticipants use case with params:`, {
        page,
        limit,
        status,
      });

      const query: any = {};
      if (status !== 'all') query.status = status;

      const totalItems = await ParticipantModel.countDocuments(query).catch((err) => {
        throw new Error(`Failed to count participants: ${err.message}`);
      });
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      const participants = await ParticipantModel.find(query)
        .select('name studentId registeredAt status rejectionReason')
        .skip(skip)
        .limit(limit)
        .lean()
        .catch((err) => {
          throw new Error(`Failed to query participants: ${err.message}`);
        });

      return {
        participants,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (err) {
      console.error(`Error in getParticipants use case:`, err);
      throw err;
    }
  }
}

export const getParticipants = new GetParticipants();