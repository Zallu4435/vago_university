import mongoose from "mongoose";
import { MessageModel } from "../../../infrastructure/database/mongoose/models/communication.model";
import { User as UserModel } from "../../../infrastructure/database/mongoose/models/user.model";
import { Admin as AdminModel } from "../../../infrastructure/database/mongoose/models/admin.model";
import { Faculty as FacultyModel } from '../../../infrastructure/database/mongoose/models/faculty.model'

interface SendMessageInput {
  senderId: string | undefined;
  senderRole: string | undefined;
  to: Array<{ value: string; label: string }>;
  subject: string;
  message: string;
  attachments?: any[];
}

interface Message {
  _id: string;
  subject: string;
  message: string;
  sender: { _id: string; name: string; email: string; role: string };
  recipients: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  }>;
  isBroadcast: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SendMessageOutput extends Message {}

class SendMessage {
  async execute({
    senderId,
    senderRole,
    to,
    subject,
    message,
    attachments,
  }: SendMessageInput): Promise<SendMessageOutput> {
    try {
      console.log(
        `Executing sendMessage from senderId: ${senderId} to recipients: ${JSON.stringify(
          to
        )}`
      );

      if (!senderId || !mongoose.isValidObjectId(senderId)) {
        throw new Error("Invalid sender ID");
      }

      let sender;

      if (senderRole === "admin") {
        sender = await AdminModel.findById(senderId)
          .select("firstName lastName email role")
          .lean();
      } else {
        sender = await UserModel.findById(senderId)
          .select("firstName lastName email role")
          .lean();
      }
      // Validate sender
      if (!sender) {
        throw new Error("Sender not found");
      }

      let recipients: Array<{
        _id: string;
        name: string;
        email: string;
        role: string;
        status: string;
      }> = [];
      let isBroadcast = false;

      if (senderRole === "admin") {
        // Admin: Handle group or individual recipients
        if (
          to.some(
            (recipient) =>
              recipient.value.startsWith("all-") ||
              recipient.value.includes("students")
          )
        ) {
          // Group recipients (admin-only)
          const group = to[0].value; // Assume single group selection
          console.log(`Processing group: ${group}`);

          if (group === "all-students") {
            const users = await UserModel.find({})
              .select("firstName lastName email role")
              .lean();
            if (!users.length) {
              throw new Error("No students found");
            }
            recipients = users.map((user) => ({
              _id: user._id.toString(),
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: user.role || "student",
              status: "unread",
            }));
            isBroadcast = true;
          } else if (group === "all-faculty") {
            const faculty = await FacultyModel.find({})
              .select("firstName lastName email role")
              .lean();
            if (!faculty.length) {
              throw new Error("No faculty found");
            }
            recipients = faculty.map((member) => ({
              _id: member._id.toString(),
              name: `${member.firstName} ${member.lastName}`,
              email: member.email,
              role: member.role || "faculty",
              status: "unread",
            }));
            isBroadcast = true;
          } else {
            throw new Error(`Invalid group: ${group}`);
          }
        } else {
          // Individual recipients (admin to users)
          for (const recipient of to) {
            if (!mongoose.isValidObjectId(recipient.value)) {
              throw new Error(`Invalid recipient ID: ${recipient.value}`);
            }
            const user = await UserModel.findById(recipient.value)
              .select("firstName lastName email role")
              .lean();
            if (!user) {
              throw new Error(`Recipient not found: ${recipient.value}`);
            }
            recipients.push({
              _id: recipient.value,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: user.role || "student",
              status: "unread",
            });
          }
        }
      } else {
        // User: Single admin recipient
        if (to.length !== 1) {
          throw new Error("Users can only send messages to a single admin");
        }
        const adminId = to[0].value;
        if (!mongoose.isValidObjectId(adminId)) {
          throw new Error(`Invalid admin ID: ${adminId}`);
        }
        const admin = await AdminModel.findById(adminId)
          .select("firstName lastName email role")
          .lean();
        if (!admin) {
          throw new Error(`Admin not found: ${adminId}`);
        }
        recipients.push({
          _id: adminId,
          name: `${admin.firstName} ${admin.lastName}`,
          email: admin.email,
          role: admin.role || "admin",
          status: "unread",
        });
        isBroadcast = false;
      }

      const newmessage = new MessageModel({
        subject,
        message,
        sender: {
          _id: senderId,
          name: `${sender.firstName} ${sender.lastName}`,
          email: sender.email,
          role: sender.role || "student",
        },
        recipients,
        isBroadcast,
        attachments: attachments || [],
      });

      await newmessage.save().catch((err) => {
        throw new Error(`Failed to save message: ${err.newmessage}`);
      });

      return newmessage.toObject();
    } catch (err) {
      console.error(`Error in sendMessage:`, err);
      throw err;
    }
  }
}

export const sendMessage = new SendMessage();
