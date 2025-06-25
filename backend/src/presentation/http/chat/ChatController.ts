import { Request, Response } from "express";
import { IHttpRequest, IHttpResponse } from "../../http/IHttp";
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
  ReplyToMessageUseCase,
  DeleteChatUseCase,
  BlockChatUseCase,
  ClearChatUseCase
} from "../../../application/chat/useCases/ChatUseCases";
import { GetChatsRequestDTO, SearchChatsRequestDTO, GetChatMessagesRequestDTO, SendMessageRequestDTO, MarkMessagesAsReadRequestDTO, AddReactionRequestDTO, RemoveReactionRequestDTO, SearchUsersRequestDTO, CreateChatRequestDTO, CreateGroupChatRequestDTO, AddGroupMemberRequestDTO, RemoveGroupMemberRequestDTO, UpdateGroupAdminRequestDTO, UpdateGroupSettingsRequestDTO, UpdateGroupInfoRequestDTO, LeaveGroupRequestDTO, EditMessageRequestDTO, DeleteMessageRequestDTO, ReplyToMessageRequestDTO } from "../../../domain/chat/dtos/ChatRequestDTOs";
import { FileUploadService } from "../../../infrastructure/services/upload/FileUploadService";
import { MessageType } from "../../../domain/chat/entities/Message";
import { cloudinary } from '../../../config/cloudinary.config';

export class ChatController {
  constructor(
    private getChatsUseCase: GetChatsUseCase,
    private searchChatsUseCase: SearchChatsUseCase,
    private getChatMessagesUseCase: GetChatMessagesUseCase,
    private sendMessageUseCase: SendMessageUseCase,
    private markMessagesAsReadUseCase: MarkMessagesAsReadUseCase,
    private addReactionUseCase: AddReactionUseCase,
    private removeReactionUseCase: RemoveReactionUseCase,
    private getChatDetailsUseCase: GetChatDetailsUseCase,
    private searchUsersUseCase: SearchUsersUseCase,
    private createChatUseCase: CreateChatUseCase,
    private createGroupChatUseCase: CreateGroupChatUseCase,
    private addGroupMemberUseCase: AddGroupMemberUseCase,
    private removeGroupMemberUseCase: RemoveGroupMemberUseCase,
    private updateGroupAdminUseCase: UpdateGroupAdminUseCase,
    private updateGroupSettingsUseCase: UpdateGroupSettingsUseCase,
    private updateGroupInfoUseCase: UpdateGroupInfoUseCase,
    private leaveGroupUseCase: LeaveGroupUseCase,
    private editMessageUseCase: EditMessageUseCase,
    private deleteMessageUseCase: DeleteMessageUseCase,
    private fileUploadService: FileUploadService,
    private replyToMessageUseCase: ReplyToMessageUseCase,
    private deleteChatUseCase: DeleteChatUseCase,
    private blockChatUseCase: BlockChatUseCase,
    private clearChatUseCase: ClearChatUseCase
  ) {}

  async getChats(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!req.user?.id) {
        return {
          statusCode: 401,
          body: { error: "User not authenticated" }
        };
      }

      const params: GetChatsRequestDTO = {
        userId: req.user.id,
        page: parseInt(req.query?.page as string) || 1,
        limit: parseInt(req.query?.limit as string) || 10,
      };

