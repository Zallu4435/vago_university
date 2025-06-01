import { PaymentModel } from '../../../infrastructure/database/mongoose/models/financial.model';

export class GetAllPayments {
  async execute(filters: { startDate?: string; endDate?: string; status?: string; page: number; limit: number }): Promise<{ data: any[]; total: number }> {
    try {
      const query: any = {};
      if (filters.startDate) query.date = { $gte: new Date(filters.startDate) };
      if (filters.endDate) query.date = { ...query.date, $lte: new Date(filters.endDate) };
      if (filters.status) query.status = filters.status;

      const total = await PaymentModel.countDocuments(query);
      const payments = await PaymentModel.find(query)
        .skip((filters.page - 1) * filters.limit)
        .limit(filters.limit)
        .lean();

      return {
        data: payments.map(payment => ({
          id: payment._id.toString(),
          studentId: payment.studentId,
          date: payment.date.toISOString(),
          title: payment.description,
          method: payment.method,
          amount: payment.amount,
          status: payment.status,
          receiptUrl: payment.receiptUrl,
        })),
        total,
      };
    } catch (err) {
      console.error('GetAllPayments Error:', err);
      throw new Error(`Failed to fetch payments: ${err.message}`);
    }
  }
}

export const getAllPayments = new GetAllPayments()