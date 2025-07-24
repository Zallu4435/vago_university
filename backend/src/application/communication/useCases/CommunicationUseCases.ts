import mongoose from 'mongoose';
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
    if (!mongoose.isValidObjectId(params.userId)) {
      return { success: false, data: { error: "Invalid user ID" } };
    }
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      return { success: false, data: { error: "Invalid page or limit parameters" } };
    }
    const { messages, totalItems, totalPages, page, limit, userId } = await this.repository.getInboxMessages(params);
    const MessageStatus = require("../../../domain/communication/entities/Communication").MessageStatus;
    const mappedMessages = messages.map((message: any) => ({
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
        role: r.role,
        status: r.status || MessageStatus.Unread
      })),
      status: message.recipients.find((r: any) => r._id === userId)?.status || MessageStatus.Unread,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      isBroadcast: message.isBroadcast,
      attachments: message.attachments,
      recipientsCount: message.recipients.length
    }));
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
    if (!mongoose.isValidObjectId(params.userId)) {
      return { success: false, data: { error: "Invalid user ID" } };
    }
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      return { success: false, data: { error: "Invalid page or limit parameters" } };
    }
    const { messages, totalItems, totalPages, page, limit, userId } = await this.repository.getSentMessages(params);
    const MessageStatus = require("../../../domain/communication/entities/Communication").MessageStatus;
    const mappedMessages = messages.map((message: any) => ({
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
        role: r.role,
        status: r.status || MessageStatus.Unread
      })),
      status: message.recipients.find((r: any) => r._id === userId)?.status || MessageStatus.Unread,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      isBroadcast: message.isBroadcast,
      attachments: message.attachments,
      recipientsCount: message.recipients.length
    }));
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
    console.log('[SendMessageUseCase] execute called with params:', params);
    if (!mongoose.isValidObjectId(params.senderId)) {
      return { success: false, data: { error: "Invalid sender ID" } };
    }
    if (!params.subject || !params.content || !params.to.length) {
      return { success: false, data: { error: "Missing required fields" } };
    }
    console.log('[SendMessageUseCase] calling repository.sendMessage with params:', params);
    const message = await this.repository.sendMessage(params);
    return { success: true, data: message };
  }
}

export class MarkMessageAsReadUseCase implements IMarkMessageAsReadUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: MarkMessageAsReadRequestDTO): Promise<ResponseDTO<MarkMessageAsReadResponseDTO>> {
    if (!mongoose.isValidObjectId(params.messageId) || !mongoose.isValidObjectId(params.userId)) {
      return { success: false, data: { error: "Invalid message ID or user ID" } };
    }
    await this.repository.markMessageAsRead(params);
    return { success: true, data: { success: true, message: "Message marked as read" } };
  }
}

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: DeleteMessageRequestDTO): Promise<ResponseDTO<DeleteMessageResponseDTO>> {
    if (!mongoose.isValidObjectId(params.messageId) || !mongoose.isValidObjectId(params.userId)) {
      return { success: false, data: { error: "Invalid message ID or user ID" } };
    }
    await this.repository.deleteMessage(params);
    return { success: true, data: { success: true, message: "Message deleted successfully" } };
  }
}

export class GetMessageDetailsUseCase implements IGetMessageDetailsUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: GetMessageDetailsRequestDTO): Promise<ResponseDTO<GetMessageDetailsResponseDTO>> {
    if (!mongoose.isValidObjectId(params.messageId)) {
      return { success: false, data: { error: "Invalid message ID" } };
    }
    const message = await this.repository.getMessageDetails(params);
    if (!message) {
      return { success: false, data: { error: "Message not found" } };
    }
    return { success: true, data: message };
  }
}

export class GetAllAdminsUseCase implements IGetAllAdminsUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: GetAllAdminsRequestDTO): Promise<ResponseDTO<GetAllAdminsResponseDTO>> {
    const admins = await this.repository.getAllAdmins(params);
    const mappedAdmins = admins.map((admin: any) => ({
      _id: admin._id.toString(),
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      role: 'admin'
    }));
    return { success: true, data: { admins: mappedAdmins } };
  }
}

export class GetUserGroupsUseCase implements IGetUserGroupsUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: GetUserGroupsRequestDTO): Promise<ResponseDTO<GetUserGroupsResponseDTO>> {
    const groups = await this.repository.getUserGroups(params);
    return { success: true, data: { groups } };
  }
}

export class FetchUsersUseCase implements IFetchUsersUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: FetchUsersRequestDTO): Promise<ResponseDTO<FetchUsersResponseDTO>> {
    const users = await this.repository.fetchUsers(params);
    const mappedUsers = users.map((user: any) => ({
      _id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role
    }));
    return { success: true, data: { users: mappedUsers } };
  }
}