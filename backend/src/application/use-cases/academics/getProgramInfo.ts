import { ProgramModel } from '../../../infrastructure/database/mongoose/models/studentProgram.model';

interface GetProgramInfoInput {
  userId: string;
}

interface GetProgramInfoOutput {
  degree: string;
  catalogYear: string;
}

class GetProgramInfo {
  async execute({ userId }: GetProgramInfoInput): Promise<GetProgramInfoOutput> {
    try {
      console.log(`Executing getProgramInfo use case for userId: ${userId}`);

      const program = await ProgramModel.findOne({ studentId: userId })
        .select('degree catalogYear')
        .lean()
        .catch((err) => {
          throw new Error(`Failed to fetch program info: ${err.message}`);
        });

      if (!program) {
        throw new Error('Program information not found');
      }

      return {
        degree: program.degree,
        catalogYear: program.catalogYear,
      };
    } catch (err) {
      console.error(`Error in getProgramInfo use case:`, err);
      throw err;
    }
  }
}

export const getProgramInfo = new GetProgramInfo();