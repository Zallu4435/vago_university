import mongoose from 'mongoose';
import { ICommunicationRepository } from '../../../application/communication/repositories/ICommunicationRepository';
import { Message, UserInfo, MessageStatus, UserRole } from "../../../domain/communication/entities/Communication";
import { MessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';
import { User as UserModel } from '../../../infrastructure/database/mongoose/models/user.model';
import { Admin as AdminModel } from '../../../infrastructure/database/mongoose/models/admin.model';
import { Faculty as FacultyModel } from '../../../infrastructure/database/mongoose/models/faculty.model';
import {
  GetInboxMessagesRequestDTO,
  GetSentMessagesRequestDTO,
  SendMessageRequestDTO,
  MarkMessageAsReadRequestDTO,
  DeleteMessageRequestDTO,
  GetMessageDetailsRequestDTO,
  GetAllAdminsRequestDTO,
  GetUserGroupsRequestDTO,
  FetchUsersRequestDTO,
} from "../../../domain/communication/dtos/CommunicationRequestDTOs";
import {
  GetInboxMessagesResponseDTO,
  GetSentMessagesResponseDTO,
  SendMessageResponseDTO,
  MarkMessageAsReadResponseDTO,
  DeleteMessageResponseDTO,
  GetMessageDetailsResponseDTO,
  GetAllAdminsResponseDTO,
  GetUserGroupsResponseDTO,
  FetchUsersResponseDTO,
  MessageSummaryDTO,
} from "../../../domain/communication/dtos/CommunicationResponseDTOs";

export class CommunicationRepository implements ICommunicationRepository {
  async getInboxMessages(params: GetInboxMessagesRequestDTO): Promise<GetInboxMessagesResponseDTO> {
    const { userId, page, limit, search, status } = params;
    const query: any = {
      "recipients._id": userId
    };

    if (status && status !== "all") {
      query["recipients.status"] = status;
    }

      if (search) {
        query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
        ];
      }

      const skip = (page - 1) * limit;
    const messages = await MessageModel.find(query)
      .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalItems = await MessageModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const mappedMessages: MessageSummaryDTO[] = messages.map((message: any) => ({
      _id: message._id.toString(),
      subject: message.subject,
      content: message.content,
      sender: {
        _id: message.sender._id.toString(),
        name: message.sender.name,
        email: message.sender.email,
        role: message.sender.role
      },
      recipients: message.recipients.map((r: any) => ({
        _id: r._id.toString(),
        name: r.name,
        email: r.email,
        role: r.role
      })),
      status: message.recipients.find((r: any) => r._id === userId)?.status || MessageStatus.Unread,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      isBroadcast: message.isBroadcast,
      attachments: message.attachments,
      recipientsCount: message.recipients.length
    }));

      return {
      messages: mappedMessages,
      pagination: {
        total: totalItems,
        page,
        limit,
        totalPages
      }
    };
  }

  async getSentMessages(params: GetSentMessagesRequestDTO): Promise<GetSentMessagesResponseDTO> {
    const { userId, page, limit, search, status } = params;
    const query: any = {
      "sender._id": userId
    };

    if (status && status !== "all") {
      query["recipients.status"] = status;
    }

      if (search) {
        query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
        ];
      }

      const skip = (page - 1) * limit;
    const messages = await MessageModel.find(query)
      .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalItems = await MessageModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const mappedMessages: MessageSummaryDTO[] = messages.map((message: any) => ({
      _id: message._id.toString(),
      subject: message.subject,
      content: message.content,
      sender: {
        _id: message.sender._id.toString(),
        name: message.sender.name,
        email: message.sender.email,
        role: message.sender.role
      },
      recipients: message.recipients.map((r: any) => ({
        _id: r._id.toString(),
        name: r.name,
        email: r.email,
        role: r.role
      })),
      status: message.recipients.find((r: any) => r._id === userId)?.status || MessageStatus.Unread,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      isBroadcast: message.isBroadcast,
      attachments: message.attachments,
      recipientsCount: message.recipients.length
    }));

      return {
      messages: mappedMessages,
      pagination: {
        total: totalItems,
        page,
        limit,
        totalPages
      }
    };
  }

  async sendMessage(params: SendMessageRequestDTO): Promise<SendMessageResponseDTO> {
    console.log('Repository sendMessage - Starting with params:', params);
    const { senderId, senderRole, subject, content, to, attachments } = params;
    console.log('Repository sendMessage - Extracted params:', { senderId, senderRole, subject, content, to, attachments });

    const sender = await this.findUserById(senderId, senderRole);
    console.log('Repository sendMessage - Found sender:', sender);
    if (!sender) {
      console.error('Repository sendMessage - Sender not found');
      throw new Error("Sender not found");
    }

    console.log('Repository sendMessage - Processing recipients');
    // Parse the to parameter if it's a string
    const recipientsList = typeof to === 'string' ? JSON.parse(to) : to;
    console.log('Repository sendMessage - Parsed recipients:', recipientsList);
    
    let allRecipients = [];
    
    for (const recipient of recipientsList) {
      console.log('Processing recipient:', recipient);
      
      // First check if it's a group identifier
      if (recipient.value === 'all_students') {
        const students = await UserModel.find({ role: 'student' })
          .select('_id firstName lastName email role')
          .lean();
        allRecipients.push(...students.map(student => ({
          _id: student._id.toString(),
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          role: 'student' as UserRole,
          status: MessageStatus.Unread
        })));
      } else if (recipient.value === 'all_faculty') {
        const faculty = await FacultyModel.find()
          .select('_id firstName lastName email role')
          .lean();
        allRecipients.push(...faculty.map(faculty => ({
          _id: faculty._id.toString(),
          name: `${faculty.firstName} ${faculty.lastName}`,
          email: faculty.email,
          role: 'faculty' as UserRole,
          status: MessageStatus.Unread
        })));
      } else if (recipient.value === 'all_students_and_faculty') {
        const [students, faculty] = await Promise.all([
          UserModel.find({ role: 'student' }).select('_id firstName lastName email role').lean(),
          FacultyModel.find().select('_id firstName lastName email role').lean()
        ]);
        
        allRecipients.push(
          ...students.map(student => ({
            _id: student._id.toString(),
            name: `${student.firstName} ${student.lastName}`,
            email: student.email,
            role: 'student' as UserRole,
            status: MessageStatus.Unread
          })),
          ...faculty.map(faculty => ({
            _id: faculty._id.toString(),
            name: `${faculty.firstName} ${faculty.lastName}`,
            email: faculty.email,
            role: 'faculty' as UserRole,
            status: MessageStatus.Unread
          }))
        );
      } else if (mongoose.Types.ObjectId.isValid(recipient.value)) {
        // Handle individual recipient - must be a valid MongoDB ObjectId
        const userRole = senderRole === 'admin' ? 'user' : 'admin';
        const user = await this.findUserById(recipient.value, userRole);
        if (!user) {
          console.error('Recipient not found:', recipient.value);
          throw new Error(`Recipient not found: ${recipient.value}`);
        }
        allRecipients.push({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: MessageStatus.Unread
        });
      } else {
        console.error('Invalid recipient value:', recipient.value);
        throw new Error(`Invalid recipient value: ${recipient.value}`);
      }
    }

    // Create message using MessageModel directly
    const message = await MessageModel.create({
      subject,
      content,
      sender,
      recipients: allRecipients,
      isBroadcast: recipientsList.length === 1 && ['all_students', 'all_faculty', 'all_students_and_faculty'].includes(recipientsList[0].value),
      attachments: attachments || []
    });
    return message;
  }

  async markMessageAsRead(params: MarkMessageAsReadRequestDTO): Promise<MarkMessageAsReadResponseDTO> {
    const { messageId, userId } = params;
    const message = await this.findMessageById(messageId);
    if (!message || !message.isRecipient(userId)) {
      throw new Error("Message not found or user is not a recipient");
    }

    await this.updateMessageRecipientStatus(messageId, userId, MessageStatus.Read);
    return { success: true, message: "Message marked as read" };
  }

  async deleteMessage(params: DeleteMessageRequestDTO): Promise<DeleteMessageResponseDTO> {
    const { messageId, userId } = params;
    const message = await this.findMessageById(messageId);
    if (!message || !message.canAccess(userId)) {
      throw new Error("Message not found or user does not have access");
    }

    await MessageModel.findByIdAndDelete(messageId);
    return { success: true, message: "Message deleted successfully" };
  }

  async getMessageDetails(params: GetMessageDetailsRequestDTO): Promise<GetMessageDetailsResponseDTO> {
    const { messageId, userId } = params;
    const message = await this.findMessageById(messageId);
    if (!message || !message.canAccess(userId)) {
      throw new Error("Message not found or user does not have access");
    }

    return message;
  }

  async getAllAdmins(params: GetAllAdminsRequestDTO): Promise<GetAllAdminsResponseDTO> {
    console.log('Repository getAllAdmins - Starting with params:', params);
    const { search } = params;
    const query: any = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    console.log('Repository getAllAdmins - Query:', query);
    const admins = await AdminModel.find(query)
      .select("_id firstName lastName email")
      .lean();
    console.log('Repository getAllAdmins - Found admins:', admins.length);

    const mappedAdmins = admins.map((admin: any) => ({
      _id: admin._id.toString(),
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      role: 'admin'
    }));
    console.log('Repository getAllAdmins - Mapped admins:', mappedAdmins);

    return {
      admins: mappedAdmins
    };
  }

  async getUserGroups(params: GetUserGroupsRequestDTO): Promise<GetUserGroupsResponseDTO> {
    const { search } = params;
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

    return { groups: filteredGroups };
  }

  async fetchUsers(params: FetchUsersRequestDTO): Promise<FetchUsersResponseDTO> {
    const { type, search, requesterId } = params;
    const query: any = {};

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

    return {
      users: users.map((user: any) => ({
        _id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      }))
    };
  }

  async findUserById(userId: string, role: string): Promise<UserInfo | null> {
    console.log('Finding user by ID:', userId, 'with role:', role);
    
    let user;
    if (role === 'admin') {
      user = await AdminModel.findById(userId).lean();
      console.log('Found admin user:', user);
    } else {
      user = await UserModel.findOne({ _id: userId, role }).lean();
      console.log('Found regular user:', user);
    }

    if (!user) {
      console.log('No user found');
      return null;
    }

    const userInfo = {
      _id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: role
    };
    console.log('Returning user info:', userInfo);
    return userInfo;
  }

  async findUsersByGroup(group: string): Promise<UserInfo[]> {
    let query: any = {};
    if (group === "all-students") {
      query.role = UserRole.Student;
    } else if (group === "all-faculty") {
      query.role = UserRole.Faculty;
    } else if (group === "all-staff") {
      query.role = UserRole.Staff;
    } else if (group.startsWith("all-")) {
      query.role = group.replace("all-", "");
    } else if (["freshman", "sophomore", "junior", "senior"].includes(group)) {
      query.role = UserRole.Student;
      query.year = group;
    }

    const users = await UserModel.find(query)
      .select("_id firstName lastName email role")
      .lean();

    return users.map((user: any) => ({
      _id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role
    }));
  }

  async findMessageById(messageId: string): Promise<Message | null> {
    const message = await MessageModel.findById(messageId).lean();
    if (!message) return null;

    return new Message({
      id: message._id.toString(),
      subject: message.subject,
      content: message.content,
      sender: message.sender,
      recipients: message.recipients,
      createdAt: message.createdAt,
      isBroadcast: message.isBroadcast,
      attachments: message.attachments
    });
  }

  async createMessage(message: Message): Promise<void> {
    await MessageModel.create(message);
  }

  async updateMessageRecipientStatus(messageId: string, userId: string, status: string): Promise<void> {
    await MessageModel.updateOne(
      { _id: messageId, "recipients._id": userId },
      { $set: { "recipients.$.status": status } }
    );
  }

  async findAdmins(search?: string): Promise<UserInfo[]> {
    const query: any = { role: 'admin' };
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

    return admins.map((admin: any) => ({
      _id: admin._id.toString(),
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      role: admin.role
    }));
  }

  async findUsersByType(type: string, search?: string, requesterId?: string): Promise<UserInfo[]> {
    const query: any = { role: type };
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

    return users.map((user: any) => ({
      _id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role
    }));
  }
}