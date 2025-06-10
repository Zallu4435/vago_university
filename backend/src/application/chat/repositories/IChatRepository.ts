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
} from "../../../domain/chat/dtos/ChatRequestDTOs";
import {
  GetChatsResponseDTO,
  GetChatMessagesResponseDTO,
  ChatDetailsResponseDTO,
  SearchUsersResponseDTO,
  ChatSummaryDTO,
} from "../../../domain/chat/dtos/ChatResponseDTOs";

export interface IChatRepository {
  getChats(params: GetChatsRequestDTO): Promise<GetChatsResponseDTO>;
  searchChats(params: SearchChatsRequestDTO): Promise<GetChatsResponseDTO>;
  getChatMessages(params: GetChatMessagesRequestDTO): Promise<GetChatMessagesResponseDTO>;
  sendMessage(params: SendMessageRequestDTO): Promise<void>;
  markMessagesAsRead(params: MarkMessagesAsReadRequestDTO): Promise<void>;
  addReaction(params: AddReactionRequestDTO): Promise<void>;
  removeReaction(params: RemoveReactionRequestDTO): Promise<void>;
  getChatDetails(chatId: string): Promise<ChatDetailsResponseDTO | null>;
  searchUsers(params: SearchUsersRequestDTO): Promise<SearchUsersResponseDTO>;
  createChat(params: CreateChatRequestDTO): Promise<ChatSummaryDTO>;
} 