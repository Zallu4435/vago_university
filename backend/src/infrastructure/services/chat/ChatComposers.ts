import { ChatController } from "../../../presentation/http/chat/ChatController";
import { ChatRepository } from "../../../infrastructure/repositories/chat/ChatRepository";
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
} from "../../../application/chat/useCases/ChatUseCases";

export function getChatComposer(): ChatController {
  const repository = new ChatRepository();
  const getChatsUseCase = new GetChatsUseCase(repository);
  const searchChatsUseCase = new SearchChatsUseCase(repository);
  const getChatMessagesUseCase = new GetChatMessagesUseCase(repository);
  const sendMessageUseCase = new SendMessageUseCase(repository);
  const markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(repository);
  const addReactionUseCase = new AddReactionUseCase(repository);
  const removeReactionUseCase = new RemoveReactionUseCase(repository);
  const getChatDetailsUseCase = new GetChatDetailsUseCase(repository);
  const searchUsersUseCase = new SearchUsersUseCase(repository);
  const createChatUseCase = new CreateChatUseCase(repository);

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
    createChatUseCase
  );
} 