import mongoose from 'mongoose';
import { ChargeModel } from '../../../infrastructure/database/mongoose/models/financial.model';

export class GetCurrentCharges {
  async execute(studentId: string, term?: string): Promise<any[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      const query: any = { studentId };
      if (term) query.term = term;
      const charges = await ChargeModel.find(query).lean();
      if (!charges.length) return [];
      return charges.map(charge => ({
        id: charge._id.toString(),
        description: charge.description,
        amount: charge.amount,
        dueDate: charge.dueDate.toISOString(),
        status: charge.status,
        term: charge.term,
      }));
    } catch (err) {
      console.error('GetCurrentCharges Error:', err);
      throw new Error(`Failed to fetch charges: ${err.message}`);
    }
  }
}