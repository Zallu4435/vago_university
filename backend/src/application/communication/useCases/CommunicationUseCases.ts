import { ICommunicationRepository } from '../repositories/ICommunicationRepository';
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
} from "../../../domain/communication/dtos/CommunicationResponseDTOs";
import { UserRole } from '../../../domain/communication/entities/Communication';

export interface ResponseDTO<T> {
  success: boolean;
  data: T | { error: string };
}


export interface IGetInboxMessagesUseCase {
  execute(params: GetInboxMessagesRequestDTO): Promise<ResponseDTO<GetInboxMessagesResponseDTO>>;
}

export interface IGetSentMessagesUseCase {
  execute(params: GetSentMessagesRequestDTO): Promise<ResponseDTO<GetSentMessagesResponseDTO>>;
}

export interface ISendMessageUseCase {
  execute(params: SendMessageRequestDTO): Promise<ResponseDTO<SendMessageResponseDTO>>;
}

export interface IMarkMessageAsReadUseCase {
  execute(params: MarkMessageAsReadRequestDTO): Promise<ResponseDTO<MarkMessageAsReadResponseDTO>>;
}

export interface IDeleteMessageUseCase {
  execute(params: DeleteMessageRequestDTO): Promise<ResponseDTO<DeleteMessageResponseDTO>>;
}

export interface IGetMessageDetailsUseCase {
  execute(params: GetMessageDetailsRequestDTO): Promise<ResponseDTO<GetMessageDetailsResponseDTO>>;
}

export interface IGetAllAdminsUseCase {
  execute(params: GetAllAdminsRequestDTO): Promise<ResponseDTO<GetAllAdminsResponseDTO>>;
}

export interface IGetUserGroupsUseCase {
  execute(params: GetUserGroupsRequestDTO): Promise<ResponseDTO<GetUserGroupsResponseDTO>>;
}

export interface IFetchUsersUseCase {
  execute(params: FetchUsersRequestDTO): Promise<ResponseDTO<FetchUsersResponseDTO>>;
}
 
export class GetInboxMessagesUseCase implements IGetInboxMessagesUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: GetInboxMessagesRequestDTO): Promise<ResponseDTO<GetInboxMessagesResponseDTO>> {
    if (!params.userId || params.userId.trim() === "") {
      return { success: false, data: { error: "Invalid user ID" } };
    }
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      return { success: false, data: { error: "Invalid page or limit parameters" } };
    }
    const { messages, totalItems, totalPages, page, limit, userId } = await this.repository.getInboxMessages(params.userId, params.page, params.limit, params.search, params.status);
    const mappedMessages = messages.map(mapMessageToDTO);
    return {
      success: true,
      data: {
        messages: mappedMessages,
        pagination: {
          total: totalItems,
          page,
          limit,
          totalPages
        }
      }
    };
  }
}

export class GetSentMessagesUseCase implements IGetSentMessagesUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: GetSentMessagesRequestDTO): Promise<ResponseDTO<GetSentMessagesResponseDTO>> {
    if (!params.userId || params.userId.trim() === "") {
      return { success: false, data: { error: "Invalid user ID" } };
    }
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      return { success: false, data: { error: "Invalid page or limit parameters" } };
    }
    const { messages, totalItems, totalPages, page, limit, userId } = await this.repository.getSentMessages(params.userId, params.page, params.limit, params.search, params.status);
    const mappedMessages = messages.map(mapMessageToDTO);
    return {
      success: true,
      data: {
        messages: mappedMessages,
        pagination: {
          total: totalItems,
          page,
          limit,
          totalPages
        }
      }
    };
  }
}

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: SendMessageRequestDTO): Promise<ResponseDTO<SendMessageResponseDTO>> {
    if (!params.senderId || params.senderId.trim() === "") {
      return { success: false, data: { error: "Invalid sender ID" } };
    }
    if (!params.subject || !params.content || !params.to.length) {
      return { success: false, data: { error: "Missing required fields" } };
    }
    const sentMessage = await this.repository.sendMessage(
      params.senderId,
      params.senderRole,
      params.to,
      params.subject,
      params.content,
      params.attachments
    );
    return {
      success: true,
      data: mapMessageToDTO(sentMessage)
    };
  }
}

export class MarkMessageAsReadUseCase implements IMarkMessageAsReadUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: MarkMessageAsReadRequestDTO): Promise<ResponseDTO<MarkMessageAsReadResponseDTO>> {
    if (!params.messageId || params.messageId.trim() === "" || !params.userId || params.userId.trim() === "") {
      return { success: false, data: { error: "Invalid message ID or user ID" } };
    }
    await this.repository.markMessageAsRead(params.messageId, params.userId);
    return { success: true, data: { success: true, message: "Message marked as read" } };
  }
}

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: DeleteMessageRequestDTO): Promise<ResponseDTO<DeleteMessageResponseDTO>> {
    if (!params.messageId || params.messageId.trim() === "" || !params.userId || params.userId.trim() === "") {
      return { success: false, data: { error: "Invalid message ID or user ID" } };
    }
    await this.repository.deleteMessage(params.messageId, params.userId);
    return { success: true, data: { success: true, message: "Message deleted successfully" } };
  }
}

export class GetMessageDetailsUseCase implements IGetMessageDetailsUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: GetMessageDetailsRequestDTO): Promise<ResponseDTO<GetMessageDetailsResponseDTO>> {
    if (!params.messageId || params.messageId.trim() === "") {
      return { success: false, data: { error: "Invalid message ID" } };
    }
    const message = await this.repository.getMessageDetails(params.messageId);
    if (!message) {
      return { success: false, data: { error: "Message not found" } };
    }
    return { success: true, data: mapMessageToDTO(message) };
  }
}

export class GetAllAdminsUseCase implements IGetAllAdminsUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: GetAllAdminsRequestDTO): Promise<ResponseDTO<GetAllAdminsResponseDTO>> {
    const admins = await this.repository.getAllAdmins(params.search);
    const mappedAdmins = admins.map((admin) => ({
      _id: admin._id.toString(),
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      role: 'admin' as UserRole
    }));
    return { success: true, data: { admins: mappedAdmins } };
  }
}

export class GetUserGroupsUseCase implements IGetUserGroupsUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: GetUserGroupsRequestDTO): Promise<ResponseDTO<GetUserGroupsResponseDTO>> {
    const groups = await this.repository.getUserGroups(params.search);
    return { success: true, data: { groups } };
  }
}

export class FetchUsersUseCase implements IFetchUsersUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: FetchUsersRequestDTO): Promise<ResponseDTO<FetchUsersResponseDTO>> {
    const users = await this.repository.fetchUsers(params.type, params.search);
    const mappedUsers = users.map((user) => ({
      _id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role
    }));
    return { success: true, data: { users: mappedUsers } };
  }
}

export function mapMessageToDTO(message): GetMessageDetailsResponseDTO {
  return {
    _id: message._id.toString(),
    subject: message.subject,
    content: message.content,
    sender: {
      _id: message.sender._id.toString(),
      name: message.sender.name,
      email: message.sender.email,
      role: message.sender.role as UserRole
    },
    recipients: message.recipients.map((r) => ({
      _id: r._id.toString(),
      name: r.name,
      email: r.email,
      role: r.role as UserRole
    })),
    isBroadcast: message.isBroadcast,
    attachments: message.attachments,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString()
  };
}
