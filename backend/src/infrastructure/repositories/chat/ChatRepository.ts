import {
  GetChatsRequestDTO,
  SearchChatsRequestDTO,
  GetChatMessagesRequestDTO,
  SendMessageRequestDTO,
  MarkMessagesAsReadRequestDTO,
  AddReactionRequestDTO,
  RemoveReactionRequestDTO,
  SearchUsersRequestDTO,
  CreateChatRequestDTO,
  CreateGroupChatRequestDTO,
  AddGroupMemberRequestDTO,
  RemoveGroupMemberRequestDTO,
  UpdateGroupAdminRequestDTO,
  UpdateGroupSettingsRequestDTO,
  UpdateGroupInfoRequestDTO,
  LeaveGroupRequestDTO,
  EditMessageRequestDTO,
  DeleteMessageRequestDTO,
  ReplyToMessageRequestDTO
} from "../../../domain/chat/dtos/ChatRequestDTOs";
import {
  GetChatsResponseDTO,
  GetChatMessagesResponseDTO,
  ChatDetailsResponseDTO,
  ChatSummaryDTO,
  MessageDTO,
  SearchUsersResponseDTO,
} from "../../../domain/chat/dtos/ChatResponseDTOs";
import { IChatRepository } from "../../../application/chat/repositories/IChatRepository";
import { ChatModel } from "../../../infrastructure/database/mongoose/models/chat/ChatModel";
import { MessageModel } from "../../../infrastructure/database/mongoose/models/chat/MessageModel";
import { User as UserModel } from "../../../infrastructure/database/mongoose/models/user.model";
import { Faculty as FacultyModel } from "../../../infrastructure/database/mongoose/models/faculty.model";
import { MessageStatus } from "../../../domain/chat/entities/Message";
import { MessageType } from "../../../domain/chat/entities/MessageType";

export class ChatRepository implements IChatRepository {
  async getChats(params: GetChatsRequestDTO): Promise<GetChatsResponseDTO> {
    try {
      console.log('ChatRepository - getChats - Params:', params);
      const { userId, page, limit } = params;
      const skip = (page - 1) * limit;

      // Verify user exists
      console.log('ChatRepository - getChats - Finding user:', userId);
      const user = await UserModel.findById(userId);
      if (!user) {
        console.log('ChatRepository - getChats - User not found');
        throw new Error("User not found");
      }
      console.log('ChatRepository - getChats - User found');

      console.log('ChatRepository - getChats - Finding chats');
      const chats = await ChatModel.find({ participants: userId })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      console.log('ChatRepository - getChats - Chats found:', chats.length);

      const totalItems = await ChatModel.countDocuments({ participants: userId });
      const totalPages = Math.ceil(totalItems / limit);

      console.log('ChatRepository - getChats - Mapping chats');
      const mappedChats: ChatSummaryDTO[] = await Promise.all(
        chats.map(async (chat) => {
          const unreadCount = await MessageModel.countDocuments({
            chatId: chat._id.toString(),
            senderId: { $ne: userId },
            status: MessageStatus.Sent,
          });

          // Populate participants with full user objects
          const participantUsers = await UserModel.find({ _id: { $in: chat.participants } })
            .select("firstName lastName email avatar")
            .lean();

          return {
            id: chat._id.toString(),
            type: chat.type,
            name: chat.name,
            avatar: chat.avatar,
            lastMessage: chat.lastMessage,
            participants: participantUsers.map(user => ({
              id: user._id.toString(),
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              avatar: user.avatar,
              isOnline: false // Default to false, update via socket if needed
            })),
            admins: chat.admins,
            unreadCount,
            updatedAt: chat.updatedAt,
          };
        })
      );
      console.log('ChatRepository - getChats - Chats mapped');

      const result = {
        data: mappedChats,
        totalItems,
        totalPages,
        currentPage: page,
      };
      console.log('ChatRepository - getChats - Returning result');
      return result;
    } catch (error) {
      console.error("Error in getChats repository:", error);
      throw error;
    }
  }

