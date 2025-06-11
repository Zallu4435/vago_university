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
  ReplyToMessageUseCase
} from "../../../application/chat/useCases/ChatUseCases";
import { GetChatsRequestDTO, SearchChatsRequestDTO, GetChatMessagesRequestDTO, SendMessageRequestDTO, MarkMessagesAsReadRequestDTO, AddReactionRequestDTO, RemoveReactionRequestDTO, SearchUsersRequestDTO, CreateChatRequestDTO, CreateGroupChatRequestDTO, AddGroupMemberRequestDTO, RemoveGroupMemberRequestDTO, UpdateGroupAdminRequestDTO, UpdateGroupSettingsRequestDTO, UpdateGroupInfoRequestDTO, LeaveGroupRequestDTO, EditMessageRequestDTO, DeleteMessageRequestDTO, ReplyToMessageRequestDTO } from "../../../domain/chat/dtos/ChatRequestDTOs";
import { FileUploadService } from "../../../infrastructure/services/upload/FileUploadService";
import { MessageType } from "../../../domain/chat/entities/Message";

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
    private replyToMessageUseCase: ReplyToMessageUseCase
  ) {}

  async getChats(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - getChats - User:', req.user);
      
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

      console.log('ChatController - getChats - Params:', params);
      const result = await this.getChatsUseCase.execute(params);
      return {
        statusCode: 200,
        body: result
      };
    } catch (error: any) {
      console.error("Error in getChats:", error);
      
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
      console.log('ChatController - searchChats - User:', req.user);
      
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

      console.log('ChatController - searchChats - Params:', params);
      const result = await this.searchChatsUseCase.execute(params);
      return {
        statusCode: 200,
        body: result
      };
    } catch (error: any) {
      console.error("Error in searchChats:", error);
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
      console.log('ChatController - getChatMessages - Params:', req.params);
      const { chatId } = req.params;
      if (!chatId) {
        return {
          statusCode: 400,
          body: { error: "Chat ID is required" }
        };
      }

      const params: GetChatMessagesRequestDTO = {
        chatId,
        page: parseInt(req.query?.page as string) || 1,
        limit: parseInt(req.query?.limit as string) || 20,
        before: req.query?.before as string
      };

      console.log('ChatController - getChatMessages - Request params:', params);
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
      console.error("Error in getChatMessages:", error);
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
      console.log('ChatController - sendMessage - User:', req.user);
      console.log('ChatController - sendMessage - Body:', req.body);
      
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

      // Handle both text and content fields
      const messageContent = req.body.text || req.body.content;
      if (!messageContent) {
        return {
          statusCode: 400,
          body: { error: "Message content is required" }
        };
      }

      // Handle file attachments if present
      let attachments = [];
      if (req.body.files) {
        attachments = req.body.files.map((file: any) => ({
          type: file.mimetype?.startsWith("image/") ? MessageType.Image : MessageType.File,
          url: FileUploadService.getFileUrl(file.filename),
          name: file.originalname,
          size: file.size,
        }));
      }

      const params: SendMessageRequestDTO = {
        chatId,
        senderId: req.user.id,
        content: messageContent,
        type: attachments?.length ? (attachments[0].type === MessageType.Image ? MessageType.Image : MessageType.File) : MessageType.Text,
        attachments,
      };

      console.log('ChatController - sendMessage - Params:', params);
      await this.sendMessageUseCase.execute(params);
      
      return {
        statusCode: 201,
        body: { message: "Message sent successfully" }
      };
    } catch (error) {
      console.error("Error in sendMessage:", error);
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
    try {
      console.log('ChatController - markMessagesAsRead - User:', req.user);
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

      console.log('ChatController - markMessagesAsRead - Params:', params);
      await this.markMessagesAsReadUseCase.execute(params);

      return {
        statusCode: 200,
        body: { message: 'Messages marked as read' }
      };
    } catch (error) {
      console.error('Error in markMessagesAsRead:', error);
      return {
        statusCode: 500,
        body: { message: error instanceof Error ? error.message : 'Internal server error' }
      };
    }
  }

  async addReaction(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - addReaction - User:', req.user);
      
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

      console.log('ChatController - addReaction - Params:', params);
      await this.addReactionUseCase.execute(params);
      
      return {
        statusCode: 200,
        body: { message: "Reaction added successfully" }
      };
    } catch (error) {
      console.error("Error in addReaction:", error);
      return {
        statusCode: 500,
        body: { 
          error: "Failed to add reaction",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }

  async removeReaction(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - removeReaction - User:', req.user);
      
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

      console.log('ChatController - removeReaction - Params:', params);
      await this.removeReactionUseCase.execute(params);
      
      return {
        statusCode: 200,
        body: { message: "Reaction removed successfully" }
      };
    } catch (error) {
      console.error("Error in removeReaction:", error);
      return {
        statusCode: 500,
        body: { 
          error: "Failed to remove reaction",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }

  async getChatDetails(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - getChatDetails - Params:', req.params);
      
      const { chatId } = req.params;
      if (!chatId) {
        return {
          statusCode: 400,
          body: { error: "Chat ID is required" }
        };
      }

      const result = await this.getChatDetailsUseCase.execute(chatId);
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
    } catch (error) {
      console.error("Error in getChatDetails:", error);
      return {
        statusCode: 500,
        body: { 
          error: "Failed to get chat details",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }

  async searchUsers(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('=== Search Users Controller Started ===');
      console.log('ChatController - searchUsers - User:', req.user);
      
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

      console.log('ChatController - searchUsers - Params:', params);
      
      // Call the use case
      const result = await this.searchUsersUseCase.execute(params);
      
      console.log('ChatController - searchUsers - Result:', result);
      console.log('=== Search Users Controller Ended ===');
      
      return {
        statusCode: 200,
        body: result
      };
    } catch (error: any) {
      console.error("Error in searchUsers:", error);
      return {
        statusCode: 500,
        body: { 
          error: "Failed to search users",
          details: error.message 
        }
      };
    }
  }

  async createChat(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - createChat - User:', req.user);
      
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

      console.log('ChatController - createChat - Params:', params);
      const result = await this.createChatUseCase.execute(params);
      return {
        statusCode: 201,
        body: result
      };
    } catch (error: any) {
      console.error("Error in createChat:", error);
      
      if (error.message === "User not found") {
        return {
          statusCode: 404,
          body: { error: "User not found" }
        };
      }

      if (error.message === "Chat already exists") {
        return {
          statusCode: 409,
          body: { error: "Chat already exists" }
        };
      }

      return {
        statusCode: 500,
        body: { 
          error: "Failed to create chat",
          details: error.message 
        }
      };
    }
  }

  async createGroupChat(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - createGroupChat - User:', req.user);
      console.log('ChatController - createGroupChat - Body:', req.body);
      
      if (!req.user?.id) {
        return {
          statusCode: 401,
          body: { error: "User not authenticated" }
        };
      }

      const { name, description, participants, settings } = req.body;
      if (!name || !participants || !Array.isArray(participants)) {
        return {
          statusCode: 400,
          body: { error: "Name and participants array are required" }
        };
      }

      const params: CreateGroupChatRequestDTO = {
        name,
        description,
        participants,
        creatorId: req.user.id,
        settings
      };

      console.log('ChatController - createGroupChat - Params:', params);
      const result = await this.createGroupChatUseCase.execute(params);
      
      return {
        statusCode: 201,
        body: result
      };
    } catch (error) {
      console.error("Error in createGroupChat:", error);
      return {
        statusCode: 500,
        body: { 
          error: "Failed to create group chat",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }

  async addGroupMember(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - addGroupMember - User:', req.user);
      console.log('ChatController - addGroupMember - Body:', req.body);
      
      if (!req.user?.id) {
        return {
          statusCode: 401,
          body: { error: "User not authenticated" }
        };
      }

      const { chatId } = req.params;
      const { userId } = req.body;
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

      console.log('ChatController - addGroupMember - Params:', params);
      await this.addGroupMemberUseCase.execute(params);
      
      return {
        statusCode: 200,
        body: { message: "Member added successfully" }
      };
    } catch (error) {
      console.error("Error in addGroupMember:", error);
      return {
        statusCode: 500,
        body: { 
          error: "Failed to add group member",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }

  async removeGroupMember(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - removeGroupMember - User:', req.user);
      console.log('ChatController - removeGroupMember - Params:', req.params);
      
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

      console.log('ChatController - removeGroupMember - Params:', params);
      await this.removeGroupMemberUseCase.execute(params);
      
      return {
        statusCode: 200,
        body: { message: "Member removed successfully" }
      };
    } catch (error) {
      console.error("Error in removeGroupMember:", error);
      return {
        statusCode: 500,
        body: { 
          error: "Failed to remove group member",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }

  async updateGroupAdmin(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - updateGroupAdmin - User:', req.user);
      console.log('ChatController - updateGroupAdmin - Body:', req.body);
      
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

      console.log('ChatController - updateGroupAdmin - Params:', params);
      await this.updateGroupAdminUseCase.execute(params);
      
      return {
        statusCode: 200,
        body: { message: "Admin status updated successfully" }
      };
    } catch (error) {
      console.error("Error in updateGroupAdmin:", error);
      return {
        statusCode: 500,
        body: { 
          error: "Failed to update admin status",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }

  async updateGroupSettings(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - updateGroupSettings - User:', req.user);
      console.log('ChatController - updateGroupSettings - Body:', req.body);
      
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

      console.log('ChatController - updateGroupSettings - Params:', params);
      await this.updateGroupSettingsUseCase.execute(params);
      
      return {
        statusCode: 200,
        body: { message: "Group settings updated successfully" }
      };
    } catch (error) {
      console.error("Error in updateGroupSettings:", error);
      return {
        statusCode: 500,
        body: { 
          error: "Failed to update group settings",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }

  async updateGroupInfo(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - updateGroupInfo - User:', req.user);
      console.log('ChatController - updateGroupInfo - Body:', req.body);
      
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

      console.log('ChatController - updateGroupInfo - Params:', params);
      await this.updateGroupInfoUseCase.execute(params);
      
      return {
        statusCode: 200,
        body: { message: "Group info updated successfully" }
      };
    } catch (error) {
      console.error("Error in updateGroupInfo:", error);
      return {
        statusCode: 500,
        body: { 
          error: "Failed to update group info",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }

  async leaveGroup(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - leaveGroup - User:', req.user);
      console.log('ChatController - leaveGroup - Params:', req.params);
      
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

      console.log('ChatController - leaveGroup - Params:', params);
      await this.leaveGroupUseCase.execute(params);
      
      return {
        statusCode: 200,
        body: { message: "Successfully left the group" }
      };
    } catch (error) {
      console.error("Error in leaveGroup:", error);
      return {
        statusCode: 500,
        body: { 
          error: "Failed to leave group",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }

  async editMessage(req: IHttpRequest): Promise<IHttpResponse> {
    try {
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
    } catch (error) {
      return {
        statusCode: error.statusCode || 500,
        body: { error: error.message }
      };
    }
  }

  async deleteMessage(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { chatId, messageId } = req.params;
      const { deleteForEveryone } = req.body;
      const userId = req.user.id;

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
      return {
        statusCode: error.statusCode || 500,
        body: { error: error.message }
      };
    }
  }

  async replyToMessage(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('ChatController - replyToMessage - User:', req.user);
      
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

      console.log('ChatController - replyToMessage - Params:', params);
      await this.replyToMessageUseCase.execute(params);
      
      return {
        statusCode: 200,
        body: { message: "Reply sent successfully" }
      };
    } catch (error) {
      console.error("Error in replyToMessage:", error);
      return {
        statusCode: 500,
        body: { 
          error: "Failed to send reply",
          details: error instanceof Error ? error.message : 'Internal server error'
        }
      };
    }
  }
}  