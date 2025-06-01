import mongoose from 'mongoose';
import { PaymentModel } from '../../../infrastructure/database/mongoose/models/financial.model';

export class GetOnePayment {
  async execute(paymentId: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(paymentId)) {
        throw new Error('Invalid payment ID');
      }

      const payment = await PaymentModel.findById(paymentId).lean();

      if (!payment) {
        throw new Error('Payment not found');
      }

      return {
        payment
      };
    } catch (err) {
      console.error('GetOnePayment Error:', err);
      throw new Error(`Failed to fetch payment: ${(err as Error).message}`);
    }
  }
}

export const getOnePayment = new GetOnePayment();