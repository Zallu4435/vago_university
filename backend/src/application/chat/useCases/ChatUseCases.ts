import { IChatRepository } from "../repositories/IChatRepository";
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
  SearchUsersResponseDTO,
  ChatSummaryDTO,
} from "../../../domain/chat/dtos/ChatResponseDTOs";
import { MessageType } from "../../../domain/chat/entities/Message";
import { RepositoryChat, RepositoryMessage, RepositoryObjectIdLike, RepositoryUser } from "../../../domain/chat/entities/MessageType";

const toId = (id: RepositoryObjectIdLike): string =>
  typeof id === 'string' ? id : id.toString();

export interface IGetChatsUseCase {
  execute(params: GetChatsRequestDTO): Promise<GetChatsResponseDTO>;
}

export interface IGetChatMessagesUseCase {
  execute(params: GetChatMessagesRequestDTO): Promise<GetChatMessagesResponseDTO>;
}

export interface IMarkMessagesAsReadUseCase {
  execute(params: MarkMessagesAsReadRequestDTO): Promise<void>;
}

export interface IAddReactionUseCase {
  execute(params: AddReactionRequestDTO): Promise<void>;
}

export interface IRemoveReactionUseCase {
  execute(params: RemoveReactionRequestDTO): Promise<void>;
}

export interface IGetChatDetailsUseCase {
  execute(chatId: string, userId: string): Promise<ChatDetailsResponseDTO | null>;
}

export interface ICreateChatUseCase {
  execute(params: CreateChatRequestDTO): Promise<ChatSummaryDTO>;
}

export interface ICreateGroupChatUseCase {
  execute(params: CreateGroupChatRequestDTO): Promise<ChatSummaryDTO>;
}

export interface IAddGroupMemberUseCase {
  execute(params: AddGroupMemberRequestDTO): Promise<void>;
}

export interface IRemoveGroupMemberUseCase {
  execute(params: RemoveGroupMemberRequestDTO): Promise<void>;
}

export interface IUpdateGroupAdminUseCase {
  execute(params: UpdateGroupAdminRequestDTO): Promise<void>;
}

export interface IUpdateGroupSettingsUseCase {
  execute(params: UpdateGroupSettingsRequestDTO): Promise<void>;
}

export interface IUpdateGroupInfoUseCase {
  execute(params: UpdateGroupInfoRequestDTO): Promise<void>;
}

export interface ILeaveGroupUseCase {
  execute(params: LeaveGroupRequestDTO): Promise<void>;
}

export interface IEditMessageUseCase {
  execute(params: EditMessageRequestDTO): Promise<void>;
}

export interface IReplyToMessageUseCase {
  execute(params: ReplyToMessageRequestDTO): Promise<void>;
}

export interface IDeleteChatUseCase {
  execute(params: DeleteChatRequestDTO): Promise<void>;
}

export interface IBlockChatUseCase {
  execute(params: BlockChatRequestDTO): Promise<void>;
}

export interface IClearChatUseCase {
  execute(params: ClearChatRequestDTO): Promise<void>;
}

export interface ISendMessageUseCase {
  execute(params: SendMessageRequestDTO): Promise<void>;
}

export interface ISearchChatsUseCase {
  execute(params: SearchChatsRequestDTO): Promise<GetChatsResponseDTO>;
}

export interface ISearchUsersUseCase {
  execute(params: SearchUsersRequestDTO): Promise<SearchUsersResponseDTO>;
}

export interface IDeleteMessageUseCase {
  execute(params: DeleteMessageRequestDTO): Promise<void>;
}

export class GetChatsUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: GetChatsRequestDTO): Promise<GetChatsResponseDTO> {
    const { userId, page, limit } = params;
    const { chats, totalItems, totalPages, currentPage } = await this.chatRepository.getChats({ userId, page, limit });

    const data = await Promise.all(chats.map(async (chat: RepositoryChat) => {
      const unreadCount = await this.chatRepository.getUnreadCountForChat({ chatId: chat._id.toString(), userId });
      const lastMessage = await this.chatRepository.getLastMessageForChat({ chatId: chat._id.toString(), userId });
      const participantUsers = await this.chatRepository.getUsersByIds(chat.participants.map((p: RepositoryObjectIdLike) => p.toString()));

      return {
        id: toId(chat._id),
        type: chat.type,
        name: chat.name,
        avatar: chat.avatar,
        lastMessage: lastMessage || undefined,
        participants: participantUsers.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          isOnline: false
        })),
        admins: chat.admins,
        unreadCount,
        updatedAt: chat.updatedAt,
      };
    }));

    return { data, totalItems, totalPages, currentPage };
  }
}

