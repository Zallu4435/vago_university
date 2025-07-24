import { ICommunicationRepository } from '../../../application/communication/repositories/ICommunicationRepository';
import { Message, UserInfo, MessageStatus, UserRole } from "../../../domain/communication/entities/Communication";
import { MessageModel } from '../../../infrastructure/database/mongoose/models/communication.model';
import { User as UserModel } from '../../database/mongoose/auth/user.model';
import { Admin as AdminModel } from '../../database/mongoose/auth/admin.model';
import { Faculty as FacultyModel } from '../../database/mongoose/auth/faculty.model';
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


export class CommunicationRepository implements ICommunicationRepository {
  async getInboxMessages(params: GetInboxMessagesRequestDTO): Promise<any> {
    const { userId, page, limit, search, status } = params;
    const query: any = {
      "recipients._id": userId
    };
    if (status && (status as any) !== "all") {
      query.$and = [
        { "recipients._id": userId },
        { "recipients.status": status }
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
    const messages = await (MessageModel as any).find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const totalItems = await (MessageModel as any).countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    return { messages, totalItems, totalPages, page, limit, userId, status, search };
  }

  async getSentMessages(params: GetSentMessagesRequestDTO): Promise<any> {
    const { userId, page, limit, search } = params;
    const query: any = {
      "sender._id": userId
    };
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }
    const skip = (page - 1) * limit;
    const messages = await (MessageModel as any).find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const totalItems = await (MessageModel as any).countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    return { messages, totalItems, totalPages, page, limit, userId, search };
  }

  async sendMessage(params: SendMessageRequestDTO): Promise<any> {
    console.log('[CommunicationRepository] sendMessage called with params:', params);
    // Construct sender UserInfo
    const sender = await this.findUserById(params.senderId, params.senderRole);
    if (!sender) {
      throw new Error('Sender not found');
    }

    // Determine recipients
    let recipients: UserInfo[] = [];
    for (const recipient of params.to) {
      if (recipient.value.startsWith('all_') || recipient.value.startsWith('all-')) {
        // Group recipient
        const groupUsers = await this.findUsersByGroup(recipient.value.replace('_', '-'));
        recipients = recipients.concat(groupUsers);
      } else {
        // Individual recipient (assume value is userId)
        const user = await this.findUserById(recipient.value, 'student'); // Default to student, adjust as needed
        if (user) recipients.push(user);
      }
    }
    // Remove duplicates
    recipients = recipients.filter((v,i,a)=>a.findIndex(t=>(t._id===v._id))===i);

    // Prepare message object for saving
    const messageData = {
      subject: params.subject,
      content: params.content,
      sender,
      recipients,
      isBroadcast: params.to.some(r => r.value.startsWith('all_') || r.value.startsWith('all-')),
      attachments: params.attachments || []
    };
    const message = await (MessageModel as any).create(messageData);
    console.log('[CommunicationRepository] message created:', message);
    return message.toObject ? message.toObject() : message;
  }

  async markMessageAsRead(params: MarkMessageAsReadRequestDTO): Promise<any> {
    const { messageId, userId } = params;
    await this.updateMessageRecipientStatus(messageId, userId, MessageStatus.Read);
    return { success: true, message: "Message marked as read" };
  }

  async deleteMessage(params: DeleteMessageRequestDTO): Promise<any> {
    const { messageId, userId } = params;
      await (MessageModel as any).findByIdAndDelete(messageId);
      return { success: true, message: "Message deleted successfully" };
    }
    
  async getMessageDetails(params: GetMessageDetailsRequestDTO): Promise<any> {
    const { messageId } = params;
    return await (MessageModel as any).findById(messageId).lean();
  }

  async getAllAdmins(params: GetAllAdminsRequestDTO): Promise<any> {
    const { search } = params;
    const query: any = {};
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
    return admins;
  }

  async getUserGroups(params: GetUserGroupsRequestDTO): Promise<any> {
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
    return filteredGroups;
  }

  async fetchUsers(params: FetchUsersRequestDTO): Promise<any> {
    const { type, search } = params;
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
    return users;
  }

  async findUserById(userId: string, role: string): Promise<UserInfo | null> {
    console.log('Finding user by ID:', userId, 'with role:', role);
    const user = await UserModel.findOne({ _id: userId, role }).lean();
    console.log('Found user:', user);
    if (!user) {
      console.log('No user found');
      return null;
    }
    const userInfo = {
      _id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: role as UserRole
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
    console.log('=== findMessageById DEBUG ===');
    console.log('Looking for messageId:', messageId);
    
    const message = await (MessageModel as any).findById(messageId).lean();
    console.log('Raw message from DB:', message);
    
    if (!message) {
      console.log('Message not found in DB');
      return null;
    }

    console.log('Message sender:', message.sender);
    console.log('Message recipients:', message.recipients);
    console.log('User trying to access:', messageId);

    const messageEntity = new Message(
      message._id.toString(),
      message.subject,
      message.content,
      message.sender,
      message.recipients,
      message.isBroadcast,
      message.attachments || [],
      message.createdAt.toISOString(),
      message.updatedAt.toISOString()
    );
    
    console.log('Created message entity');
    console.log('Sender ID:', messageEntity.sender._id);
    console.log('Recipient IDs:', messageEntity.recipients.map(r => r._id));
    
    return messageEntity;
  }

  async createMessage(message: Message): Promise<void> {
    await (MessageModel as any).create(message);
  }

  async updateMessageRecipientStatus(messageId: string, userId: string, status: string): Promise<void> {
    await (MessageModel as any).updateOne(
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
        .select("_id firstName lastName email")
        .lean();

      const mappedStudents = students.map((user: any) => ({
        _id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: 'student'
      }));
      
      console.log('Returning students count:', mappedStudents.length);
      return mappedStudents;
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

      const mappedFaculty = faculty.map((user: any) => ({
        _id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: 'faculty'
      }));
      
      console.log('Returning faculty count:', mappedFaculty.length);
      return mappedFaculty;
    }
    
    if (type === 'all') {
      // Fetch from both User and Faculty collections
      const [students, faculty] = await Promise.all([
        UserModel.find().select('_id firstName lastName email').lean(),
        FacultyModel.find().select('_id firstName lastName email').lean()
      ]);
      
      const allUsers = [
        ...students.map((user: any) => ({
          _id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: 'student'
        })),
        ...faculty.map((user: any) => ({
          _id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: 'faculty'
        }))
      ];
      
      // Apply search filter if provided
      if (search) {
        const searchLower = search.toLowerCase();
        const filteredUsers = allUsers.filter(user => 
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
        console.log('Filtered users count:', filteredUsers.length);
        return filteredUsers;
      }
      
      console.log('Returning all users count:', allUsers.length);
      return allUsers;
    }
    
    console.log('Unknown type, returning empty array');
    return [];
  }
}