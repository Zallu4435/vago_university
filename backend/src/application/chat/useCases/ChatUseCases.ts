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
    return this.chatRepository.getChats(params);
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
    return this.chatRepository.searchUsers(params);
  }
}

export class CreateChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: CreateChatRequestDTO): Promise<ChatSummaryDTO> {
    return this.chatRepository.createChat(params);
  }
}

export class CreateGroupChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: CreateGroupChatRequestDTO): Promise<ChatSummaryDTO> {
    return this.chatRepository.createGroupChat(params);
  }
}

export class AddGroupMemberUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: AddGroupMemberRequestDTO): Promise<void> {
    return this.chatRepository.addGroupMember(params);
  }
}

export class RemoveGroupMemberUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: RemoveGroupMemberRequestDTO): Promise<void> {
    return this.chatRepository.removeGroupMember(params);
  }
}

export class UpdateGroupAdminUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupAdminRequestDTO): Promise<void> {
    return this.chatRepository.updateGroupAdmin(params);
  }
}

export class UpdateGroupSettingsUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupSettingsRequestDTO): Promise<void> {
    return this.chatRepository.updateGroupSettings(params);
  }
}

export class UpdateGroupInfoUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: UpdateGroupInfoRequestDTO): Promise<void> {
    return this.chatRepository.updateGroupInfo(params);
  }
}

export class LeaveGroupUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: LeaveGroupRequestDTO): Promise<void> {
    return this.chatRepository.leaveGroup(params);
  }
}

export class EditMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: EditMessageRequestDTO): Promise<void> {
    return this.chatRepository.editMessage(params);
  }
}

export class DeleteMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: DeleteMessageRequestDTO): Promise<void> {
    return this.chatRepository.deleteMessage(params);
  }
}

export class ReplyToMessageUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: ReplyToMessageRequestDTO): Promise<void> {
    return this.chatRepository.replyToMessage(params);
  }
}

export class DeleteChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: DeleteChatRequestDTO): Promise<void> {
    return this.chatRepository.deleteChat(params);
  }
}

export class BlockChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: BlockChatRequestDTO): Promise<void> {
    return this.chatRepository.blockChat(params);
  }
}

export class ClearChatUseCase {
  constructor(private chatRepository: IChatRepository) { }

  async execute(params: ClearChatRequestDTO): Promise<void> {
    return this.chatRepository.clearChat(params);
  }
} 