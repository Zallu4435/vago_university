import { ICommunicationRepository } from '../repositories/ICommunicationRepository';
import {
  GetInboxMessagesRequestDTO,
  GetSentMessagesRequestDTO,
  SendMessageRequestDTO,
  MarkMessageAsReadRequestDTO,
  DeleteMessageRequestDTO,
  GetMessageDetailsRequestDTO,
  GetAllAdminsRequestDTO,
  FetchUsersRequestDTO,
} from "../../../domain/communication/dtos/CommunicationRequestDTOs";
import {
  GetInboxMessagesResponseDTO,
  GetSentMessagesResponseDTO,
  SendMessageResponseDTO,
  MarkMessageAsReadResponseDTO,
  DeleteMessageResponseDTO,
  GetMessageDetailsResponseDTO,
  AdminSentMessageResponseDTO,
  GetAllAdminsResponseDTO,
  FetchUsersResponseDTO,
  ResponseDTO
} from "../../../domain/communication/dtos/CommunicationResponseDTOs";
import { UserRole } from '../../../domain/communication/entities/Communication';


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

export interface IFetchUsersUseCase {
  execute(params: FetchUsersRequestDTO): Promise<ResponseDTO<FetchUsersResponseDTO>>;
}
 
export class GetInboxMessagesUseCase implements IGetInboxMessagesUseCase {
  constructor(private readonly _repository: ICommunicationRepository) { }

  async execute(params: GetInboxMessagesRequestDTO): Promise<ResponseDTO<GetInboxMessagesResponseDTO>> {
    if (!params.userId || params.userId.trim() === "") {
      return { success: false, data: { error: "Invalid user ID" } };
    }
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      return { success: false, data: { error: "Invalid page or limit parameters" } };
    }
    const { messages, totalItems, totalPages, page, limit, userId } = await this._repository.getInboxMessages(params.userId, params.page, params.limit, params.search, params.status);
    const mappedMessages = messages.map((message) => mapMessageToDTO(message, false));
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
  constructor(private readonly _repository: ICommunicationRepository) { }

  async execute(params: GetSentMessagesRequestDTO): Promise<ResponseDTO<GetSentMessagesResponseDTO>> {
    if (!params.userId || params.userId.trim() === "") {
      return { success: false, data: { error: "Invalid user ID" } };
    }
    if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
      return { success: false, data: { error: "Invalid page or limit parameters" } };
    }
    const { messages, totalItems, totalPages, page, limit, userId } = await this._repository.getSentMessages(params.userId, params.page, params.limit, params.search, params.status);
    
    if (!messages || !Array.isArray(messages)) {
      console.error('Repository returned invalid messages:', messages);
      return { 
        success: false, 
        data: { error: "Failed to retrieve messages from database" } 
      };
    }

    try {
      const mappedMessages = messages.map((message) => mapMessageToAdminSentDTO(message));
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
    } catch (error) {
      console.error('Error mapping messages to DTO:', error);
      return { 
        success: false, 
        data: { error: "Failed to process message data" } 
      };
    }
  }
}

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(private readonly _repository: ICommunicationRepository) { }

  async execute(params: SendMessageRequestDTO): Promise<ResponseDTO<SendMessageResponseDTO>> {
    try {
    if (!params.senderId || params.senderId.trim() === "") {
      return { success: false, data: { error: "Invalid sender ID" } };
    }
    if (!params.subject || !params.content || !params.to.length) {
      return { success: false, data: { error: "Missing required fields" } };
    }

      let sentMessage;

      if (params.senderRole === 'user') {
        sentMessage = await this._repository.sendUserMessage(
          params.senderId,
          params.senderRole,
          params.to,
          params.subject,
          params.content,
          params.attachments
        );
      } else {
        sentMessage = await this._repository.sendMessage(
      params.senderId,
      params.senderRole,
      params.to,
      params.subject,
      params.content,
      params.attachments
    );
      }

      const mappedMessage = mapMessageToDTO(sentMessage, false);

    return {
      success: true,
        data: mappedMessage
    };
    } catch (error) {
      throw error;
    }
  }
}

export class MarkMessageAsReadUseCase implements IMarkMessageAsReadUseCase {
  constructor(private readonly _repository: ICommunicationRepository) { }

