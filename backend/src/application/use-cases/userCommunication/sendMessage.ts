import mongoose from 'mongoose';
import { MessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';
import { User as UserModel } from '../../../infrastructure/database/mongoose/models/user.model';
import { Admin as AdminModel } from '../../../infrastructure/database/mongoose/models/admin.model';
import { Faculty as FacultyModel } from '../../../infrastructure/database/mongoose/models/faculty.model';

interface SendMessageInput {
  senderId: string | undefined;
  senderRole: string | undefined;
  to: Array<{ value: string; label: string }>;
  subject: string;
  content: string;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType: string;
    size: number;
    public_id: string;
  }>;
}

interface Message {
  _id: string;
  subject: string;
  content: string;
  sender: { _id: string; name: string; email: string; role: string };
  recipients: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  }>;
  isBroadcast: boolean;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType: string;
    size: number;
    public_id: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface SendMessageOutput extends Message {}

class SendMessage {
  // Helper to fetch sender details
  private async getSender(senderId: string, senderRole: string) {
    let sender;
    if (senderRole === 'admin') {
      sender = await AdminModel.findById(senderId)
        .select('firstName lastName email role')
        .lean();
    } else {
      sender = await UserModel.findById(senderId)
        .select('firstName lastName email role')
        .lean();
    }
    if (!sender) {
      throw new Error('Sender not found');
    }
    return {
      _id: senderId,
      name: `${sender.firstName} ${sender.lastName}`.trim(),
      email: sender.email,
      role: sender.role || (senderRole === 'admin' ? 'admin' : 'student'),
    };
  }

  // Handle admin sending messages (to groups or individuals)
  private async handleAdminSend(
    senderId: string,
    to: Array<{ value: string; label: string }>,
    subject: string,
    content: string,
    attachments?: SendMessageInput['attachments']
  ) {
    let recipients: SendMessageInput['recipients'] = [];
    let isBroadcast = false;

    if (to.length === 1 && to[0].value.startsWith('all-') || to[0].value.includes('students') || to[0].value.includes('staff')) {
      const group = to[0].value;
      console.log(`Processing group: ${group}`);

      let users: any[] = [];
      if (group === 'all-students') {
        users = await UserModel.find({ role: 'student' })
          .select('firstName lastName email role')
          .lean();
      } else if (group === 'all-faculty') {
        users = await FacultyModel.find({})
          .select('firstName lastName email role')
          .lean();
      } else if (group === 'all-staff') {
        users = await UserModel.find({ role: 'staff' })
          .select('firstName lastName email role')
          .lean();
      } else if (['freshman', 'sophomore', 'junior', 'senior'].includes(group)) {
        users = await UserModel.find({ role: 'student', year: group })
          .select('firstName lastName email role')
          .lean();
      } else {
        throw new Error(`Invalid group: ${group}`);
      }

      if (!users.length) {
        throw new Error(`No users found for group: ${group}`);
      }
      recipients = users.map((user) => ({
        _id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role || (group === 'all-faculty' ? 'faculty' : group === 'all-staff' ? 'staff' : 'student'),
        status: 'unread',
      }));
      isBroadcast = true;
    } else {
      // Individual recipients
      for (const recipient of to) {
        if (!mongoose.isValidObjectId(recipient.value)) {
          throw new Error(`Invalid recipient ID: ${recipient.value}`);
        }
        let user = await UserModel.findById(recipient.value)
          .select('firstName lastName email role')
          .lean();
        if (!user) {
          user = await FacultyModel.findById(recipient.value)
            .select('firstName lastName email role')
            .lean();
        }
        if (!user) {
          throw new Error(`Recipient not found: ${recipient.value}`);
        }
        recipients.push({
          _id: recipient.value,
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          role: user.role || 'student',
          status: 'unread',
        });
      }
    }

    return { recipients, isBroadcast };
  }

  // Handle user sending messages (to single admin)
  private async handleUserSend(
    senderId: string,
    to: Array<{ value: string; label: string }>,
    subject: string,
    content: string,
    attachments?: SendMessageInput['attachments']
  ) {
    if (to.length !== 1) {
      throw new Error('Users can only send messages to a single admin');
    }
    const adminId = to[0].value;
    if (!mongoose.isValidObjectId(adminId)) {
      throw new Error(`Invalid admin ID: ${adminId}`);
    }
    const admin = await AdminModel.findById(adminId)
      .select('firstName lastName email role')
      .lean();
    if (!admin) {
      throw new Error(`Admin not found: ${adminId}`);
    }
    const recipients = [{
      _id: adminId,
      name: `${admin.firstName} ${admin.lastName}`.trim(),
      email: admin.email,
      role: admin.role || 'admin',
      status: 'unread',
    }];
    return { recipients, isBroadcast: false };
  }

  async execute({
    senderId,
    senderRole,
    to,
    subject,
    content,
    attachments,
  }: SendMessageInput): Promise<SendMessageOutput> {
    try {
      console.log(
        `Executing sendMessage from senderId: ${senderId} to recipients: ${JSON.stringify(to)}`
      );

      if (!senderId || !mongoose.isValidObjectId(senderId)) {
        throw new Error('Invalid sender ID');
      }

      if (!senderRole) {
        throw new Error('Sender role not specified');
      }

      if (!subject || !content) {
        throw new Error('Subject and content are required');
      }

      if (!to || !to.length) {
        throw new Error('At least one recipient is required');
      }

      // Fetch sender details
      const sender = await this.getSender(senderId, senderRole);

      // Handle recipients based on sender role
      let recipientsData: { recipients: SendMessageInput['recipients']; isBroadcast: boolean };
      if (senderRole === 'admin') {
        recipientsData = await this.handleAdminSend(senderId, to, subject, content, attachments);
      } else {
        recipientsData = await this.handleUserSend(senderId, to, subject, content, attachments);
      }

      // Create and save message
      const newMessage = new MessageModel({
        subject,
        content,
        sender,
        recipients: recipientsData.recipients,
        isBroadcast: recipientsData.isBroadcast,
        attachments: attachments || [],
      });

      await newMessage.save().catch((err) => {
        throw new Error(`Failed to save message: ${err.message}`);
      });

      return newMessage.toObject();
    } catch (err) {
      console.error(`Error in sendMessage:`, err);
      throw err;
    }
  }
}

export const sendMessage = new SendMessage();