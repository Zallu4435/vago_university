import { ChargeModel } from "../../../infrastructure/database/mongoose/models/financial.model";
import { StudentFinancialInfoModel } from "../../../infrastructure/database/mongoose/models/financial.model";
import { ProgramModel } from "../../../infrastructure/database/mongoose/models/studentProgram.model"; // Adjust path as needed

interface CreateChargeInput {
  title: string;
  description: string;
  amount: number;
  term: string;
  dueDate: Date;
  applicableFor: string;
  createdBy: string; // Admin ID
}

interface CreateChargeOutput {
  charge: any;
  studentFinancialInfos: any[];
}

export class CreateCharge {
  async execute(input: CreateChargeInput): Promise<CreateChargeOutput> {
    try {
      // Step 1: Create the charge
      const charge = await ChargeModel.create({
        title: input.title,
        description: input.description,
        amount: input.amount,
        term: input.term,
        dueDate: input.dueDate,
        applicableFor: input.applicableFor,
        createdBy: input.createdBy,
      });

      // Step 2: Find students based on applicableFor from Program collection
      // applicableFor matches degree or catalogYear case-insensitively
      const programs = await ProgramModel.find({
        $or: [
          { degree: { $regex: `^${input.applicableFor}$`, $options: "i" } }, // Match degree
          {
            catalogYear: { $regex: `^${input.applicableFor}$`, $options: "i" },
          }, // Match catalogYear
        ],
      }).select("studentId"); // Only need studentId

      // Extract unique student IDs
      const studentIds = [
        ...new Set(programs.map((program) => program.studentId.toString())),
      ];

      // Step 3: Create StudentFinancialInfo for each student
      const studentFinancialInfos = await Promise.all(
        studentIds.map(async (studentId) => {
          return await StudentFinancialInfoModel.create({
            studentId,
            chargeId: charge._id,
            amount: charge.amount,
            paymentDueDate: charge.dueDate,
            status: "Pending",
            term: charge.term,
            issuedAt: new Date(),
          });
        })
      );

      // Format charge response
      const formattedCharge = {
        id: charge._id.toString(),
        title: charge.title,
        description: charge.description,
        amount: charge.amount,
        term: charge.term,
        dueDate: charge.dueDate.toISOString(),
        applicableFor: charge.applicableFor,
        createdBy: charge.createdBy?.toString(),
        createdAt: charge.createdAt.toISOString(),
        updatedAt: charge.updatedAt.toISOString(),
      };

      // Format studentFinancialInfos response
      const formattedStudentFinancialInfos = studentFinancialInfos.map(
        (info) => ({
          id: info._id.toString(),
          studentId: info.studentId.toString(),
          chargeId: info.chargeId.toString(),
          amount: info.amount,
          paymentDueDate: info.paymentDueDate.toISOString(),
          status: info.status,
          term: info.term,
          issuedAt: info.issuedAt.toISOString(),
          createdAt: info.createdAt.toISOString(),
          updatedAt: info.updatedAt.toISOString(),
        })
      );

      return {
        charge: formattedCharge,
        studentFinancialInfos: formattedStudentFinancialInfos,
      };
    } catch (err) {
      console.error("CreateCharge Error:", err);
      throw new Error(`Failed to create charge: ${(err as Error).message}`);
    }
  }
}

export const createCharge = new CreateCharge();
