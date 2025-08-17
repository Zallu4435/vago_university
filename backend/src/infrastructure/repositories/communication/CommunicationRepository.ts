import { ICommunicationRepository } from '../../../application/communication/repositories/ICommunicationRepository';
import { Message, UserInfo, MessageStatus, UserRole } from "../../../domain/communication/entities/Communication";
import { MessageModel, IMessage } from '../../../infrastructure/database/mongoose/models/communication.model';
import { User as UserModel } from '../../database/mongoose/auth/user.model';
import { Admin as AdminModel } from '../../database/mongoose/auth/admin.model';
import { Faculty as FacultyModel } from '../../database/mongoose/auth/faculty.model';
import mongoose from 'mongoose';

interface CommunicationFilter {
  "recipients._id"?: string;
  "recipients.status"?: MessageStatus;
  "sender._id"?: string;
  $and?: Array<{
    "recipients._id"?: string;
    "recipients.status"?: MessageStatus;
    $or?: Array<{
      subject?: { $regex: string; $options: string };
      content?: { $regex: string; $options: string };
    }>;
  }>;
  $or?: Array<{
    subject?: { $regex: string; $options: string };
    content?: { $regex: string; $options: string };
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
  role?: UserRole;
  year?: string;
  [key: string]: unknown;
}

interface GetAdminQuery {
  firstName?: { $regex: string; $options: string };
  lastName?: { $regex: string; $options: string };
  email?: { $regex: string; $options: string };
  $or?: Array<{
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
}

interface GetUserQuery {
  firstName?: { $regex: string; $options: string };
  lastName?: { $regex: string; $options: string };
  email?: { $regex: string; $options: string };
  $or?: Array<{
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
  role?: UserRole;
  [key: string]: unknown;
}

export class CommunicationRepository implements ICommunicationRepository {
  private messageModel: mongoose.Model<IMessage>;

  constructor() {
    this.messageModel = MessageModel as mongoose.Model<IMessage>;
  }

  async getInboxMessages(userId: string, page: number, limit: number, search?: string, status?: string) {
    const query: CommunicationFilter = {
      "recipients._id": userId
    };
    if (status && (status as string) !== "all") {
      query.$and = [
        { "recipients._id": userId },
        { "recipients.status": status as MessageStatus }
      ];
    }
    if (search) {
      const searchQuery = {
        $or: [
          { subject: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } }
        ]
      };
      if (query.$and) {
        query.$and.push(searchQuery);
      } else {
        query.$or = searchQuery.$or;
      }
    }
    const skip = (page - 1) * limit;
    const messages = await this.messageModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const totalItems = await this.messageModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    return { messages, totalItems, totalPages, page, limit, userId, status, search };
  }

  async getSentMessages(userId: string, page: number, limit: number, search?: string, status?: string) {
    const query: CommunicationFilter = {
      "sender._id": userId
    };
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }
    const skip = (page - 1) * limit;
    const messages = await this.messageModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const totalItems = await this.messageModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    return { messages, totalItems, totalPages, page, limit, userId, search };
  }

  async sendMessage(senderId: string, senderRole: string, to: Array<{ value: string; label: string }>, subject: string, content: string, attachments?: Array<{
    filename: string;
    path: string;
    contentType: string;
    size: number;
  }>) {
    const sender = await this.findUserById(senderId, senderRole);
    if (!sender) {
      throw new Error('Sender not found');
    }

    let recipients: UserInfo[] = [];
    for (const recipient of to) {
      if (recipient.value.startsWith('all_') || recipient.value.startsWith('all-')) {
        // Group recipient
        const groupUsers = await this.findUsersByGroup(recipient.value.replace('_', '-'));
        recipients = recipients.concat(groupUsers);
      } else {
        const user = await this.findUserById(recipient.value, 'student'); // Default to student, adjust as needed
        if (user) recipients.push(user);
      }
    }
    recipients = recipients.filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i);

    const messageData = {
      subject,
      content,
      sender,
      recipients,
      isBroadcast: to.some(r => r.value.startsWith('all_') || r.value.startsWith('all-')),
      attachments: attachments || []
    };
    const message = await this.messageModel.create(messageData);
    return message.toObject ? message.toObject() : message;
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    await this.updateMessageRecipientStatus(messageId, userId, MessageStatus.Read);
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    await this.messageModel.findByIdAndDelete(messageId);
  }

  async getMessageDetails(messageId: string) {
    return await this.messageModel.findById(messageId).lean();
  }

  async getAllAdmins(search?: string): Promise<UserInfo[]> {
    const query: GetAdminQuery = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    const admins = await AdminModel.find(query)
      .select("_id firstName lastName email")
      .lean();
    return admins.map((admin) => ({
      _id: admin._id.toString(),
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      role: 'admin' as UserRole
    }));
  }

