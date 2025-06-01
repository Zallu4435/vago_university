import mongoose from 'mongoose';
import { PaymentModel } from '../../../infrastructure/database/mongoose/models/financial.model';

export class GetPaymentReceipt {
  async execute(studentId: string, paymentId: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(paymentId)) {
        throw new Error('Invalid student or payment ID');
      }
      const payment = await PaymentModel.findOne({ _id: paymentId, studentId }).lean();
      if (!payment) throw new Error('No payment found with the provided ID');
      if (!payment.receiptUrl) throw new Error('No receipt available for this payment');
      return { url: payment.receiptUrl };
    } catch (err) {
      console.error('GetPaymentReceipt Error:', err);
      throw new Error(`Failed to fetch receipt: ${err.message}`);
    }
  }
}