import { ChargeModel } from '../../../infrastructure/database/mongoose/models/financial.model';

interface GetAllChargesInput {
  term?: string;
  status?: string;
  search?: string; // Added search parameter
  page?: number;
  limit?: number;
}

interface GetAllChargesOutput {
  data: any[];
  total: number;
}

export class GetAllCharges {
  async execute(input: GetAllChargesInput = {}): Promise<GetAllChargesOutput> {
    try {
      const { term, status, search, page = 1, limit = 10 } = input;

      // Build query
      const query: any = {};
      if (term) query.term = term;
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      // Fetch charges with pagination
      const charges = await ChargeModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Get total count for pagination
      const total = await ChargeModel.countDocuments(query);

      // Format response
      const formattedCharges = charges.map((charge) => ({
        id: charge._id.toString(),
        title: charge.title,
        description: charge.description,
        amount: charge.amount,
        term: charge.term,
        dueDate: charge.dueDate.toISOString(),
        applicableFor: charge.applicableFor,
        status: charge.status,
        createdBy: charge.createdBy?.toString(),
        createdAt: charge.createdAt.toISOString(),
        updatedAt: charge.updatedAt.toISOString(),
      }));

      return {
        data: formattedCharges,
        total,
      };
    } catch (err) {
      console.error('GetAllCharges Error:', err);
      throw new Error(`Failed to fetch charges: ${(err as Error).message}`);
    }
  }
}

export const getAllCharges = new GetAllCharges();