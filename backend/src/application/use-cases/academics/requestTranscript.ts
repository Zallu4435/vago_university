import { TranscriptRequestModel } from '../../../infrastructure/database/mongoose/models/transcript.model';
import mongoose from 'mongoose';

interface RequestTranscriptInput {
  userId: string;
  deliveryMethod: string;
  address?: string;
  email?: string;
}

interface RequestTranscriptOutput {
  success: boolean;
  message: string;
  requestId: string;
  estimatedDelivery: string;
}

class RequestTranscript {
  async execute({ userId, deliveryMethod, address, email }: RequestTranscriptInput): Promise<RequestTranscriptOutput> {
    try {
      console.log(`Executing requestTranscript use case for userId: ${userId}`);

      const requestId = new mongoose.Types.ObjectId().toString();
      const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days from now

      const transcriptRequest = new TranscriptRequestModel({
        userId,
        deliveryMethod,
        address,
        email,
        requestId,
        estimatedDelivery,
      });

      await transcriptRequest.save().catch((err) => {
        throw new Error(`Failed to request transcript: ${err.message}`);
      });

      return {
        success: true,
        message: 'Transcript request submitted successfully',
        requestId,
        estimatedDelivery,
      };
    } catch (err) {
      console.error(`Error in requestTranscript use case:`, err);
      throw err;
    }
  }
}

export const requestTranscript = new RequestTranscript();