export class SearchChatsUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: SearchChatsRequestDTO): Promise<GetChatsResponseDTO> {
    const { userId, query, page, limit } = params;
    const { chats, totalItems, totalPages, currentPage, matchingUserIds } = await this.chatRepository.searchChats({ userId, query, page, limit });

    if (chats.length === 0 && matchingUserIds.length > 0) {
      const newChats: ChatSummaryDTO[] = matchingUserIds.map((matchedId) => ({
        id: `new_${matchedId}`,
        type: 'direct',
        name: '',
        avatar: '',
        lastMessage: null,
        participants: [
          { id: userId, firstName: '', lastName: '', email: '', avatar: '', isOnline: false },
          { id: matchedId, firstName: '', lastName: '', email: '', avatar: '', isOnline: false }
        ],
        unreadCount: 0,
        updatedAt: new Date()
      }));
      return { data: newChats, totalItems: newChats.length, totalPages: 1, currentPage: page };
    }

    const data = await Promise.all(chats.map(async (chat: RepositoryChat) => {
      const unreadCount = await this.chatRepository.getUnreadCountForChat({ chatId: chat._id.toString(), userId });
      const lastMessage = await this.chatRepository.getLastMessageForChat({ chatId: chat._id.toString(), userId });
      const participantUsers = await this.chatRepository.getUsersByIds(chat.participants.map((p: RepositoryObjectIdLike) => p.toString()));

      return {
        id: toId(chat._id),
        type: chat.type,
        name: chat.name,
        avatar: chat.avatar,
        lastMessage: lastMessage || undefined,
        participants: participantUsers.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          isOnline: false
        })),
        unreadCount,
        updatedAt: chat.updatedAt,
      };
    }));

    return { data, totalItems, totalPages, currentPage };
  }
}

export class GetChatMessagesUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: GetChatMessagesRequestDTO): Promise<GetChatMessagesResponseDTO> {
    const { chatId, userId, before } = params;
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    const { messages, totalItems, totalPages, currentPage } = await this.chatRepository.getChatMessages({ chatId, userId, page, limit, before });

    const mapped = messages
      .slice() 
      .reverse()
      .map((message: RepositoryMessage) => ({
        id: toId(message._id),
        chatId: message.chatId,
        senderId: message.senderId,
        content: message.content,
        type: message.type,
        status: message.status,
        reactions: message.reactions || [],
        attachments: (message.attachments || []).map((a) => ({
          type: a.type,
          url: a.url,
          name: a.name ?? "",
          size: a.size ?? 0,
          thumbnail: a.thumbnail,
          duration: a.duration,
        })),
        replyTo: message.replyTo,
        forwardedFrom: message.forwardedFrom,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        isDeleted: message.isDeleted || false,
        deletedForEveryone: message.deletedForEveryone || false,
        deletedFor: message.deletedFor || [],
      }));

    const skip = (page - 1) * limit;
    const hasMore = skip + messages.length < totalItems;
    const oldestMessageTimestamp = messages.length > 0 ? messages[messages.length - 1].createdAt?.toISOString?.() || null : null;

    return {
      data: mapped,
      totalItems,
      totalPages,
      currentPage,
      hasMore,
      oldestMessageTimestamp,
    };
  }
}

export class SendMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: SendMessageRequestDTO): Promise<void> {
    const { chatId, senderId, content, attachments } = params;
    const type = params.type as unknown as MessageType;
    return this.chatRepository.sendMessage({ chatId, senderId, content, type, attachments });
  }
}

export class MarkMessagesAsReadUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: MarkMessagesAsReadRequestDTO): Promise<void> {
    return this.chatRepository.markMessagesAsRead(params);
  }
}

export class AddReactionUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: AddReactionRequestDTO): Promise<void> {
    return this.chatRepository.addReaction(params);
  }
}