  async getUserGroups(search?: string) {
    const groups = [
      { value: 'all-students', label: 'All Students' },
      { value: 'all-faculty', label: 'All Faculty' },
      { value: 'all-staff', label: 'All Staff' },
      { value: 'freshman', label: 'Freshman Students' },
      { value: 'sophomore', label: 'Sophomore Students' },
      { value: 'junior', label: 'Junior Students' },
      { value: 'senior', label: 'Senior Students' },
      { value: 'individual', label: 'Individual User' }
    ];
    const filteredGroups = search
      ? groups.filter(group =>
        group.label.toLowerCase().includes(search.toLowerCase()) ||
        group.value.toLowerCase().includes(search.toLowerCase())
      )
      : groups;
    return filteredGroups;
  }

  async fetchUsers(type: string, search?: string): Promise<UserInfo[]> {
    const query: GetUserQuery = {};
    if (type === "students") {
      query.role = UserRole.Student;
    } else if (type === "faculty") {
      query.role = UserRole.Faculty;
    } else if (type === "staff") {
      query.role = UserRole.Staff;
    }
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    const users = await UserModel.find(query)
      .select("_id firstName lastName email role")
      .lean();
    return users.map((user) => ({
      _id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: type === "students" ? UserRole.Student : type === "faculty" ? UserRole.Staff : UserRole.Staff,
    }));
  }

  async findUserById(userId: string, role: string): Promise<UserInfo | null> {
    const user = await UserModel.findOne({ _id: userId, role }).lean();
    if (!user) {
      return null;
    }
    const userInfo = {
      _id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: role as UserRole
    };
    return userInfo;
  }

  async findUsersByGroup(group: string): Promise<UserInfo[]> {
    let query: GetUserQuery = {};
    if (group === "all-students") {
      query.role = UserRole.Student;
    } else if (group === "all-faculty") {
      query.role = UserRole.Faculty;
    } else if (group === "all-staff") {
      query.role = UserRole.Staff;
    } else if (group.startsWith("all-")) {
      query.role = group.replace("all-", "") as UserRole;
    } else if (["freshman", "sophomore", "junior", "senior"].includes(group)) {
      query.role = UserRole.Student;
      query.year = group;
    }

    const users = await UserModel.find(query)
      .select("_id firstName lastName email role")
      .lean();

    return users.map((user) => ({
      _id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: query.role || UserRole.Student,
    }));
  }

  async findMessageById(messageId: string): Promise<Message | null> {
    const message = await this.messageModel.findById(messageId).lean();

    if (!message) {
      return null;
    }

    const sender: UserInfo = {
      _id: message.sender._id.toString(),
      name: message.sender.name,
      email: message.sender.email,
      role: message.sender.role as UserRole
    };

    const recipients: UserInfo[] = message.recipients.map(recipient => ({
      _id: recipient._id.toString(),
      name: recipient.name,
      email: recipient.email,
      role: recipient.role as UserRole,
      status: recipient.status as MessageStatus
    }));

    const messageEntity = new Message(
      message._id.toString(),
      message.subject,
      message.content,
      sender,
      recipients,
      message.isBroadcast,
      message.attachments || [],
      message.createdAt.toISOString(),
      message.updatedAt.toISOString()
    );
    return messageEntity;
  }

  async createMessage(message: Message): Promise<void> {
    await this.messageModel.create(message);
  }

  async updateMessageRecipientStatus(messageId: string, userId: string, status: string): Promise<void> {
    await this.messageModel.updateOne(
      { _id: messageId, "recipients._id": userId },
      { $set: { "recipients.$.status": status } }
    );
  }

  async findAdmins(search?: string): Promise<UserInfo[]> {
    const query: GetAdminQuery = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const admins = await AdminModel.find(query)
      .select("_id firstName lastName email role")
      .lean();

    return admins.map((admin) => ({
      _id: admin._id.toString(),
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      role: 'admin' as UserRole
    }));
  }

  async findUsersByType(type: string, search?: string, requesterId?: string): Promise<UserInfo[]> {
    if (type === 'students' || type === 'all_students') {
      const query: GetUserQuery = {};
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ];
      }

      const students = await UserModel.find(query)
        .select("_id firstName lastName email")
        .lean();

      const mappedStudents = students.map((user) => ({
        _id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: 'student' as UserRole
      }));

      return mappedStudents;
    }

    if (type === 'faculty' || type === 'all_faculty') {
      const query: GetUserQuery = {};
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ];
      }

      const faculty = await FacultyModel.find(query)
        .select("_id firstName lastName email")
        .lean();

      const mappedFaculty = faculty.map((user) => ({
        _id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: 'faculty' as UserRole
      }));

      return mappedFaculty;
    }

    if (type === 'all') {
      const [students, faculty] = await Promise.all([
        UserModel.find().select('_id firstName lastName email').lean(),
        FacultyModel.find().select('_id firstName lastName email').lean()
      ]);

      const allUsers = [
        ...students.map((user) => ({
          _id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: 'student' as UserRole
        })),
        ...faculty.map((user) => ({
          _id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: 'faculty' as UserRole
        }))
      ];

      if (search) {
        const searchLower = search.toLowerCase();
        const filteredUsers = allUsers.filter(user =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
        return filteredUsers;
      }
      return allUsers;
    }
    return [];
  }

}