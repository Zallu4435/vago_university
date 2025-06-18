import { Message, UserInfo } from "../../../domain/communication/entities/Communication";
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

export interface ICommunicationRepository {
  getInboxMessages(params: GetInboxMessagesRequestDTO): Promise<GetInboxMessagesResponseDTO>;
  getSentMessages(params: GetSentMessagesRequestDTO): Promise<GetSentMessagesResponseDTO>;
  sendMessage(params: SendMessageRequestDTO): Promise<SendMessageResponseDTO>;
  deleteMessage(params: DeleteMessageRequestDTO): Promise<DeleteMessageResponseDTO>;
  getMessageDetails(params: GetMessageDetailsRequestDTO): Promise<GetMessageDetailsResponseDTO>;
  markMessageAsRead(params: MarkMessageAsReadRequestDTO): Promise<MarkMessageAsReadResponseDTO>;
  getAllAdmins(params: GetAllAdminsRequestDTO): Promise<GetAllAdminsResponseDTO>;
  getUserGroups(params: GetUserGroupsRequestDTO): Promise<GetUserGroupsResponseDTO>;
  fetchUsers(params: FetchUsersRequestDTO): Promise<FetchUsersResponseDTO>;
  
  // Helper methods
  findUserById(userId: string, role: string): Promise<UserInfo | null>;
  findUsersByGroup(group: string): Promise<UserInfo[]>;
  findMessageById(messageId: string): Promise<Message | null>;
  createMessage(message: Message): Promise<void>;
  updateMessageRecipientStatus(messageId: string, userId: string, status: string): Promise<void>;
  findAdmins(search?: string): Promise<UserInfo[]>;
  findUsersByType(type: string, search?: string, requesterId?: string): Promise<UserInfo[]>;
}