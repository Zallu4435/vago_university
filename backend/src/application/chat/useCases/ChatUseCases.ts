import { IChatRepository } from "../repositories/IChatRepository";
import {
  IGetChatsUseCase,
  ISearchChatsUseCase,
  IGetChatMessagesUseCase,
  IGetChatDetailsUseCase,
  IMarkMessagesAsReadUseCase,
  ISendMessageUseCase,
  IAddReactionUseCase,
  IRemoveReactionUseCase,
  ISearchUsersUseCase,
  ICreateChatUseCase,
  ICreateGroupChatUseCase,
  IAddGroupMemberUseCase,
  IRemoveGroupMemberUseCase,
  IUpdateGroupAdminUseCase,
  IUpdateGroupSettingsUseCase,
  IUpdateGroupInfoUseCase,
  ILeaveGroupUseCase,
  IEditMessageUseCase,
  IDeleteMessageUseCase,
  IReplyToMessageUseCase,
  IDeleteChatUseCase,
  IBlockChatUseCase,
  IClearChatUseCase
} from "./IChatUseCases";
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

export class GetChatsUseCase implements IGetChatsUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: GetChatsRequestDTO): Promise<GetChatsResponseDTO> {
    const { userId, page, limit } = params;
    const { chats, totalItems, totalPages, currentPage } = await this._chatRepository.getChats({ userId, page, limit });

    const data = await Promise.all(chats.map(async (chat: RepositoryChat) => {
      const unreadCount = await this._chatRepository.getUnreadCountForChat({ chatId: chat._id.toString(), userId });
      const lastMessage = await this._chatRepository.getLastMessageForChat({ chatId: chat._id.toString(), userId });
      const participantUsers = await this._chatRepository.getUsersByIds(chat.participants.map((p: RepositoryObjectIdLike) => p.toString()));

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

export class SearchChatsUseCase implements ISearchChatsUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: SearchChatsRequestDTO): Promise<GetChatsResponseDTO> {
    const { userId, query, page, limit } = params;
    const { chats, totalItems, totalPages, currentPage, matchingUserIds } = await this._chatRepository.searchChats({ userId, query, page, limit });

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
      const unreadCount = await this._chatRepository.getUnreadCountForChat({ chatId: chat._id.toString(), userId });
      const lastMessage = await this._chatRepository.getLastMessageForChat({ chatId: chat._id.toString(), userId });
      const participantUsers = await this._chatRepository.getUsersByIds(chat.participants.map((p: RepositoryObjectIdLike) => p.toString()));

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

export class GetChatMessagesUseCase implements IGetChatMessagesUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: GetChatMessagesRequestDTO): Promise<GetChatMessagesResponseDTO> {
    const { chatId, userId, before } = params;
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    const { messages, totalItems, totalPages, currentPage } = await this._chatRepository.getChatMessages({ chatId, userId, page, limit, before });

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

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: SendMessageRequestDTO): Promise<void> {
    const { chatId, senderId, content, attachments } = params;
    const type = params.type as unknown as MessageType;
    return this._chatRepository.sendMessage({ chatId, senderId, content, type, attachments });
  }
}

export class MarkMessagesAsReadUseCase implements IMarkMessagesAsReadUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: MarkMessagesAsReadRequestDTO): Promise<void> {
    return this._chatRepository.markMessagesAsRead(params);
  }
}

export class AddReactionUseCase implements IAddReactionUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: AddReactionRequestDTO): Promise<void> {
    return this._chatRepository.addReaction(params);
  }
}

export class RemoveReactionUseCase implements IRemoveReactionUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: RemoveReactionRequestDTO): Promise<void> {
    return this._chatRepository.removeReaction(params);
  }
}

export class GetChatDetailsUseCase implements IGetChatDetailsUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(chatId: string, userId: string): Promise<ChatDetailsResponseDTO | null> {
    const raw = await this._chatRepository.getChatDetails(chatId, userId);
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

export class SearchUsersUseCase implements ISearchUsersUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: SearchUsersRequestDTO): Promise<SearchUsersResponseDTO> {
    return this._chatRepository.searchUsers(params);
  }
}

export class CreateChatUseCase implements ICreateChatUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: CreateChatRequestDTO): Promise<ChatSummaryDTO> {
    return this._chatRepository.createChat(params);
  }
}

export class CreateGroupChatUseCase implements ICreateGroupChatUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: CreateGroupChatRequestDTO): Promise<ChatSummaryDTO> {
    return this._chatRepository.createGroupChat(params);
  }
}

export class AddGroupMemberUseCase implements IAddGroupMemberUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: AddGroupMemberRequestDTO): Promise<void> {
    return this._chatRepository.addGroupMember(params);
  }
}

export class RemoveGroupMemberUseCase implements IRemoveGroupMemberUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: RemoveGroupMemberRequestDTO): Promise<void> {
    return this._chatRepository.removeGroupMember(params);
  }
}

export class UpdateGroupAdminUseCase implements IUpdateGroupAdminUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupAdminRequestDTO): Promise<void> {
    return this._chatRepository.updateGroupAdmin(params);
  }
}

export class UpdateGroupSettingsUseCase implements IUpdateGroupSettingsUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupSettingsRequestDTO): Promise<void> {
    return this._chatRepository.updateGroupSettings(params);
  }
}

export class UpdateGroupInfoUseCase implements IUpdateGroupInfoUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupInfoRequestDTO): Promise<void> {
    return this._chatRepository.updateGroupInfo(params);
  }
}

export class LeaveGroupUseCase implements ILeaveGroupUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: LeaveGroupRequestDTO): Promise<void> {
    return this._chatRepository.leaveGroup(params);
  }
}

export class EditMessageUseCase implements IEditMessageUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: EditMessageRequestDTO): Promise<void> {
    return this._chatRepository.editMessage(params);
  }
}

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: DeleteMessageRequestDTO): Promise<void> {
    return this._chatRepository.deleteMessage(params);
  }
}

export class ReplyToMessageUseCase implements IReplyToMessageUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: ReplyToMessageRequestDTO): Promise<void> {
    return this._chatRepository.replyToMessage(params);
  }
}

export class DeleteChatUseCase implements IDeleteChatUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: DeleteChatRequestDTO): Promise<void> {
    return this._chatRepository.deleteChat(params);
  }
}

export class BlockChatUseCase implements IBlockChatUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: BlockChatRequestDTO): Promise<void> {
    return this._chatRepository.blockChat(params);
  }
}

export class ClearChatUseCase implements IClearChatUseCase {
  constructor(private _chatRepository: IChatRepository) { }

  async execute(params: ClearChatRequestDTO): Promise<void> {
    return this._chatRepository.clearChat(params);
  }
} 