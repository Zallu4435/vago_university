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
    // console.log('GetChatsUseCase - Executing with params:', params);
    try {
      const result = await this.chatRepository.getChats(params);
      // console.log('GetChatsUseCase - Result:', result);
      return result;
    } catch (error) {
      console.error('GetChatsUseCase - Error:', error);
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
    // console.log('=== Search Users UseCase Started ===');
    // console.log('SearchUsersUseCase - Executing with params:', params);
    try {
      const result = await this.chatRepository.searchUsers(params);
      // console.log('SearchUsersUseCase - Result:', result);
      // console.log('=== Search Users UseCase Ended ===');
      return result;
    } catch (error) {
      console.error('SearchUsersUseCase - Error:', error);
      throw error;
    }
  }
}

export class CreateChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: CreateChatRequestDTO): Promise<ChatSummaryDTO> {
    // console.log('CreateChatUseCase - Executing with params:', params);
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

export class CreateGroupChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: CreateGroupChatRequestDTO): Promise<ChatSummaryDTO> {
    console.log('CreateGroupChatUseCase - Executing with params:', params);
    try {
      const result = await this.chatRepository.createGroupChat(params);
      console.log('CreateGroupChatUseCase - Result:', result);
      return result;
    } catch (error) {
      console.error('CreateGroupChatUseCase - Error:', error);
      throw error;
    }
  }
}

export class AddGroupMemberUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: AddGroupMemberRequestDTO): Promise<void> {
    console.log('AddGroupMemberUseCase - Executing with params:', params);
    try {
      await this.chatRepository.addGroupMember(params);
      console.log('AddGroupMemberUseCase - Success');
    } catch (error) {
      console.error('AddGroupMemberUseCase - Error:', error);
      throw error;
    }
  }
}

export class RemoveGroupMemberUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: RemoveGroupMemberRequestDTO): Promise<void> {
    console.log('RemoveGroupMemberUseCase - Executing with params:', params);
    try {
      await this.chatRepository.removeGroupMember(params);
      console.log('RemoveGroupMemberUseCase - Success');
    } catch (error) {
      console.error('RemoveGroupMemberUseCase - Error:', error);
      throw error;
    }
  }
}

export class UpdateGroupAdminUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupAdminRequestDTO): Promise<void> {
    console.log('UpdateGroupAdminUseCase - Executing with params:', params);
    try {
      await this.chatRepository.updateGroupAdmin(params);
      console.log('UpdateGroupAdminUseCase - Success');
    } catch (error) {
      console.error('UpdateGroupAdminUseCase - Error:', error);
      throw error;
    }
  }
}

export class UpdateGroupSettingsUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupSettingsRequestDTO): Promise<void> {
    console.log('UpdateGroupSettingsUseCase - Executing with params:', params);
    try {
      console.log('UpdateGroupSettingsUseCase - Calling repository...');
      await this.chatRepository.updateGroupSettings(params);
      console.log('UpdateGroupSettingsUseCase - Repository call finished');
    } catch (error) {
      console.error('UpdateGroupSettingsUseCase - Error:', error);
      throw error;
    }
  }
}

export class UpdateGroupInfoUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupInfoRequestDTO): Promise<void> {
    console.log('UpdateGroupInfoUseCase - Executing with params:', params);
    try {
      await this.chatRepository.updateGroupInfo(params);
      console.log('UpdateGroupInfoUseCase - Success');
    } catch (error) {
      console.error('UpdateGroupInfoUseCase - Error:', error);
      throw error;
    }
  }
}

export class LeaveGroupUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: LeaveGroupRequestDTO): Promise<void> {
    console.log('LeaveGroupUseCase - Executing with params:', params);
    try {
      await this.chatRepository.leaveGroup(params);
      console.log('LeaveGroupUseCase - Success');
    } catch (error) {
      console.error('LeaveGroupUseCase - Error:', error);
      throw error;
    }
  }
}

export class EditMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: EditMessageRequestDTO): Promise<void> {
    console.log('EditMessageUseCase - Executing with params:', params);
    try {
      await this.chatRepository.editMessage(params);
      console.log('EditMessageUseCase - Message edited successfully');
    } catch (error) {
      console.error('EditMessageUseCase - Error:', error);
      throw error;
    }
  }
}

export class DeleteMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: DeleteMessageRequestDTO): Promise<void> {
    console.log('DeleteMessageUseCase - Executing with params:', params);
    try {
      await this.chatRepository.deleteMessage(params);
      console.log('DeleteMessageUseCase - Message deleted successfully');
    } catch (error) {
      console.error('DeleteMessageUseCase - Error:', error);
      throw error;
    }
  }
}

export class ReplyToMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: ReplyToMessageRequestDTO): Promise<void> {
    console.log('ReplyToMessageUseCase - Executing with params:', params);
    try {
      await this.chatRepository.replyToMessage(params);
      console.log('ReplyToMessageUseCase - Reply sent successfully');
    } catch (error) {
      console.error('ReplyToMessageUseCase - Error:', error);
      throw error;
    }
  }
}

export class DeleteChatUseCase {
  constructor(private chatRepository: IChatRepository) { }
  async execute(params: DeleteChatRequestDTO): Promise<void> {
    try {
      console.log('[DeleteChatUseCase] params:', params);
      await this.chatRepository.deleteChat(params);
    } catch (error) {
      console.error('[DeleteChatUseCase] Error:', error);
      throw error;
    }
  }
}

export class BlockChatUseCase {
  constructor(private chatRepository: IChatRepository) { }
  async execute(params: BlockChatRequestDTO): Promise<void> {
    try {
      console.log('[BlockChatUseCase] params:', params);
      await this.chatRepository.blockChat(params);
    } catch (error) {
      console.error('[BlockChatUseCase] Error:', error);
      throw error;
    }
  }
}

export class ClearChatUseCase {
  constructor(private chatRepository: IChatRepository) { }
  async execute(params: ClearChatRequestDTO): Promise<void> {
    try {
      console.log('[ClearChatUseCase] params:', params);
      await this.chatRepository.clearChat(params);
    } catch (error) {
      console.error('[ClearChatUseCase] Error:', error);
      throw error;
    }
  }
} 