  async searchChats(params: SearchChatsRequestDTO): Promise<GetChatsResponseDTO> {
    try {
      console.log('=== Search Chats Repository Started ===');
      console.log('Search params:', params);
      
      const { userId, query, page, limit } = params;
      const skip = (page - 1) * limit;

      // First, find matching users/faculty
      const userSearchQuery = {
        _id: { $ne: userId },
        $or: [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      };

      console.log('User search query:', JSON.stringify(userSearchQuery, null, 2));

      // Search in both collections
      const [users, faculty] = await Promise.all([
        UserModel.find(userSearchQuery).select('_id firstName lastName email profilePicture').lean(),
        FacultyModel.find(userSearchQuery).select('_id firstName lastName email profilePicture').lean()
      ]);

      console.log('Found users:', users.length);
      console.log('Found faculty:', faculty.length);

      // Get all matching user IDs
      const matchingUserIds = [
        ...users.map(user => user._id.toString()),
        ...faculty.map(faculty => faculty._id.toString())
      ];

      console.log('Matching user IDs:', matchingUserIds);

      // Create base query with user's chats
      let searchQuery: any = { 
        participants: { 
          $in: [userId, ...matchingUserIds]
        }
      };

      // Add message content search if query exists
      if (query && typeof query === 'string' && query.trim().length > 0) {
        searchQuery = {
          ...searchQuery,
          $or: [
            { name: { $regex: query.trim(), $options: "i" } },
            { "lastMessage.content": { $regex: query.trim(), $options: "i" } }
          ]
        };
      }

      console.log('Final chat search query:', JSON.stringify(searchQuery, null, 2));

      const chats = await ChatModel.find(searchQuery)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      console.log('Found chats:', chats.length);

      // If no chats found, create new chat summaries for the matching users
      if (chats.length === 0 && matchingUserIds.length > 0) {
        const newChats = matchingUserIds.map(userId => ({
          id: `new_${userId}`,
          type: 'direct',
          name: '', // Will be set when chat is created
          avatar: '',
          lastMessage: null,
          participants: [params.userId, userId],
          unreadCount: 0,
          updatedAt: new Date()
        }));

        return {
          data: newChats,
          totalItems: newChats.length,
          totalPages: 1,
          currentPage: page,
        };
      }

      const totalItems = await ChatModel.countDocuments(searchQuery);
      const totalPages = Math.ceil(totalItems / limit);

      console.log('Total items:', totalItems);
      console.log('Total pages:', totalPages);

      const mappedChats: ChatSummaryDTO[] = await Promise.all(
        chats.map(async (chat) => {
          const unreadCount = await MessageModel.countDocuments({
            chatId: chat._id.toString(),
            senderId: { $ne: userId },
            status: MessageStatus.Sent,
          });

          // Populate participants with full user objects
          const participantUsers = await UserModel.find({ _id: { $in: chat.participants } })
            .select("firstName lastName email avatar")
            .lean();

          return {
            id: chat._id.toString(),
            type: chat.type,
            name: chat.name,
            avatar: chat.avatar,
            lastMessage: chat.lastMessage,
            participants: participantUsers.map(user => ({
              id: user._id.toString(),
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              avatar: user.avatar,
              isOnline: false // Default to false, update via socket if needed
            })),
            unreadCount,
            updatedAt: chat.updatedAt,
          };
        })
      );

      console.log('Mapped chats:', mappedChats.length);
      console.log('=== Search Chats Repository Ended ===');

      return {
        data: mappedChats,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error('Error in searchChats repository:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getChatMessages(params: GetChatMessagesRequestDTO): Promise<GetChatMessagesResponseDTO> {
    try {
      console.log('ChatRepository - getChatMessages - Params:', params);
      const { chatId, page = 1, limit = 20, before } = params;
      const skip = (page - 1) * limit;

      // Build query for pagination and exclude deleted messages
      const query: any = { 
        chatId,
        deletedForEveryone: false,
        $or: [
          { deletedFor: { $ne: params.userId } },
          { deletedFor: { $exists: false } }
        ]
      };
      
      if (before) {
        query.createdAt = { $lt: new Date(before) };
      }

      // Get messages in ascending order (oldest first)
      const messages = await MessageModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count for pagination
      const totalItems = await MessageModel.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);

      // Map messages and reverse the order to show oldest first
      const mappedMessages: MessageDTO[] = messages
        .reverse()
        .map((message) => ({
          id: message._id.toString(),
          chatId: message.chatId,
          senderId: message.senderId,
          content: message.content,
          type: message.type,
          status: message.status,
          reactions: message.reactions || [],
          attachments: message.attachments || [],
          replyTo: message.replyTo,
          forwardedFrom: message.forwardedFrom,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        }));

      // Get the oldest message timestamp for cursor-based pagination
      const oldestMessageTimestamp = messages.length > 0 
        ? messages[messages.length - 1].createdAt 
        : null;

      return {
        data: mappedMessages,
        totalItems,
        totalPages,
        currentPage: page,
        hasMore: skip + messages.length < totalItems,
        oldestMessageTimestamp: oldestMessageTimestamp?.toISOString() || null
      };
    } catch (error) {
      console.error('Error in getChatMessages repository:', error);
      throw error;
    }
  }

  async sendMessage(params: SendMessageRequestDTO): Promise<void> {
    const { chatId, senderId, content, type, attachments } = params;

    const message = await MessageModel.create({
      chatId,
      senderId,
      content,
      type,
      status: MessageStatus.Sent,
      attachments,
    });

    await ChatModel.findByIdAndUpdate(chatId, {
      lastMessage: {
        id: message._id.toString(),
        content: message.content,
        type: message.type,
        senderId: message.senderId,
        status: message.status,
        createdAt: message.createdAt,
      },
      updatedAt: new Date(),
    });
  }

  async markMessagesAsRead(params: MarkMessagesAsReadRequestDTO): Promise<void> {
    const { chatId, userId } = params;

    await MessageModel.updateMany(
      {
        chatId,
        senderId: { $ne: userId },
        status: MessageStatus.Sent,
      },
      {
        status: MessageStatus.Read,
        updatedAt: new Date(),
      }
    );
  }

  async addReaction(params: AddReactionRequestDTO): Promise<void> {
    const { messageId, userId, emoji } = params;

    await MessageModel.findByIdAndUpdate(
      messageId,
      {
        $push: {
          reactions: {
            userId,
            emoji,
            createdAt: new Date(),
          },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );
  }

  async removeReaction(params: RemoveReactionRequestDTO): Promise<void> {
    const { messageId, userId } = params;

    await MessageModel.findByIdAndUpdate(
      messageId,
      {
        $pull: {
          reactions: { userId },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );
  }

  async getChatDetails(chatId: string): Promise<ChatDetailsResponseDTO | null> {
    const chat = await ChatModel.findById(chatId).lean();
    if (!chat) {
      return null;
    }

    const messages = await MessageModel.find({ chatId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const participants = await UserModel.find({
      _id: { $in: chat.participants },
    })
      .select("firstName lastName email avatar")
      .lean();

    return {
      chat: {
        id: chat._id.toString(),
        participants: chat.participants,
        lastMessage: chat.lastMessage,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        type: chat.type,
        name: chat.name,
        avatar: chat.avatar,
      },
      messages: messages.map((message) => ({
        id: message._id.toString(),
        chatId: message.chatId,
        senderId: message.senderId,
        content: message.content,
        type: message.type,
        status: message.status,
        reactions: message.reactions,
        attachments: message.attachments,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      })),
      participants: participants.map((user) => ({
        id: user._id.toString(),
        name: `${user.firstName} ${user.lastName || ""}`.trim(),
        avatar: user.avatar,
        status: "offline", // This should be managed by a separate service
      })),
    };
  }

  async searchUsers(params: SearchUsersRequestDTO): Promise<SearchUsersResponseDTO> {
    const { query, page = 1, limit = 20, userId } = params;
      const skip = (page - 1) * limit;

    // Ensure query is a string and escape special characters
    const searchQuery = String(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Search in both User and Faculty collections
    const [users, faculty] = await Promise.all([
      UserModel.find({
        _id: { $ne: userId },
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } }
        ]
      })
        .select('firstName lastName email avatar')
          .skip(skip)
          .limit(limit)
          .lean(),

      FacultyModel.find({
        _id: { $ne: userId },
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } }
        ]
      })
        .select('firstName lastName email avatar')
          .skip(skip)
          .limit(limit)
          .lean()
      ]);

    // Get total count for pagination
    const [totalUsers, totalFaculty] = await Promise.all([
      UserModel.countDocuments({
        _id: { $ne: userId },
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } }
        ]
      }),
      FacultyModel.countDocuments({
        _id: { $ne: userId },
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } }
        ]
      })
    ]);

    // Combine and format results
    const results = [
        ...users.map(user => ({
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        avatar: user.avatar,
          type: 'user'
        })),
        ...faculty.map(faculty => ({
          id: faculty._id.toString(),
          firstName: faculty.firstName,
          lastName: faculty.lastName,
          email: faculty.email,
        avatar: faculty.avatar,
          type: 'faculty'
        }))
      ];

    return {
      items: results,
      total: totalUsers + totalFaculty,
      page,
      limit,
      hasMore: skip + results.length < totalUsers + totalFaculty
    };
  }

  async createChat(params: CreateChatRequestDTO): Promise<ChatSummaryDTO> {
    try {
      console.log('ChatRepository - createChat - Params:', params);
      const { creatorId, participantId, type, name, avatar } = params;

      // Check if a direct chat already exists between these users
      if (type === 'direct') {
        const existingChat = await ChatModel.findOne({
          type: 'direct',
          participants: { $all: [creatorId, participantId] }
        });

        if (existingChat) {
          throw new Error('Chat already exists');
        }
      }

      // Try to find creator in both User and Faculty models
      const [userCreator, facultyCreator] = await Promise.all([
        UserModel.findById(creatorId),
        FacultyModel.findById(creatorId)
      ]);

      const creator = userCreator || facultyCreator;
      if (!creator) {
        throw new Error('Creator not found');
      }

      // Try to find participant in both User and Faculty models
      const [userParticipant, facultyParticipant] = await Promise.all([
        UserModel.findById(participantId),
        FacultyModel.findById(participantId)
      ]);

      const participant = userParticipant || facultyParticipant;
      if (!participant) {
        throw new Error('Participant not found');
      }

      // Create the chat
      const chat = await ChatModel.create({
        type,
        name: type === 'direct' ? `${participant.firstName} ${participant.lastName}` : name,
        avatar: type === 'direct' ? (participant.profilePicture || '') : avatar,
        participants: [creatorId, participantId],
        createdBy: creatorId,
        admins: [creatorId],
        settings: {
          onlyAdminsCanPost: false,
          onlyAdminsCanAddMembers: false,
          onlyAdminsCanChangeInfo: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return {
        id: chat._id.toString(),
        type: chat.type,
        name: chat.name || '',
        avatar: chat.avatar || '',
        participants: chat.participants,
        unreadCount: 0,
        updatedAt: chat.updatedAt
      };
    } catch (error) {
      console.error('Error in createChat repository:', error);
      throw error;
    }
  }

  async editMessage(params: EditMessageRequestDTO): Promise<void> {
    try {
      const { chatId, messageId, content, userId } = params;

      const message = await MessageModel.findOne({ _id: messageId, chatId });
      if (!message) {
        throw new Error('Message not found');
      }

      // Check if user is the sender
      if (message.senderId.toString() !== userId) {
        throw new Error('Not authorized to edit this message');
      }

      // Update message
      message.content = content;
      message.isEdited = true;
      await message.save();

      // Update chat's last message if this was the last message
      const chat = await ChatModel.findById(chatId);
      if (chat?.lastMessage?.id === messageId) {
        await ChatModel.findByIdAndUpdate(chatId, {
          lastMessage: {
            ...chat.lastMessage,
            content: content,
            isEdited: true
          }
        });
      }
    } catch (error) {
      console.error('Error in editMessage repository:', error);
      throw error;
    }
  }

  async deleteMessage(params: DeleteMessageRequestDTO): Promise<void> {
    try {
      const { messageId, userId, deleteForEveryone } = params;

      const message = await MessageModel.findOne({ _id: messageId });
      if (!message) {
        throw new Error('Message not found');
      }

      // Check if user is the sender for deleteForEveryone
      if (deleteForEveryone && message.senderId.toString() !== userId) {
        throw new Error('Not authorized to delete for everyone');
      }

      if (deleteForEveryone) {
        // Delete for everyone
        message.isDeleted = true;
        message.deletedForEveryone = true;
        message.content = 'This message was deleted';
        message.attachments = [];
      } else {
        // Delete for me
        if (!message.deletedFor) {
          message.deletedFor = [];
        }
        message.deletedFor.push(userId);
        message.isDeleted = true;
      }

      await message.save();

      // Update chat's last message if this was the last message
      const chat = await ChatModel.findById(message.chatId);
      if (chat?.lastMessage?.id === messageId) {
        await ChatModel.findByIdAndUpdate(message.chatId, {
          lastMessage: {
            ...chat.lastMessage,
            content: deleteForEveryone ? 'This message was deleted' : chat.lastMessage.content,
            isDeleted: true,
            deletedForEveryone: deleteForEveryone
          }
        });
      }
    } catch (error) {
      console.error('Error in deleteMessage repository:', error);
      throw error;
    }
  }

  async updateMessageStatus(messageId: string, status: MessageStatus): Promise<void> {
    try {
      await MessageModel.findByIdAndUpdate(messageId, {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error in updateMessageStatus repository:', error);
      throw error;
    }
  }

  async addGroupMember(chatId: string, userId: string, addedBy: string): Promise<void> {
    try {
      const chat = await ChatModel.findById(chatId);
      if (!chat) throw new Error('Chat not found');

      if (chat.type !== ChatType.Group) {
        throw new Error('Can only add members to group chats');
      }

      if (chat.settings.onlyAdminsCanAddMembers && !chat.admins.includes(addedBy)) {
        throw new Error('Only admins can add members');
      }

      if (chat.participants.includes(userId)) {
        throw new Error('User is already a member');
      }

      await ChatModel.findByIdAndUpdate(chatId, {
        $addToSet: { participants: userId }
      });
    } catch (error) {
      console.error('Error in addGroupMember repository:', error);
      throw error;
    }
  }

  async removeGroupMember(chatId: string, userId: string, removedBy: string): Promise<void> {
    try {
      const chat = await ChatModel.findById(chatId);
      if (!chat) throw new Error('Chat not found');

      if (chat.type !== ChatType.Group) {
        throw new Error('Can only remove members from group chats');
      }

      if (!chat.admins.includes(removedBy)) {
        throw new Error('Only admins can remove members');
      }

      await ChatModel.findByIdAndUpdate(chatId, {
        $pull: { 
          participants: userId,
          admins: userId
        }
      });
    } catch (error) {
      console.error('Error in removeGroupMember repository:', error);
      throw error;
    }
  }

  async updateGroupSettings(chatId: string, settings: {
    onlyAdminsCanPost?: boolean;
    onlyAdminsCanAddMembers?: boolean;
    onlyAdminsCanChangeInfo?: boolean;
  }, updatedBy: string): Promise<void> {
    try {
      const chat = await ChatModel.findById(chatId);
      if (!chat) throw new Error('Chat not found');

      if (chat.type !== ChatType.Group) {
        throw new Error('Can only update settings for group chats');
      }

      if (!chat.admins.includes(updatedBy)) {
        throw new Error('Only admins can update group settings');
      }

      await ChatModel.findByIdAndUpdate(chatId, {
        $set: { settings }
      });
    } catch (error) {
      console.error('Error in updateGroupSettings repository:', error);
      throw error;
    }
  }

  async forwardMessage(messageId: string, targetChatId: string, forwardedBy: string): Promise<void> {
    try {
      const message = await MessageModel.findById(messageId);
      if (!message) throw new Error('Message not found');

      const newMessage = await MessageModel.create({
        chatId: targetChatId,
        senderId: forwardedBy,
        content: message.content,
        type: message.type,
        status: MessageStatus.Sent,
        attachments: message.attachments,
        forwardedFrom: {
          messageId: message._id.toString(),
          chatId: message.chatId,
          senderId: message.senderId
        }
      });

      await ChatModel.findByIdAndUpdate(targetChatId, {
        lastMessage: {
          id: newMessage._id.toString(),
          content: newMessage.content,
          type: newMessage.type,
          senderId: newMessage.senderId,
          status: newMessage.status,
          createdAt: newMessage.createdAt
        },
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error in forwardMessage repository:', error);
      throw error;
    }
  }

  async replyToMessage(params: ReplyToMessageRequestDTO): Promise<void> {
    try {
      const { chatId, messageId, content, userId } = params;

      const originalMessage = await MessageModel.findById(messageId);
      if (!originalMessage) {
        throw new Error('Original message not found');
      }

      const newMessage = await MessageModel.create({
        chatId,
        senderId: userId,
        content,
        type: MessageType.Text,
        status: MessageStatus.Sent,
        replyTo: {
          messageId: originalMessage._id.toString(),
          content: originalMessage.content,
          senderId: originalMessage.senderId,
          type: originalMessage.type
        }
      });

      await ChatModel.findByIdAndUpdate(chatId, {
        lastMessage: {
          id: newMessage._id.toString(),
          content: newMessage.content,
          type: newMessage.type,
          senderId: newMessage.senderId,
          status: newMessage.status,
          createdAt: newMessage.createdAt
        },
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error in replyToMessage repository:', error);
      throw error;
    }
  }

  async createGroupChat(params: CreateGroupChatRequestDTO): Promise<ChatSummaryDTO> {
    try {
      console.log('ChatRepository - createGroupChat - Params:', params);
      const { creatorId, name, participants, description, settings } = params;

      // Verify creator exists
      const [userCreator, facultyCreator] = await Promise.all([
        UserModel.findById(creatorId),
        FacultyModel.findById(creatorId)
      ]);

      const creator = userCreator || facultyCreator;
      if (!creator) {
        throw new Error('Creator not found');
      }

      // Verify all participants exist
      const [userParticipants, facultyParticipants] = await Promise.all([
        UserModel.find({ _id: { $in: participants } }),
        FacultyModel.find({ _id: { $in: participants } })
      ]);

      const allParticipants = [...userParticipants, ...facultyParticipants];
      if (allParticipants.length !== participants.length) {
        throw new Error('One or more participants not found');
      }

      // Ensure creator is included in participants
      const finalParticipants = [...new Set([...participants, creatorId])];

      // Create the group chat
      const chat = await ChatModel.create({
        type: 'group',
        name,
        description,
        participants: finalParticipants,
        createdBy: creatorId,
        admins: [creatorId], // Creator is the first admin
        settings: {
          onlyAdminsCanPost: settings?.onlyAdminsCanPost || false,
          onlyAdminsCanAddMembers: settings?.onlyAdminsCanAddMembers || false,
          onlyAdminsCanChangeInfo: settings?.onlyAdminsCanChangeInfo || false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return {
        id: chat._id.toString(),
        type: chat.type,
        name: chat.name,
        avatar: chat.avatar || '',
        participants: chat.participants,
        unreadCount: 0,
        updatedAt: chat.updatedAt
      };
    } catch (error) {
      console.error('Error in createGroupChat repository:', error);
      throw error;
    }
  }
} 