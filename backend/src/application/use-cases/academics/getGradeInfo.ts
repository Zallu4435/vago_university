import { GradeModel } from '../../../infrastructure/database/mongoose/models/grade.model';

interface GetGradeInfoInput {
  userId: string;
}

interface GetGradeInfoOutput {
  cumulativeGPA: string;
  termGPA: string;
  termName: string;
  creditsEarned: string;
  creditsInProgress: string;
}

class GetGradeInfo {
  async execute({ userId }: GetGradeInfoInput): Promise<GetGradeInfoOutput> {
    try {
      console.log(`Executing getGradeInfo use case for userId: ${userId}`);

      const grade = await GradeModel.findOne({ userId })
        .select('cumulativeGPA termGPA termName creditsEarned creditsInProgress')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch grade info: ${err.message}`);
        });

      if (!grade) {
        // Returning friendly defaults for students with no grade records
        return {
          cumulativeGPA: 'N/A',
          termGPA: 'N/A',
          termName: 'No active/enrolled term found',
          creditsEarned: '0',
          creditsInProgress: '0',
        };
      }

      return {
        cumulativeGPA: grade.cumulativeGPA || 'N/A',
        termGPA: grade.termGPA || 'N/A',
        termName: grade.termName || 'Unknown Term',
        creditsEarned: grade.creditsEarned || '0',
        creditsInProgress: grade.creditsInProgress || '0',
      };
    } catch (err) {
      console.error(`Error in getGradeInfo use case:`, err);
      throw err;
    }
  }
}


export const getGradeInfo = new GetGradeInfo();