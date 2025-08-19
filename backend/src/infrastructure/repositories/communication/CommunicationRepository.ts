import { ICommunicationRepository } from '../../../application/communication/repositories/ICommunicationRepository';
import { Message, UserInfo, MessageStatus, UserRole, CommunicationFilter, GetAdminQuery, GetUserQuery } from "../../../domain/communication/entities/Communication";
import { MessageModel, IMessage } from '../../../infrastructure/database/mongoose/models/communication.model';
import { User as UserModel } from '../../database/mongoose/auth/user.model';
import { Admin as AdminModel } from '../../database/mongoose/auth/admin.model';
import { Faculty as FacultyModel } from '../../database/mongoose/auth/faculty.model';
import mongoose from 'mongoose';


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

    const totalStudents = await UserModel.countDocuments({});

    const messagesWithRecipientType = messages.map((msg: any) => {
      let recipientType = '';
      if (msg.recipients && msg.recipients.length === totalStudents) {
        recipientType = 'All Students';
      } else if (msg.recipients && msg.recipients.length === 1) {
        recipientType = msg.recipients[0].email;
      } else if (msg.recipients && msg.recipients.length > 1) {
        recipientType = 'Multiple Students';
      } else {
        recipientType = 'No Recipients';
      }
      const result = { ...msg, recipientType };
      
      return result;
    });
    
    return { messages: messagesWithRecipientType, totalItems, totalPages, page, limit, userId, search };
  }

    async sendUserMessage(senderId: string, senderRole: string, to: Array<{ value: string; label: string }>, subject: string, content: string, attachments?: Array<{
    filename: string;
    path: string;
    contentType: string;
    size: number;
  }>) {
    try {
      const sender = await this.findUserById(senderId, senderRole);
      
      if (!sender) {
        throw new Error('Sender not found');
      }
      
      let recipients: UserInfo[] = [];
      
      if (!Array.isArray(to)) {
        throw new Error('Invalid recipients format');
      }
      
      for (const recipient of to) {
        const admin = await this.findUserById(recipient.value, 'admin');
        if (admin) {
          recipients.push(admin);
        }
      }
      
      recipients = recipients.filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i);
      
      const messageData = {
        subject,
        content,
        sender,
        recipients,
        isBroadcast: false, 
        attachments: attachments || []
      };
      
      const message = await this.messageModel.create(messageData);
      
      const result = message.toObject ? message.toObject() : message;
      return result;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(senderId: string, senderRole: string, to: Array<{ value: string; label: string }>, subject: string, content: string, attachments?: Array<{
    filename: string;
    path: string;
    contentType: string;
    size: number;
  }>) {
    try {
      const sender = await this.findUserById(senderId, senderRole);
      
      if (!sender) {
        throw new Error('Sender not found');
      }
      let recipients: UserInfo[] = [];
      
      if (!Array.isArray(to)) {
        throw new Error('Invalid recipients format');
      }
      
      for (const recipient of to) {
        if (recipient.value === 'all_students' || recipient.value === 'all-students') {
          const users = await UserModel.find({}).select('_id firstName lastName email').lean();
          recipients = users.map((user: any) => ({
            _id: user._id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: 'student' as UserRole
          }));
          break;
        } else {
          const user = await this.findUserById(recipient.value, 'student');
          if (user) {
            recipients.push(user);
          }
        }
      }
      recipients = recipients.filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i);
      
      const messageData = {
        subject,
        content,
        sender,
        recipients,
        isBroadcast: to.some(r => r.value === 'all_students' || r.value === 'all-students'),
        attachments: attachments || []
      };
      
      const message = await this.messageModel.create(messageData);
      
      const result = message.toObject ? message.toObject() : message;
      return result;
    } catch (error) {
      throw error;
    }
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
    try {
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
      
      const mappedAdmins = admins.map((admin) => {
        const firstName = admin.firstName || '';
        const lastName = admin.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        return {
          _id: admin._id.toString(),
          name: fullName || 'Unknown Admin',
          email: admin.email,
          role: 'admin' as UserRole
        };
      });
      
      return mappedAdmins;
    } catch (error) {
      throw error;
    }
  }

  async fetchUsers(type: string, search?: string): Promise<UserInfo[]> {
    const query: GetUserQuery = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    const users = await UserModel.find(query)
      .select("_id firstName lastName email")
      .lean();
      
    return users.map((user) => {
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      
      return {
        _id: user._id.toString(),
        name: fullName || 'Unknown User',
        email: user.email,
        role: UserRole.Student, 
      };
    });
  }

  async findUserById(userId: string, role: string): Promise<UserInfo | null> {
    try {
      let user = null;
      if (role === 'admin') {
        user = await AdminModel.findOne({ _id: userId }).lean();
        if (!user) {
          return null;
        }
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        const userInfo = {
          _id: user._id.toString(),
          name: fullName || 'Unknown Admin',
          email: user.email,
          role: 'admin' as UserRole
        };
        return userInfo;
      } else {
        user = await UserModel.findOne({ _id: userId }).lean();
        if (!user) {
          return null;
        }
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        const userInfo = {
          _id: user._id.toString(),
          name: fullName || 'Unknown User',
          email: user.email,
          role: 'student' as UserRole
        };
        return userInfo;
      }
    } catch (error) {
      console.error('[findUserById] Error:', error);
      return null;
    }
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
      const query: any = {};
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ];
      }
      const students = await UserModel.find(query)
        .select("_id firstName lastName email role")
        .lean();
      return students.map((user) => ({
        _id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: 'student' as UserRole
      }));
    }

    if (type === 'faculty' || type === 'all_faculty') {
      const query: any = {};
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
      return faculty.map((user) => ({
        _id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: 'faculty' as UserRole
      }));
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