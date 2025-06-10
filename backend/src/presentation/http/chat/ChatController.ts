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
} from "../../../application/chat/useCases/ChatUseCases";
import { GetChatsRequestDTO, SearchChatsRequestDTO, GetChatMessagesRequestDTO, SendMessageRequestDTO, MarkMessagesAsReadRequestDTO, AddReactionRequestDTO, RemoveReactionRequestDTO, SearchUsersRequestDTO, CreateChatRequestDTO } from "../../../domain/chat/dtos/ChatRequestDTOs";
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
    private createChatUseCase: CreateChatUseCase
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
}  