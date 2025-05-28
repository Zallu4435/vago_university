import { ProgressModel } from '../../../infrastructure/database/mongoose/models/progress.model';

interface GetProgressInfoInput {
  userId: string;
}

interface GetProgressInfoOutput {
  overallProgress: number;
  totalCredits: number;
  completedCredits: number;
  remainingCredits: number;
  estimatedGraduation: string;
}

class GetProgressInfo {
  async execute({ userId }: GetProgressInfoInput): Promise<GetProgressInfoOutput> {
    try {
      console.log(`Executing getProgressInfo use case for userId: ${userId}`);

      const progress = await ProgressModel.findOne({ userId })
        .select('overallProgress totalCredits completedCredits remainingCredits estimatedGraduation')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch progress info: ${err.message}`);
        });

      if (!progress) {
        // Return default values with a university-style message fallback
        return {
          overallProgress: 0,
          totalCredits: 0,
          completedCredits: 0,
          remainingCredits: 0,
          estimatedGraduation: 'Progress record not available. Please contact your academic advisor.',
        };
      }

      return {
        overallProgress: progress.overallProgress || 0,
        totalCredits: progress.totalCredits || 0,
        completedCredits: progress.completedCredits || 0,
        remainingCredits: progress.remainingCredits || 0,
        estimatedGraduation: progress.estimatedGraduation || 'To be determined',
      };
    } catch (err) {
      console.error(`Error in getProgressInfo use case:`, err);
      throw err;
    }
  }
}


export const getProgressInfo = new GetProgressInfo();