import { RequirementsModel } from '../../../infrastructure/database/mongoose/models/requirement.model';

interface GetRequirementsInfoInput {
  userId: string;
}

interface GetRequirementsInfoOutput {
  core: { percentage: number; completed: number; total: number };
  elective: { percentage: number; completed: number; total: number };
  general: { percentage: number; completed: number; total: number };
}

class GetRequirementsInfo {
  async execute({ userId }: GetRequirementsInfoInput): Promise<GetRequirementsInfoOutput> {
    try {
      console.log(`Executing getRequirementsInfo use case for userId: ${userId}`);

      const requirements = await RequirementsModel.findOne({ userId })
        .select('core elective general')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch requirements info: ${err.message}`);
        });

      if (!requirements) {
        // Return default values with placeholder info
        return {
          core: {
            percentage: 0,
            completed: 0,
            total: 0,
          },
          elective: {
            percentage: 0,
            completed: 0,
            total: 0,
          },
          general: {
            percentage: 0,
            completed: 0,
            total: 0,
          },
        };
      }

      return {
        core: requirements.core || { percentage: 0, completed: 0, total: 0 },
        elective: requirements.elective || { percentage: 0, completed: 0, total: 0 },
        general: requirements.general || { percentage: 0, completed: 0, total: 0 },
      };
    } catch (err) {
      console.error(`Error in getRequirementsInfo use case:`, err);
      throw err;
    }
  }
}

export const getRequirementsInfo = new GetRequirementsInfo();