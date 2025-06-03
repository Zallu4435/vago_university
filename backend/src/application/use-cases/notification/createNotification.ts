import * as admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';
import { NotificationModel } from '../../../infrastructure/database/mongoose/models/notification.model';
import { User as UserModel } from '../../../infrastructure/database/mongoose/models/user.model';
import { Faculty as FacultyModel } from '../../../infrastructure/database/mongoose/models/faculty.model';
import '../../../config/firebase-admin'; // Initialize Firebase Admin SDK

interface Notification {
  _id: string;
  title: string;
  message: string;
  recipientType: 'individual' | 'all_students' | 'all_faculty' | 'all' | 'all_students_and_faculty';
  recipientId?: string;
  recipientName?: string;
  createdBy: string;
  createdAt: string;
  status: 'sent' | 'failed';
}

interface CreateNotificationInput {
  title: string;
  message: string;
  recipientType: 'individual' | 'all_students' | 'all_faculty' | 'all' | 'all_students_and_faculty';
  recipientId?: string;
  recipientName?: string;
  createdBy: string;
}

class CreateNotification {
  async execute(input: CreateNotificationInput): Promise<Notification> {
    console.log('Creating notification:', input);

    const { title, message, recipientType, recipientId, recipientName, createdBy } = input;

    try {
      // Prepare the base notification message
      const fcmMessage = {
        notification: {
          title,
          body: message,
        },
      };

      let tokens: string[] = [];

      if (recipientType === 'individual' && recipientId) {
        // Send to a single device
        await getMessaging().send({ ...fcmMessage, token: recipientId });
      } else if (recipientType === 'all_students_and_faculty') {
        // Get tokens from User and Faculty collections
        const students = await UserModel.find().select('fcmTokens');
        const faculty = await FacultyModel.find().select('fcmTokens');

        const studentTokens = students.flatMap((user) => user.fcmTokens || []);
        const facultyTokens = faculty.flatMap((faculty) => faculty.fcmTokens || []);
        tokens = [...new Set([...studentTokens, ...facultyTokens])]; // Remove duplicates
      } else if (recipientType === 'all_students') {
        // Get tokens from User collection
        const students = await UserModel.find().select('fcmTokens');
        tokens = students.flatMap((user) => user.fcmTokens || []);
      } else if (recipientType === 'all_faculty') {
        // Get tokens from Faculty collection
        const faculty = await FacultyModel.find().select('fcmTokens');
        tokens = faculty.flatMap((faculty) => faculty.fcmTokens || []);
      } else if (recipientType === 'all') {
        // Get tokens from both collections
        const students = await UserModel.find().select('fcmTokens');
        const faculty = await FacultyModel.find().select('fcmTokens');
        tokens = [...new Set([...students.flatMap((user) => user.fcmTokens || []), ...faculty.flatMap((faculty) => faculty.fcmTokens || [])])];
      } else {
        throw new Error(`Invalid recipientType: ${recipientType}`);
      }

      // Send notifications to tokens in batches
      if (recipientType !== 'individual') {
        if (tokens.length === 0) {
          throw new Error(`No FCM tokens found for ${recipientType}`);
        }

        const batchSize = 500; // FCM multicast limit
        const batches = [];
        for (let i = 0; i < tokens.length; i += batchSize) {
          batches.push(tokens.slice(i, i + batchSize));
        }

        const results = await Promise.all(
          batches.map((batch) =>
            getMessaging().sendEachForMulticast({
              notification: { title, body: message },
              tokens: batch,
            })
          )
        );

        console.log(`Sent notifications to ${tokens.length} devices for ${recipientType}`, results);
      }

      // Save notification record
      const notification = new NotificationModel({
        title,
        message,
        recipientType,
        recipientId,
        recipientName,
        createdBy,
        createdAt: new Date().toISOString(),
        status: 'sent',
      });

      await notification.save();
      console.log('Notification created:', notification);
      return notification.toObject() as Notification;
    } catch (error: any) {
      console.error('CreateNotification:', error);

      // Log specific error context
      if (recipientType === 'individual' && recipientId) {
        console.error('Error sending to individual:', recipientId);
      } else {
        console.error(`Error sending to ${recipientType}`);
      }

      // Save failed notification
      const notification = new NotificationModel({
        title,
        message,
        recipientType,
        recipientId,
        recipientName,
        createdBy,
        createdAt: new Date().toISOString(),
        status: 'failed',
      });
      await notification.save();
      throw new Error(error.message || 'Failed to create notification');
    }
  }
}

export const createNotification = new CreateNotification();