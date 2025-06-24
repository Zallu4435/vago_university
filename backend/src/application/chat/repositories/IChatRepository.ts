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

export interface IChatRepository {
  getChats(params: GetChatsRequestDTO): Promise<GetChatsResponseDTO>;
  searchChats(params: SearchChatsRequestDTO): Promise<GetChatsResponseDTO>;
  getChatMessages(params: GetChatMessagesRequestDTO): Promise<GetChatMessagesResponseDTO>;
  sendMessage(params: SendMessageRequestDTO): Promise<void>;
  markMessagesAsRead(params: MarkMessagesAsReadRequestDTO): Promise<void>;
  addReaction(params: AddReactionRequestDTO): Promise<void>;
  removeReaction(params: RemoveReactionRequestDTO): Promise<void>;
  getChatDetails(chatId: string, userId: string): Promise<ChatDetailsResponseDTO | null>;
  searchUsers(params: SearchUsersRequestDTO): Promise<SearchUsersResponseDTO>;
  createChat(params: CreateChatRequestDTO): Promise<ChatSummaryDTO>;
  createGroupChat(params: CreateGroupChatRequestDTO): Promise<ChatSummaryDTO>;
  addGroupMember(params: AddGroupMemberRequestDTO): Promise<void>;
  removeGroupMember(params: RemoveGroupMemberRequestDTO): Promise<void>;
  updateGroupAdmin(params: UpdateGroupAdminRequestDTO): Promise<void>;
  updateGroupSettings(params: UpdateGroupSettingsRequestDTO): Promise<void>;
  updateGroupInfo(params: UpdateGroupInfoRequestDTO): Promise<void>;
  leaveGroup(params: LeaveGroupRequestDTO): Promise<void>;
  editMessage(params: EditMessageRequestDTO): Promise<void>;
  deleteMessage(params: DeleteMessageRequestDTO): Promise<void>;
  replyToMessage(params: ReplyToMessageRequestDTO): Promise<void>;
  deleteChat(params: DeleteChatRequestDTO): Promise<void>;
  blockChat(params: BlockChatRequestDTO): Promise<void>;
  clearChat(params: ClearChatRequestDTO): Promise<void>;
} 