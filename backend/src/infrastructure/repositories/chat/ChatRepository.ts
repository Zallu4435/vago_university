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
  ReplyToMessageRequestDTO,
  DeleteChatRequestDTO,
  BlockChatRequestDTO,
  ClearChatRequestDTO
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
import { ChatType } from "../../../domain/chat/entities/Chat";

export class ChatRepository implements IChatRepository {
  async getChats(params: GetChatsRequestDTO): Promise<GetChatsResponseDTO> {
    try {
      const { userId, page, limit } = params;
      const skip = (page - 1) * limit;

      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const chats = await ChatModel.find({ participants: userId })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalItems = await ChatModel.countDocuments({ participants: userId });
      const totalPages = Math.ceil(totalItems / limit);

      const mappedChats: ChatSummaryDTO[] = await Promise.all(
        chats.map(async (chat) => {
          const unreadCount = await MessageModel.countDocuments({
            chatId: chat._id.toString(),
            senderId: { $ne: userId },
            status: MessageStatus.Sent,
          });

          const lastMessage = await MessageModel.findOne({
            chatId: chat._id.toString(),
            deletedFor: { $ne: userId }
          })
            .sort({ createdAt: -1 })
            .lean();

          const participantUsers = await UserModel.find({ _id: { $in: chat.participants } })
            .select("firstName lastName email avatar")
            .lean();

          return {
            id: chat._id.toString(),
            type: chat.type,
            name: chat.name,
            avatar: chat.avatar,
            lastMessage: lastMessage
              ? {
                  id: lastMessage._id.toString(),
                  content: lastMessage.content,
                  type: lastMessage.type,
                  senderId: lastMessage.senderId,
                  status: lastMessage.status,
                  createdAt: lastMessage.createdAt,
                }
              : undefined,
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

      const result = {
        data: mappedChats,
        totalItems,
        totalPages,
        currentPage: page,
      };
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

      const userSearchQuery = {
        _id: { $ne: userId },
        $or: [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      };

      console.log('User search query:', JSON.stringify(userSearchQuery, null, 2));

      const [users, faculty] = await Promise.all([
        UserModel.find(userSearchQuery).select('_id firstName lastName email profilePicture').lean(),
        FacultyModel.find(userSearchQuery).select('_id firstName lastName email profilePicture').lean()
      ]);

      console.log('Found users:', users.length);
      console.log('Found faculty:', faculty.length);

      const matchingUserIds = [
        ...users.map(user => user._id.toString()),
        ...faculty.map(faculty => faculty._id.toString())
      ];

      console.log('Matching user IDs:', matchingUserIds);

      let searchQuery: any = {
        participants: {
          $in: [userId, ...matchingUserIds]
        }
      };

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

          const lastMessage = await MessageModel.findOne({
            chatId: chat._id.toString(),
            deletedFor: { $ne: userId }
          })
            .sort({ createdAt: -1 })
            .lean();

          const participantUsers = await UserModel.find({ _id: { $in: chat.participants } })
            .select("firstName lastName email avatar")
            .lean();

          return {
            id: chat._id.toString(),
            type: chat.type,
            name: chat.name,
            avatar: chat.avatar,
            lastMessage: lastMessage
              ? {
                  id: lastMessage._id.toString(),
                  content: lastMessage.content,
                  type: lastMessage.type,
                  senderId: lastMessage.senderId,
                  status: lastMessage.status,
                  createdAt: lastMessage.createdAt,
                }
              : undefined,
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
      const { chatId, userId, page = 1, limit = 20, before } = params;
      const skip = (page - 1) * limit;

      const query: any = {
        chatId,
        $or: [
          { deletedFor: { $exists: false } },
          { deletedFor: { $ne: userId } }
        ]
      };

      if (before) {
        query.createdAt = { $lt: new Date(before) };
      }

      const messages = await MessageModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalItems = await MessageModel.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);

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
          isDeleted: message.isDeleted || false,
          deletedForEveryone: message.deletedForEveryone || false,
          deletedFor: message.deletedFor || [],
        }));

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
    const chat = await ChatModel.findById(chatId);
    if (!chat) throw new Error('Chat not found');
    if (chat.type === 'direct') {
      const receiverId = chat.participants.find((id: string) => id !== senderId);
      if (receiverId && chat.blockedUsers.some((entry: any) => entry.blocker === receiverId && entry.blocked === senderId)) {
        throw new Error('You are blocked and cannot send messages to this user.');
      }
    }
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

  async getChatDetails(chatId: string, userId: string): Promise<ChatDetailsResponseDTO | null> {
    const chat = await ChatModel.findById(chatId).lean();
    if (!chat) {
      return null;
    }

    const messages = await MessageModel.find({
      chatId,
      $or: [
        { deletedFor: { $exists: false } },
        { deletedFor: { $ne: userId } }
      ]
    })
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
        participants: participants.map((user) => ({
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          isOnline: false // Default to false, update via socket if needed
        })),
        lastMessage: chat.lastMessage,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        type: chat.type,
        name: chat.name,
        avatar: chat.avatar,
        description: chat.description,
        admins: chat.admins,
        settings: chat.settings,
        blockedUsers: chat.blockedUsers,
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
    };
  }

  async searchUsers(params: SearchUsersRequestDTO): Promise<SearchUsersResponseDTO> {
    const { query, page = 1, limit = 20, userId } = params;
    const skip = (page - 1) * limit;

    const searchQuery = String(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

      if (type === 'direct') {
        const existingChat = await ChatModel.findOne({
          type: 'direct',
          participants: { $all: [creatorId, participantId] }
        });

        if (existingChat) {
          throw new Error('Chat already exists');
        }
      }

      const [userCreator, facultyCreator] = await Promise.all([
        UserModel.findById(creatorId),
        FacultyModel.findById(creatorId)
      ]);

      const creator = userCreator || facultyCreator;
      if (!creator) {
        throw new Error('Creator not found');
      }

      const [userParticipant, facultyParticipant] = await Promise.all([
        UserModel.findById(participantId),
        FacultyModel.findById(participantId)
      ]);

      const participant = userParticipant || facultyParticipant;
      if (!participant) {
        throw new Error('Participant not found');
      }

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

      if (message.senderId.toString() !== userId) {
        throw new Error('Not authorized to edit this message');
      }

      message.content = content;
      message.isEdited = true;
      await message.save();

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
      console.log('[deleteMessage] params:', params);
      const message = await MessageModel.findOne({ _id: messageId });
      if (!message) {
        console.error('[deleteMessage] Message not found:', messageId);
        throw new Error('Message not found');
      }
      if (deleteForEveryone && message.senderId.toString() !== userId) {
        console.error('[deleteMessage] Not authorized to delete for everyone:', { messageId, userId, senderId: message.senderId });
        throw new Error('Not authorized to delete for everyone');
      }
      if (deleteForEveryone) {
        message.isDeleted = true;
        message.deletedForEveryone = true;
      } else {
        if (!message.deletedFor) {
          message.deletedFor = [];
        }
        if (!message.deletedFor.includes(userId)) {
          message.deletedFor.push(userId);
        }
      }
      await message.save();
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
      console.error('Error in deleteMessage repository:', error, '\nParams:', params);
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

  async addGroupMember(params: AddGroupMemberRequestDTO): Promise<void> {
    const { chatId, userId, addedBy } = params;
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

  async removeGroupMember(params: RemoveGroupMemberRequestDTO): Promise<void> {
    const { chatId, userId, removedBy } = params;
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

  async updateGroupSettings(params: UpdateGroupSettingsRequestDTO): Promise<void> {
    try {
      console.log('ChatRepository - updateGroupSettings - Params:', params);
      const { chatId, settings, updatedBy } = params;
      const chat = await ChatModel.findById(chatId);
      if (!chat) throw new Error('Chat not found');

      if (chat.type !== ChatType.Group) {
        throw new Error('Can only update settings for group chats');
      }

      if (!chat.admins.includes(updatedBy)) {
        throw new Error('Only admins can update group settings');
      }

      const updateQuery: { [key: string]: any } = {};
      for (const key in settings) {
        if (Object.prototype.hasOwnProperty.call(settings, key)) {
          updateQuery[`settings.${key}`] = settings[key as keyof typeof settings];
        }
      }

      console.log('ChatRepository - updateGroupSettings - Update query:', updateQuery);
      await ChatModel.findByIdAndUpdate(chatId, { $set: updateQuery });
      console.log('ChatRepository - updateGroupSettings - Update finished');
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

      const [userCreator, facultyCreator] = await Promise.all([
        UserModel.findById(creatorId),
        FacultyModel.findById(creatorId)
      ]);

      const creator = userCreator || facultyCreator;
      if (!creator) {
        throw new Error('Creator not found');
      }

      const [userParticipants, facultyParticipants] = await Promise.all([
        UserModel.find({ _id: { $in: participants } }),
        FacultyModel.find({ _id: { $in: participants } })
      ]);

      const allParticipants = [...userParticipants, ...facultyParticipants];
      if (allParticipants.length !== participants.length) {
        throw new Error('One or more participants not found');
      }

      const finalParticipants = [...new Set([...participants, creatorId])];

      const chat = await ChatModel.create({
        type: 'group',
        name,
        description,
        participants: finalParticipants,
        createdBy: creatorId,
        admins: [creatorId], // Creator is the first admin
        avatar: params.avatar, // Save the avatar URL
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

  async updateGroupAdmin(params: UpdateGroupAdminRequestDTO): Promise<void> {
    try {
      console.log('updateGroupAdmin - Params:', params);
      const { chatId, userId, isAdmin, updatedBy } = params;
      const chat = await ChatModel.findById(chatId);
      if (!chat) throw new Error('Chat not found');
      if (chat.type !== ChatType.Group) throw new Error('Can only update admins for group chats');
      if (!chat.admins.includes(updatedBy)) throw new Error('Only admins can update admin status');
      if (isAdmin) {
        await ChatModel.findByIdAndUpdate(chatId, { $addToSet: { admins: userId } });
      } else {
        await ChatModel.findByIdAndUpdate(chatId, { $pull: { admins: userId } });
      }
    } catch (error) {
      console.error('Error in updateGroupAdmin repository:', error, 'Params:', params);
      throw error;
    }
  }

  async updateGroupInfo(params: UpdateGroupInfoRequestDTO): Promise<void> {
    try {
      console.log('updateGroupInfo - Params:', params);
      const { chatId, name, description, avatar, updatedBy } = params;
      const chat = await ChatModel.findById(chatId);
      if (!chat) throw new Error('Chat not found');
      if (chat.type !== ChatType.Group) throw new Error('Can only update info for group chats');
      if (!chat.admins.includes(updatedBy)) throw new Error('Only admins can update group info');
      const update: any = {};
      if (name !== undefined) update.name = name;
      if (description !== undefined) update.description = description;
      if (avatar !== undefined) update.avatar = avatar;
      console.log('updateGroupInfo - Update object:', update);
      await ChatModel.findByIdAndUpdate(chatId, { $set: update });
    } catch (error) {
      console.error('Error in updateGroupInfo repository:', error, 'Params:', params);
      throw error;
    }
  }

  async leaveGroup(params: { chatId: string; userId: string }): Promise<void> {
    try {
      const { chatId, userId } = params;
      await ChatModel.findByIdAndUpdate(chatId, {
        $pull: {
          participants: userId,
          admins: userId
        }
      });
    } catch (error) {
      console.error('Error in leaveGroup repository:', error);
      throw error;
    }
  }

  async deleteChat(params: DeleteChatRequestDTO): Promise<void> {
    const { chatId, userId } = params;
    const chat = await ChatModel.findById(chatId);
    if (!chat) throw new Error('Chat not found');
    if (!chat.participants.map(String).includes(String(userId))) throw new Error('Not authorized');
    await ChatModel.findByIdAndDelete(chatId);
    await MessageModel.deleteMany({ chatId });
  }

  async blockChat(params: BlockChatRequestDTO): Promise<void> {
    const { chatId, userId } = params;
    const chat = await ChatModel.findById(chatId);
    if (!chat) throw new Error('Chat not found');
    if (chat.type === 'direct') {
      const otherUserId = chat.participants.find((id: string) => id !== userId);
      if (otherUserId) {
        // Check if already blocked
        const isBlocked = chat.blockedUsers?.some((entry: any) => entry.blocker === userId && entry.blocked === otherUserId);
        if (isBlocked) {
          // Unblock: remove the block entry
          await ChatModel.findByIdAndUpdate(chatId, {
            $pull: { blockedUsers: { blocker: userId, blocked: otherUserId } }
          });
        } else {
          // Block: add the block entry
          await ChatModel.findByIdAndUpdate(chatId, {
            $addToSet: { blockedUsers: { blocker: userId, blocked: otherUserId } }
          });
        }
      }
    } else {
      // For group, keep previous logic (if needed)
    }
  }

  async clearChat(params: ClearChatRequestDTO): Promise<void> {
    const { chatId, userId } = params;
    await MessageModel.updateMany(
      { chatId },
      { $addToSet: { deletedFor: userId } }
    );
  }
} 