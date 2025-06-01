import mongoose from 'mongoose';
import { PaymentModel } from '../../../infrastructure/database/mongoose/models/financial.model';

export class GetPaymentHistory {
  async execute(studentId: string, filters: { startDate?: string; endDate?: string; status?: string }): Promise<any[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      const query: any = { studentId };
      if (filters.startDate) query.date = { $gte: new Date(filters.startDate) };
      if (filters.endDate) query.date = { ...query.date, $lte: new Date(filters.endDate) };
      if (filters.status) query.status = filters.status;
      const payments = await PaymentModel.find(query).lean();
      if (!payments.length) return [];
      return payments.map(payment => ({
        id: payment._id.toString(),
        date: payment.date.toISOString(),
        description: payment.description,
        method: payment.method,
        amount: payment.amount,
        status: payment.status,
        receiptUrl: payment.receiptUrl,
      }));
    } catch (err) {
      console.error('GetPaymentHistory Error:', err);
      throw new Error(`Failed to fetch payment history: ${err.message}`);
    }
  }
}