import { SentMessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';
import { v4 as uuidv4 } from 'uuid';

interface SendMessageParams {
  to: { value: string; label: string }[];
  subject: string;
  message: string;
  attachments: Express.Multer.File[];
  userId: string;
  collection: 'register' | 'admin' | 'user' | 'faculty';
}

class SendMessage {
  async execute({
    to,
    subject,
    message,
    attachments,
    userId,
    collection,
  }: SendMessageParams): Promise<any> {
    try {
      console.log(`Executing sendMessage use case with data:`, {
        to,
        subject,
        message,
        attachments: attachments?.length,
        userId,
        collection,
      });

      if (collection === 'register') {
        throw new Error('Users in register collection cannot send messages');
      }

      const now = new Date();
      const messageData = {
        id: uuidv4(),
        to: to.map((t) => t.label).join(', '),
        subject,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        status: 'delivered',
        content: message,
        recipients: to.length,
        senderId: userId,
        attachments: attachments?.map((file: any) => ({
          public_id: file.public_id,
          secure_url: file.secure_url,
          filename: file.originalname,
          format: file.format,
          bytes: file.bytes,
        })),
      };

      const sentMessage = await SentMessageModel.create(messageData).catch((err) => {
        throw new Error(`Failed to send message: ${err.message}`);
      });

      return sentMessage.toObject();
    } catch (err) {
      console.error(`Error in sendMessage use case:`, err);
      throw err;
    }
  }
}

export const sendMessage = new SendMessage();