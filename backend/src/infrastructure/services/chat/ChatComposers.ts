import { ChatController } from "../../../presentation/http/chat/ChatController";
import { ChatRepository } from "../../repositories/chat/ChatRepository";
import {
  GetChatsUseCase,
  SearchChatsUseCase,
  GetChatMessagesUseCase,
  SendMessageUseCase,
  MarkMessagesAsReadUseCase,
  AddReactionUseCase,
  RemoveReactionUseCase,
  GetChatDetailsUseCase,
  SearchUsersUseCase,
  CreateChatUseCase,
  CreateGroupChatUseCase,
  AddGroupMemberUseCase,
  RemoveGroupMemberUseCase,
  UpdateGroupAdminUseCase,
  UpdateGroupSettingsUseCase,
  UpdateGroupInfoUseCase,
  LeaveGroupUseCase,
  EditMessageUseCase,
  DeleteMessageUseCase,
  ReplyToMessageUseCase
} from "../../../application/chat/useCases/ChatUseCases";

export const getChatComposer = () => {
  const chatRepository = new ChatRepository();
  
  const getChatsUseCase = new GetChatsUseCase(chatRepository);
  const searchChatsUseCase = new SearchChatsUseCase(chatRepository);
  const getChatMessagesUseCase = new GetChatMessagesUseCase(chatRepository);
  const sendMessageUseCase = new SendMessageUseCase(chatRepository);
  const markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(chatRepository);
  const addReactionUseCase = new AddReactionUseCase(chatRepository);
  const removeReactionUseCase = new RemoveReactionUseCase(chatRepository);
  const getChatDetailsUseCase = new GetChatDetailsUseCase(chatRepository);
  const searchUsersUseCase = new SearchUsersUseCase(chatRepository);
  const createChatUseCase = new CreateChatUseCase(chatRepository);
  const createGroupChatUseCase = new CreateGroupChatUseCase(chatRepository);
  const addGroupMemberUseCase = new AddGroupMemberUseCase(chatRepository);
  const removeGroupMemberUseCase = new RemoveGroupMemberUseCase(chatRepository);
  const updateGroupAdminUseCase = new UpdateGroupAdminUseCase(chatRepository);
  const updateGroupSettingsUseCase = new UpdateGroupSettingsUseCase(chatRepository);
  const updateGroupInfoUseCase = new UpdateGroupInfoUseCase(chatRepository);
  const leaveGroupUseCase = new LeaveGroupUseCase(chatRepository);
  const editMessageUseCase = new EditMessageUseCase(chatRepository);
  const deleteMessageUseCase = new DeleteMessageUseCase(chatRepository);
  const replyToMessageUseCase = new ReplyToMessageUseCase(chatRepository);

  return new ChatController(
    getChatsUseCase,
    searchChatsUseCase,
    getChatMessagesUseCase,
    sendMessageUseCase,
    markMessagesAsReadUseCase,
    addReactionUseCase,
    removeReactionUseCase,
    getChatDetailsUseCase,
    searchUsersUseCase,
    createChatUseCase,
    createGroupChatUseCase,
    addGroupMemberUseCase,
    removeGroupMemberUseCase,
    updateGroupAdminUseCase,
    updateGroupSettingsUseCase,
    updateGroupInfoUseCase,
    leaveGroupUseCase,
    editMessageUseCase,
    deleteMessageUseCase,
    replyToMessageUseCase
  );
}; 