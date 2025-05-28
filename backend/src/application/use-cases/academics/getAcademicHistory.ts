import { AcademicHistoryModel } from '../../../infrastructure/database/mongoose/models/academicHistory.model';

interface GetAcademicHistoryInput {
  userId: string;
  startTerm?: string;
  endTerm?: string;
}

interface AcademicHistory {
  term: string;
  credits: string;
  gpa: string;
  id: number;
}

interface GetAcademicHistoryOutput {
  history: AcademicHistory[];
}

class GetAcademicHistory {
  async execute({ userId, startTerm, endTerm }: GetAcademicHistoryInput): Promise<GetAcademicHistoryOutput> {
    try {
      console.log(`Executing getAcademicHistory use case for userId: ${userId} with filters:`, { startTerm, endTerm });

      const query: any = { userId };
      if (startTerm) query.term = { $gte: startTerm };
      if (endTerm) query.term = { ...query.term, $lte: endTerm };

      const history = await AcademicHistoryModel.find(query)
        .select('term credits gpa id')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch academic history: ${err.message}`);
        });

      return { history };
    } catch (err) {
      console.error(`Error in getAcademicHistory use case:`, err);
      throw err;
    }
  }
}

export const getAcademicHistory = new GetAcademicHistory();