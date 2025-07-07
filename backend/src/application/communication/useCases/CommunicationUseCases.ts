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
import { Message, MessageStatus, UserRole, UserInfo } from "../../../domain/communication/entities/Communication";

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
    try {
      if (!mongoose.isValidObjectId(params.userId)) {
        return { success: false, data: { error: "Invalid user ID" } };
      }
      if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
        return { success: false, data: { error: "Invalid page or limit parameters" } };
      }
      const result = await this.repository.getInboxMessages(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetSentMessagesUseCase implements IGetSentMessagesUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: GetSentMessagesRequestDTO): Promise<ResponseDTO<GetSentMessagesResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.userId)) {
        return { success: false, data: { error: "Invalid user ID" } };
      }
      if (isNaN(params.page) || params.page < 1 || isNaN(params.limit) || params.limit < 1) {
        return { success: false, data: { error: "Invalid page or limit parameters" } };
      }
      const result = await this.repository.getSentMessages(params);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: SendMessageRequestDTO): Promise<ResponseDTO<SendMessageResponseDTO>> {
    try {
      console.log('SendMessageUseCase - Starting with params:', params);

      if (!mongoose.isValidObjectId(params.senderId)) {
        console.error('SendMessageUseCase - Invalid sender ID:', params.senderId);
        return { success: false, data: { error: "Invalid sender ID" } };
      }
      if (!params.subject || !params.content || !params.to.length) {
        console.error('SendMessageUseCase - Missing required fields');
        return { success: false, data: { error: "Missing required fields" } };
      }

      console.log('SendMessageUseCase - Finding sender');
      const sender = await this.repository.findUserById(params.senderId, params.senderRole);
      console.log('SendMessageUseCase - Found sender:', sender);

      if (!sender) {
        console.error('SendMessageUseCase - Sender not found');
        return { success: false, data: { error: "Sender not found" } };
      }

      console.log('SendMessageUseCase - Processing message type');
      // Let the repository handle the recipient processing
      const message = await this.repository.sendMessage(params);
      console.log('SendMessageUseCase - Message created and saved');

      return { success: true, data: message };
    } catch (error: any) {
      console.error('SendMessageUseCase - Error:', error);
      return { success: false, data: { error: error.message } };
    }
  }
}

export class MarkMessageAsReadUseCase implements IMarkMessageAsReadUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: MarkMessageAsReadRequestDTO): Promise<ResponseDTO<MarkMessageAsReadResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.messageId) || !mongoose.isValidObjectId(params.userId)) {
        return { success: false, data: { error: "Invalid message ID or user ID" } };
      }

      const message = await this.repository.findMessageById(params.messageId);
      if (!message || !message.isRecipient(params.userId)) {
        return { success: false, data: { error: "Message not found or user is not a recipient" } };
      }

      const recipient = message.recipients.find(r => r._id === params.userId);
      if (recipient?.status === MessageStatus.Read) {
        return { success: true, data: { success: true, message: "Message already marked as read" } };
      }

      await this.repository.updateMessageRecipientStatus(params.messageId, params.userId, MessageStatus.Read);

      return { success: true, data: { success: true, message: "Message marked as read" } };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: DeleteMessageRequestDTO): Promise<ResponseDTO<DeleteMessageResponseDTO>> {
    try {
      console.log('=== DeleteMessageUseCase DEBUG ===');
      console.log('Params received:', params);
      console.log('MessageId valid:', mongoose.isValidObjectId(params.messageId));
      console.log('UserId valid:', mongoose.isValidObjectId(params.userId));
      console.log('==================================');
      
      if (!mongoose.isValidObjectId(params.messageId) || !mongoose.isValidObjectId(params.userId)) {
        console.log('Invalid message ID or user ID');
        return { success: false, data: { error: "Invalid message ID or user ID" } };
      }

      const message = await this.repository.findMessageById(params.messageId);
      console.log('Found message:', message ? 'Yes' : 'No');
      
      if (!message || !message.canAccess(params.userId)) {
        console.log('Message not found or user does not have access');
        return { success: false, data: { error: "Message not found or user does not have access" } };
      }

      console.log('Calling repository deleteMessage...');
      await this.repository.deleteMessage(params);
      console.log('Repository deleteMessage completed successfully');

      return { success: true, data: { success: true, message: "Message deleted successfully" } };
    } catch (error: any) {
      console.error('DeleteMessageUseCase error:', error);
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetMessageDetailsUseCase implements IGetMessageDetailsUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: GetMessageDetailsRequestDTO): Promise<ResponseDTO<GetMessageDetailsResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.messageId) || !mongoose.isValidObjectId(params.userId)) {
        return { success: false, data: { error: "Invalid message ID or user ID" } };
      }

      const message = await this.repository.findMessageById(params.messageId);
      if (!message || !message.canAccess(params.userId)) {
        return { success: false, data: { error: "Message not found or user does not have access" } };
      }

      return { success: true, data: message };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetAllAdminsUseCase implements IGetAllAdminsUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: GetAllAdminsRequestDTO): Promise<ResponseDTO<GetAllAdminsResponseDTO>> {
    try {
      console.log('GetAllAdminsUseCase - Executing with params:', params);
      const response = await this.repository.getAllAdmins(params);
      console.log('GetAllAdminsUseCase - Repository response:', response);
      return { success: true, data: response };
    } catch (error: any) {
      console.error('GetAllAdminsUseCase - Error:', error);
      return { success: false, data: { error: error.message } };
    }
  }
}

export class GetUserGroupsUseCase implements IGetUserGroupsUseCase {
  async execute(params: GetUserGroupsRequestDTO): Promise<ResponseDTO<GetUserGroupsResponseDTO>> {
    try {
      const groups = [
        { value: 'all-students', label: 'All Students' },
        { value: 'all-faculty', label: 'All Faculty' },
        { value: 'all-staff', label: 'All Staff' },
        { value: 'freshman', label: 'Freshman Students' },
        { value: 'sophomore', label: 'Sophomore Students' },
        { value: 'junior', label: 'Junior Students' },
        { value: 'senior', label: 'Senior Students' },
        { value: 'individual', label: 'Individual User' },
      ];

      const filteredGroups = params.search
        ? groups.filter(group => 
            group.label.toLowerCase().includes(params.search!.toLowerCase()) ||
            group.value.toLowerCase().includes(params.search!.toLowerCase())
          )
        : groups;

      return { success: true, data: { groups: filteredGroups } };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
}

export class FetchUsersUseCase implements IFetchUsersUseCase {
  constructor(private readonly repository: ICommunicationRepository) { }

  async execute(params: FetchUsersRequestDTO): Promise<ResponseDTO<FetchUsersResponseDTO>> {
    try {
      if (!mongoose.isValidObjectId(params.requesterId)) {
        return { success: false, data: { error: "Invalid requester ID" } };
      }

      const users = await this.repository.findUsersByType(params.type, params.search, params.requesterId);
      return { success: true, data: { users } };
    } catch (error: any) {
      return { success: false, data: { error: error.message } };
    }
  }
  }