  async execute(params: MarkMessageAsReadRequestDTO): Promise<ResponseDTO<MarkMessageAsReadResponseDTO>> {
    if (!params.messageId || params.messageId.trim() === "" || !params.userId || params.userId.trim() === "") {
      return { success: false, data: { error: "Invalid message ID or user ID" } };
    }
    await this._repository.markMessageAsRead(params.messageId, params.userId);
    return { success: true, data: { success: true, message: "Message marked as read" } };
  }
}

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(private readonly _repository: ICommunicationRepository) { }

  async execute(params: DeleteMessageRequestDTO): Promise<ResponseDTO<DeleteMessageResponseDTO>> {
    if (!params.messageId || params.messageId.trim() === "" || !params.userId || params.userId.trim() === "") {
      return { success: false, data: { error: "Invalid message ID or user ID" } };
    }
    await this._repository.deleteMessage(params.messageId, params.userId);
    return { success: true, data: { success: true, message: "Message deleted successfully" } };
  }
}

export class GetMessageDetailsUseCase implements IGetMessageDetailsUseCase {
  constructor(private readonly _repository: ICommunicationRepository) { }

  async execute(params: GetMessageDetailsRequestDTO): Promise<ResponseDTO<GetMessageDetailsResponseDTO>> {
    if (!params.messageId || params.messageId.trim() === "") {
      return { success: false, data: { error: "Invalid message ID" } };
    }
    const message = await this._repository.getMessageDetails(params.messageId);
    if (!message) {
      return { success: false, data: { error: "Message not found" } };
    }
    return { success: true, data: mapMessageToDTO(message, false) };
  }
}


export class GetAllAdminsUseCase implements IGetAllAdminsUseCase {
  constructor(private readonly _repository: ICommunicationRepository) { }

  async execute(params: GetAllAdminsRequestDTO): Promise<ResponseDTO<GetAllAdminsResponseDTO>> {
    try {
    const admins = await this._repository.getAllAdmins(params.search);
      return { success: true, data: { admins } };
    } catch (error) {
      throw error;
    }
  }
}

export class FetchUsersUseCase implements IFetchUsersUseCase {
  constructor(private readonly _repository: ICommunicationRepository) { }

  async execute(params: FetchUsersRequestDTO): Promise<ResponseDTO<FetchUsersResponseDTO>> {
    const users = await this._repository.fetchUsers(params.type, params.search);
    const mappedUsers = users.map((user) => ({
      id: user._id,  
      email: user.email,
      name: user.name
    }));
    return { success: true, data: { users: mappedUsers } };
  }
}

export function mapMessageToDTO(message, hideRecipients: boolean = false): GetMessageDetailsResponseDTO {
  if (!message) {
    throw new Error('Message object is undefined or null');
  }

  const recipients = Array.isArray(message.recipients) ? message.recipients : [];
  const attachments = Array.isArray(message.attachments) ? message.attachments : [];

  const mappedRecipients = recipients.map((r) => ({
    _id: r._id.toString(),
    name: r.name,
    email: r.email,
    role: r.role as UserRole
  }));

      return {
      _id: message._id.toString(),
      subject: message.subject,
      content: message.content,
      sender: message.sender ? {
        _id: message.sender._id.toString(),
        name: message.sender.name,
        email: message.sender.email,
        role: message.sender.role as UserRole
      } : undefined,
      recipients: mappedRecipients,
      recipientCount: recipients.length,
      isBroadcast: message.isBroadcast || false,
      attachments,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    };
}

export function mapMessageToAdminSentDTO(message): AdminSentMessageResponseDTO {
  if (!message) {
    throw new Error('Message object is undefined or null');
  }

  const recipients = Array.isArray(message.recipients) ? message.recipients : [];
  const attachments = Array.isArray(message.attachments) ? message.attachments : [];

  let recipientsDisplay = '';
  if (recipients.length > 0) {
    if (message.isBroadcast || recipients.length > 10) {
      if (recipients.some(r => r.role === 'student')) {
          recipientsDisplay = 'All Students';
      } else if (recipients.some(r => r.role === 'admin')) {
          recipientsDisplay = 'All Admins';
        } else {
          recipientsDisplay = 'All Users';
        }
    } else if (recipients.length === 1) {
      recipientsDisplay = recipients[0].email;
    } else {
      recipientsDisplay = 'Multiple Recipients';
    }
  }

  return {
    _id: message._id.toString(),
    subject: message.subject,
    content: message.content,
    recipients: recipientsDisplay,
    recipientCount: recipients.length,
    isBroadcast: message.isBroadcast || false,
    attachments,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt
  };
}
