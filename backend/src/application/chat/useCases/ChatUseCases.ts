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

export class GetChatsUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: GetChatsRequestDTO): Promise<GetChatsResponseDTO> {
    try {
      const result = await this.chatRepository.getChats(params);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export class SearchChatsUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: SearchChatsRequestDTO): Promise<GetChatsResponseDTO> {
    return this.chatRepository.searchChats(params);
  }
}

export class GetChatMessagesUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: GetChatMessagesRequestDTO): Promise<GetChatMessagesResponseDTO> {
    return this.chatRepository.getChatMessages(params);
  }
}

export class SendMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: SendMessageRequestDTO): Promise<void> {
    return this.chatRepository.sendMessage(params);
  }
}

export class MarkMessagesAsReadUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: MarkMessagesAsReadRequestDTO): Promise<void> {
    return this.chatRepository.markMessagesAsRead(params);
  }
}

export class AddReactionUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: AddReactionRequestDTO): Promise<void> {
    return this.chatRepository.addReaction(params);
  }
}

export class RemoveReactionUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: RemoveReactionRequestDTO): Promise<void> {
    return this.chatRepository.removeReaction(params);
  }
}

export class GetChatDetailsUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(chatId: string, userId: string): Promise<ChatDetailsResponseDTO | null> {
    return this.chatRepository.getChatDetails(chatId, userId);
  }
}

export class SearchUsersUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: SearchUsersRequestDTO): Promise<SearchUsersResponseDTO> {
    try {
      const result = await this.chatRepository.searchUsers(params);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export class CreateChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: CreateChatRequestDTO): Promise<ChatSummaryDTO> {
    try {
      const result = await this.chatRepository.createChat(params);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export class CreateGroupChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: CreateGroupChatRequestDTO): Promise<ChatSummaryDTO> {
    try {
      const result = await this.chatRepository.createGroupChat(params);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export class AddGroupMemberUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: AddGroupMemberRequestDTO): Promise<void> {
    try {
      await this.chatRepository.addGroupMember(params);
    } catch (error) {
      throw error;
    }
  }
}

export class RemoveGroupMemberUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: RemoveGroupMemberRequestDTO): Promise<void> {
    try {
      await this.chatRepository.removeGroupMember(params);
    } catch (error) {
      throw error;
    }
  }
}

export class UpdateGroupAdminUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupAdminRequestDTO): Promise<void> {
    try {
      await this.chatRepository.updateGroupAdmin(params);
    } catch (error) {
      throw error;
    }
  }
}

export class UpdateGroupSettingsUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupSettingsRequestDTO): Promise<void> {
    try {
      await this.chatRepository.updateGroupSettings(params);
    } catch (error) {
      throw error;
    }
  }
}

export class UpdateGroupInfoUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupInfoRequestDTO): Promise<void> {
    try {
      await this.chatRepository.updateGroupInfo(params);
    } catch (error) {
      throw error;
    }
  }
}

export class LeaveGroupUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: LeaveGroupRequestDTO): Promise<void> {
    try {
      await this.chatRepository.leaveGroup(params);
    } catch (error) {
      throw error;
    }
  }
}

export class EditMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: EditMessageRequestDTO): Promise<void> {
    try {
      await this.chatRepository.editMessage(params);
    } catch (error) {
      throw error;
    }
  }
}

export class DeleteMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: DeleteMessageRequestDTO): Promise<void> {
    console.log('[DeleteMessageUseCase] execute called with:', params);
    try {
      await this.chatRepository.deleteMessage(params);
    } catch (error) {
      console.error('[DeleteMessageUseCase] Error:', error, '\nParams:', params);
      throw error;
    }
  }
}

export class ReplyToMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: ReplyToMessageRequestDTO): Promise<void> {
    try {
      await this.chatRepository.replyToMessage(params);
    } catch (error) {
      throw error;
    }
  }
}

export class DeleteChatUseCase {
  constructor(private chatRepository: IChatRepository) { }
  async execute(params: DeleteChatRequestDTO): Promise<void> {
    try {
      await this.chatRepository.deleteChat(params);
    } catch (error) {
      throw error;
    }
  }
}

export class BlockChatUseCase {
  constructor(private chatRepository: IChatRepository) { }
  async execute(params: BlockChatRequestDTO): Promise<void> {
    try {
      await this.chatRepository.blockChat(params);
    } catch (error) {
      throw error;
    }
  }
}

export class ClearChatUseCase {
  constructor(private chatRepository: IChatRepository) { }
  async execute(params: ClearChatRequestDTO): Promise<void> {
    try {
      await this.chatRepository.clearChat(params);
    } catch (error) {
      throw error;
    }
  }
} 