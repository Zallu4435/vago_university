import { IChatRepository } from "../repositories/IChatRepository";
import { ClearChatRequestDTO } from "../../../domain/chat/dtos/ChatRequestDTOs";

export class ClearChatUseCase {
  constructor(private _chatRepository: IChatRepository) {}
  async execute(params: ClearChatRequestDTO) {
    await this._chatRepository.clearChat(params);
  }
} 