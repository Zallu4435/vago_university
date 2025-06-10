import { IChatRepository } from "../repositories/IChatRepository";
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

export class GetChatsUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(params: GetChatsRequestDTO): Promise<GetChatsResponseDTO> {
    console.log('GetChatsUseCase - Executing with params:', params);
    try {
      const result = await this.chatRepository.getChats(params);
      console.log('GetChatsUseCase - Result:', result);
      return result;
    } catch (error) {
      console.error('GetChatsUseCase - Error:', error);
      throw error;
    }
  }
}

export class SearchChatsUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(params: SearchChatsRequestDTO): Promise<GetChatsResponseDTO> {
    return this.chatRepository.searchChats(params);
  }
}

export class GetChatMessagesUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(params: GetChatMessagesRequestDTO): Promise<GetChatMessagesResponseDTO> {
    return this.chatRepository.getChatMessages(params);
  }
}

export class SendMessageUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(params: SendMessageRequestDTO): Promise<void> {
    return this.chatRepository.sendMessage(params);
  }
}

export class MarkMessagesAsReadUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(params: MarkMessagesAsReadRequestDTO): Promise<void> {
    return this.chatRepository.markMessagesAsRead(params);
  }
}

export class AddReactionUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(params: AddReactionRequestDTO): Promise<void> {
    return this.chatRepository.addReaction(params);
  }
}

export class RemoveReactionUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(params: RemoveReactionRequestDTO): Promise<void> {
    return this.chatRepository.removeReaction(params);
  }
}

export class GetChatDetailsUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(chatId: string): Promise<ChatDetailsResponseDTO | null> {
    return this.chatRepository.getChatDetails(chatId);
  }
}

export class SearchUsersUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(params: SearchUsersRequestDTO): Promise<SearchUsersResponseDTO> {
    console.log('=== Search Users UseCase Started ===');
    console.log('SearchUsersUseCase - Executing with params:', params);
    try {
      const result = await this.chatRepository.searchUsers(params);
      console.log('SearchUsersUseCase - Result:', result);
      console.log('=== Search Users UseCase Ended ===');
      return result;
    } catch (error) {
      console.error('SearchUsersUseCase - Error:', error);
      throw error;
    }
  }
}

export class CreateChatUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(params: CreateChatRequestDTO): Promise<ChatSummaryDTO> {
    console.log('CreateChatUseCase - Executing with params:', params);
    try {
      const result = await this.chatRepository.createChat(params);
      console.log('CreateChatUseCase - Result:', result);
      return result;
    } catch (error) {
      console.error('CreateChatUseCase - Error:', error);
      throw error;
    }
  }
} 