      const result = await this.getChatsUseCase.execute(params);
      return {
        statusCode: 200,
        body: result
      };
    } catch (error: any) {
      if (error.message === "User not found") {
        return {
          statusCode: 404,
          body: { error: "User not found" }
        };
      }

      if (error.name === "ValidationError") {
        return {
          statusCode: 400,
          body: { error: "Invalid request parameters" }
        };
      }

      return {
        statusCode: 500,
        body: { 
          error: "Failed to fetch chats",
          details: error.message 
        }
      };
    }
  }

  async searchChats(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!req.user?.id) {
        return {
          statusCode: 401,
          body: { error: "User not authenticated" }
        };
      }

      const params: SearchChatsRequestDTO = {
        userId: req.user.id,
        query: req.query?.query as string,
        page: parseInt(req.query?.page as string) || 1,
        limit: parseInt(req.query?.limit as string) || 10,
      };

      const result = await this.searchChatsUseCase.execute(params);
      return {
        statusCode: 200,
        body: result
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        body: { 
          error: "Failed to search chats",
          details: error.message 
        }
      };
    }
  }

  async getChatMessages(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { chatId } = req.params;
      const userId = req.user?.id;
      if (!chatId || !userId) {
        return {
          statusCode: 400,
          body: { error: "Chat ID and user ID are required" }
        };
      }
      const params: GetChatMessagesRequestDTO = {
        chatId,
        userId,
        page: parseInt(req.query?.page as string) || 1,
        limit: parseInt(req.query?.limit as string) || 20,
        before: req.query?.before as string
      };
      const result = await this.getChatMessagesUseCase.execute(params);
      return {
        statusCode: 200,
        body: {
          messages: result.data,
          pagination: {
            totalItems: result.totalItems,
            totalPages: result.totalPages,
            currentPage: result.currentPage,
            hasMore: result.hasMore,
            oldestMessageTimestamp: result.oldestMessageTimestamp
          }
        }
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { 
          error: "Failed to fetch messages",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }

  async sendMessage(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!req.user?.id) {
        return {
          statusCode: 401,
          body: { error: "User not authenticated" }
        };
      }

      const { chatId } = req.params;
      if (!chatId) {
        return {
          statusCode: 400,
          body: { error: "Chat ID is required" }
        };
      }

      let attachments: any[] = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          try {
            if (file.mimetype && file.mimetype.startsWith('image/')) {
              const result = await cloudinary.uploader.upload(file.path, {
                folder: 'message-attachments',
                resource_type: 'image',
                use_filename: true,
                unique_filename: false,
                overwrite: false
              });
              attachments.push({
                type: MessageType.Image,
                url: result.secure_url,
                name: file.originalname,
                size: file.size,
              });
            } else {
              attachments.push({
                type: MessageType.File,
                url: FileUploadService.getFileUrl(file.filename),
                name: file.originalname,
                size: file.size,
              });
            }
          } catch (uploadErr: any) {
          }
        }
      }

      const messageContent = req.body.text || req.body.content || '';
      if (!messageContent && attachments.length === 0) {
        return {
          statusCode: 400,
          body: { error: "Message content or file is required" }
        };
      }

      const params: SendMessageRequestDTO = {
        chatId,
        senderId: req.user.id,
        content: messageContent,
        type: attachments?.length ? (attachments[0].type === MessageType.Image ? MessageType.Image : MessageType.File) : MessageType.Text,
        attachments,
      };

      await this.sendMessageUseCase.execute(params);
      
      return {
        statusCode: 201,
        body: { message: "Message sent successfully" }
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { 
          error: "Failed to send message",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }

  async markMessagesAsRead(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { message: 'Unauthorized' }
      };
    }

    const { chatId } = req.params;
    if (!chatId) {
      return {
        statusCode: 400,
        body: { message: 'Chat ID is required' }
      };
    }

    const params: MarkMessagesAsReadRequestDTO = {
      chatId,
      userId: req.user.id
    };

    await this.markMessagesAsReadUseCase.execute(params);

    return {
      statusCode: 200,
      body: { message: 'Messages marked as read' }
    };
  }

  async addReaction(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { error: "User not authenticated" }
      };
    }

    const { messageId } = req.params;
    if (!messageId) {
      return {
        statusCode: 400,
        body: { error: "Message ID is required" }
      };
    }

    const { emoji } = req.body;
    if (!emoji) {
      return {
        statusCode: 400,
        body: { error: "Emoji is required" }
      };
    }

    const params: AddReactionRequestDTO = {
      messageId,
      userId: req.user.id,
      emoji,
    };

    await this.addReactionUseCase.execute(params);
    
    return {
      statusCode: 200,
      body: { message: "Reaction added successfully" }
    };
  }

  async removeReaction(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { error: "User not authenticated" }
      };
    }

    const { messageId } = req.params;
    if (!messageId) {
      return {
        statusCode: 400,
        body: { error: "Message ID is required" }
      };
    }

    const params: RemoveReactionRequestDTO = {
      messageId,
      userId: req.user.id,
    };

    await this.removeReactionUseCase.execute(params);
    
    return {
      statusCode: 200,
      body: { message: "Reaction removed successfully" }
    };
  }

  async getChatDetails(req: IHttpRequest): Promise<IHttpResponse> {
    const { chatId } = req.params;
    const userId = req.user?.id;
    if (!chatId || !userId) {
      return {
        statusCode: 400,
        body: { error: "Chat ID and user ID are required" }
      };
    }

    const result = await this.getChatDetailsUseCase.execute(chatId, userId);
    if (!result) {
      return {
        statusCode: 404,
        body: { error: "Chat not found" }
      };
    }

    return {
      statusCode: 200,
      body: result
    };
  }

  async searchUsers(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { error: "User not authenticated" }
      };
    }

    const params: SearchUsersRequestDTO = {
      userId: req.user.id,
      query: req.query?.query as string,
      page: parseInt(req.query?.page as string) || 1,
      limit: parseInt(req.query?.limit as string) || 20,
    };

    const result = await this.searchUsersUseCase.execute(params);
      
    return {
      statusCode: 200,
      body: result
    };
  }

  async createChat(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { error: "User not authenticated" }
      };
    }

    const params: CreateChatRequestDTO = {
      creatorId: req.user.id,
      participantId: req.body.participantId,
      type: req.body.type || 'direct',
      name: req.body.name,
      avatar: req.body.avatar,
    };

    const result = await this.createChatUseCase.execute(params);
    return {
      statusCode: 201,
      body: result
    };
  }

  async createGroupChat(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { error: "User not authenticated" }
      };
    }

    let { name, description, participants, settings } = req.body;
    if (typeof participants === 'string') {
      try { participants = JSON.parse(participants); } catch {}
    }
    if (typeof settings === 'string') {
      try { settings = JSON.parse(settings); } catch {}
    }
    const params: any = {
      name,
      description,
      participants,
      creatorId: req.user.id,
      settings
    };
    if (req.file && (req.file.path || req.file.url)) {
      params.avatar = req.file.path || req.file.url;
    }

    const result = await this.createGroupChatUseCase.execute(params);
    
    return {
      statusCode: 201,
      body: result
    };
  }

  async addGroupMember(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { error: "User not authenticated" }
      };
    }

    const { chatId } = req.params;
    const { userId, addedBy } = req.body;
    if (!chatId || !userId) {
      return {
        statusCode: 400,
        body: { error: "Chat ID and user ID are required" }
      };
    }

    const params: AddGroupMemberRequestDTO = {
      chatId,
      userId,
      addedBy: req.user.id
    };

    await this.addGroupMemberUseCase.execute(params);
    
    const updatedChat = await this.getChatDetailsUseCase.execute(chatId);
    return {
      statusCode: 200,
      body: updatedChat
    };
  }

  async removeGroupMember(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { error: "User not authenticated" }
      };
    }

    const { chatId, userId } = req.params;
    if (!chatId || !userId) {
      return {
        statusCode: 400,
        body: { error: "Chat ID and user ID are required" }
      };
    }

    const params: RemoveGroupMemberRequestDTO = {
      chatId,
      userId,
      removedBy: req.user.id
    };

    await this.removeGroupMemberUseCase.execute(params);
    
    const updatedChat = await this.getChatDetailsUseCase.execute(chatId);
    return {
      statusCode: 200,
      body: updatedChat
    };
  }

  async updateGroupAdmin(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { error: "User not authenticated" }
      };
    }

    const { chatId, userId } = req.params;
    const { isAdmin } = req.body;
    if (!chatId || !userId || typeof isAdmin !== 'boolean') {
      return {
        statusCode: 400,
        body: { error: "Chat ID, user ID, and isAdmin flag are required" }
      };
    }

    const params: UpdateGroupAdminRequestDTO = {
      chatId,
      userId,
      isAdmin,
      updatedBy: req.user.id
    };

    await this.updateGroupAdminUseCase.execute(params);
    
    return {
      statusCode: 200,
      body: { message: "Admin status updated successfully" }
    };
  }

  async updateGroupSettings(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { error: "User not authenticated" }
      };
    }

    const { chatId } = req.params;
    const { settings } = req.body;
    if (!chatId || !settings) {
      return {
        statusCode: 400,
        body: { error: "Chat ID and settings are required" }
      };
    }

    const params: UpdateGroupSettingsRequestDTO = {
      chatId,
      settings,
      updatedBy: req.user.id
    };

    await this.updateGroupSettingsUseCase.execute(params);
    
    return {
      statusCode: 200,
      body: { message: "Group settings updated successfully" }
    };
  }

  async updateGroupInfo(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { error: "User not authenticated" }
      };
    }

    const { chatId } = req.params;
    const { name, description, avatar } = req.body;
    if (!chatId || (!name && !description && !avatar)) {
      return {
        statusCode: 400,
        body: { error: "Chat ID and at least one field to update are required" }
      };
    }

    const params: UpdateGroupInfoRequestDTO = {
      chatId,
      name,
      description,
      avatar,
      updatedBy: req.user.id
    };

    await this.updateGroupInfoUseCase.execute(params);
    
    return {
      statusCode: 200,
      body: { message: "Group info updated successfully" }
    };
  }

  async leaveGroup(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { error: "User not authenticated" }
      };
    }

    const { chatId } = req.params;
    if (!chatId) {
      return {
        statusCode: 400,
        body: { error: "Chat ID is required" }
      };
    }

    const params: LeaveGroupRequestDTO = {
      chatId,
      userId: req.user.id
    };

    await this.leaveGroupUseCase.execute(params);
    
    return {
      statusCode: 200,
      body: { message: "Successfully left the group" }
    };
  }

  async editMessage(req: IHttpRequest): Promise<IHttpResponse> {
    const { chatId, messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    await this.editMessageUseCase.execute({
      chatId,
      messageId,
      content,
      userId
    });

    return {
      statusCode: 200,
      body: { message: 'Message edited successfully' }
    };
  }

  async deleteMessage(req: IHttpRequest): Promise<IHttpResponse> {
    const { chatId, messageId } = req.params;
    const { deleteForEveryone } = req.body;
    const userId = req.user.id;
    console.log('[ChatController] deleteMessage called with:', { chatId, messageId, userId, deleteForEveryone });
    try {
      await this.deleteMessageUseCase.execute({
        messageId,
        userId,
        deleteForEveryone
      });
      return {
        statusCode: 200,
        body: { message: 'Message deleted successfully' }
      };
    } catch (error) {
      console.error('[ChatController] Error in deleteMessage:', error, '\nParams:', { chatId, messageId, userId, deleteForEveryone });
      return {
        statusCode: error.statusCode || 500,
        body: { error: error.message }
      };
    }
  }

  async replyToMessage(req: IHttpRequest): Promise<IHttpResponse> {
    if (!req.user?.id) {
      return {
        statusCode: 401,
        body: { error: "User not authenticated" }
      };
    }

    const { chatId, messageId } = req.params;
    if (!chatId || !messageId) {
      return {
        statusCode: 400,
        body: { error: "Chat ID and Message ID are required" }
      };
    }

    const { content } = req.body;
    if (!content) {
      return {
        statusCode: 400,
        body: { error: "Content is required" }
      };
    }

    const params: ReplyToMessageRequestDTO = {
      chatId,
      messageId,
      content,
      userId: req.user.id
    };

    await this.replyToMessageUseCase.execute(params);
    
    return {
      statusCode: 200,
      body: { message: "Reply sent successfully" }
    };
  }

  async deleteChat(req: IHttpRequest): Promise<IHttpResponse> {
    const { chatId } = req.params;
    const userId = req.user?.id;
    if (!chatId || !userId) {
      return { statusCode: 400, body: { error: 'Chat ID and user ID are required' } };
    }
    await this.deleteChatUseCase.execute({ chatId, userId });
    return { statusCode: 204, body: {} };
  }

  async blockChat(req: IHttpRequest): Promise<IHttpResponse> {
    const { chatId } = req.params;
    const userId = req.user?.id;
    if (!chatId || !userId) {
      return { statusCode: 400, body: { error: 'Chat ID and user ID are required' } };
    }
    await this.blockChatUseCase.execute({ chatId, userId });
    return { statusCode: 204, body: {} };
  }

  async clearChat(req: IHttpRequest): Promise<IHttpResponse> {
    const { chatId } = req.params;
    const userId = req.user?.id;
    if (!chatId || !userId) {
      return { statusCode: 400, body: { error: 'Chat ID and user ID are required' } };
    }
    await this.clearChatUseCase.execute({ chatId, userId });
    return { statusCode: 204, body: {} };
  }
}  