export class RemoveReactionUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: RemoveReactionRequestDTO): Promise<void> {
    return this.chatRepository.removeReaction(params);
  }
}

export class GetChatDetailsUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(chatId: string, userId: string): Promise<ChatDetailsResponseDTO | null> {
    const raw = await this.chatRepository.getChatDetails(chatId, userId);
    if (!raw) return null;

    const { chat, messages, participants, unreadCount } = raw;

    const mappedParticipants = participants.map((user: RepositoryUser) => ({
      id: toId(user._id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.profilePicture || '',
      isOnline: false,
    }));

    const dto: ChatDetailsResponseDTO = {
      chat: {
        id: toId(chat._id),
        participants: mappedParticipants,
        lastMessage: chat.lastMessage,
        updatedAt: chat.updatedAt,
        type: chat.type,
        name: chat.name,
        avatar: chat.avatar,
        description: chat.description,
        admins: chat.admins,
        settings: chat.settings as unknown as { onlyAdminsCanPost: boolean; onlyAdminsCanAddMembers: boolean; onlyAdminsCanChangeInfo: boolean; },
        blockedUsers: chat.blockedUsers,
        unreadCount,
      },
      messages: messages.map((message: RepositoryMessage) => ({
        id: toId(message._id),
        chatId: message.chatId,
        senderId: message.senderId,
        content: message.content,
        type: message.type,
        status: message.status,
        reactions: message.reactions || [],
        attachments: (message.attachments || []).map((a) => ({
          type: a.type,
          url: a.url,
          name: a.name ?? "",
          size: a.size ?? 0,
          thumbnail: a.thumbnail,
          duration: a.duration,
        })),
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      })),
      participants: mappedParticipants.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatar,
        status: 'online',
        isAdmin: (chat.admins as string[] | undefined)?.includes(user.id) || false,
      })),
      settings: chat.settings as { onlyAdminsCanPost: boolean; onlyAdminsCanAddMembers: boolean; onlyAdminsCanChangeInfo: boolean; },
    };

    return dto;
  }
}

export class SearchUsersUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: SearchUsersRequestDTO): Promise<SearchUsersResponseDTO> {
    return this.chatRepository.searchUsers(params);
  }
}

export class CreateChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: CreateChatRequestDTO): Promise<ChatSummaryDTO> {
    return this.chatRepository.createChat(params);
  }
}

export class CreateGroupChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: CreateGroupChatRequestDTO): Promise<ChatSummaryDTO> {
    return this.chatRepository.createGroupChat(params);
  }
}

export class AddGroupMemberUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: AddGroupMemberRequestDTO): Promise<void> {
    return this.chatRepository.addGroupMember(params);
  }
}

export class RemoveGroupMemberUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: RemoveGroupMemberRequestDTO): Promise<void> {
    return this.chatRepository.removeGroupMember(params);
  }
}

export class UpdateGroupAdminUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupAdminRequestDTO): Promise<void> {
    return this.chatRepository.updateGroupAdmin(params);
  }
}

export class UpdateGroupSettingsUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupSettingsRequestDTO): Promise<void> {
    return this.chatRepository.updateGroupSettings(params);
  }
}

export class UpdateGroupInfoUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupInfoRequestDTO): Promise<void> {
    return this.chatRepository.updateGroupInfo(params);
  }
}

export class LeaveGroupUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: LeaveGroupRequestDTO): Promise<void> {
    return this.chatRepository.leaveGroup(params);
  }
}

export class EditMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: EditMessageRequestDTO): Promise<void> {
    return this.chatRepository.editMessage(params);
  }
}

export class DeleteMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: DeleteMessageRequestDTO): Promise<void> {
    return this.chatRepository.deleteMessage(params);
  }
}

export class ReplyToMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: ReplyToMessageRequestDTO): Promise<void> {
    return this.chatRepository.replyToMessage(params);
  }
}

export class DeleteChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: DeleteChatRequestDTO): Promise<void> {
    return this.chatRepository.deleteChat(params);
  }
}

export class BlockChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: BlockChatRequestDTO): Promise<void> {
    return this.chatRepository.blockChat(params);
  }
}

export class ClearChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: ClearChatRequestDTO): Promise<void> {
    return this.chatRepository.clearChat(params);
  }
} 