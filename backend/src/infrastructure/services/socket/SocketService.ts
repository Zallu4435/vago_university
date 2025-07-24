import { Server as SocketIOServer, Namespace } from "socket.io";
import { ChatRepository } from "../../repositories/chat/ChatRepository";
import { MessageStatus } from "../../../domain/chat/entities/Message";
import jwt from "jsonwebtoken";

interface AuthenticatedSocket {
  userId: string;
  collection: string;
}

interface SocketMessage {
  chatId: string;
  senderId: string;
  content: string;
  type: string;
  id: string;
}

interface MessageStatusData {
  messageId: string;
  status: MessageStatus;
}

interface ReactionData {
  messageId: string;
  userId: string;
  chatId: string;
}

interface DeleteMessageData {
  messageId: string;
  chatId: string;
}

export class SocketService {
  private io: SocketIOServer;
  private chatNamespace: Namespace;
  private chatRepository: ChatRepository;
  private userSockets: Map<string, string> = new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
    this.chatNamespace = this.io.of('/chat');
    this.chatRepository = new ChatRepository();

    this.setupErrorHandlers();
    this.setupSocketHandlers();
  }

  private setupErrorHandlers() {
    this.io.on('error', (error) => {
      console.error('[Socket.IO] Server Error:', error);
    });

    this.chatNamespace.on('error', (error) => {
      console.error('[Socket.IO] Chat Namespace Error:', error);
    });
  }

  private setupSocketHandlers() {
    this.chatNamespace.use(this.authenticateSocket.bind(this));
    this.chatNamespace.on("connection", this.handleConnection.bind(this));
  }

  private authenticateSocket(socket: any, next: (err?: Error) => void) {
    try {
      const token = this.extractToken(socket);
      
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret") as any;
      socket.data.user = {
        userId: decoded.userId,
        collection: decoded.collection,
      } as AuthenticatedSocket;

      next();
    } catch (err) {
      console.error('[Socket.IO] Authentication failed:', err);
      next(new Error("Authentication error: Invalid token"));
    }
  }

  private extractToken(socket: any): string | null {
    let token = socket.handshake.auth.token;
    
    if (typeof token === 'string' && token) {
      return token;
    }

    if (socket.handshake.headers.cookie) {
      const match = socket.handshake.headers.cookie.match(/auth_token=([^;]+)/);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  private handleConnection(socket: any) {
    const userId = socket.data.user.userId;
    this.userSockets.set(userId, socket.id);
    
    socket.emit("onlineUsers", Array.from(this.userSockets.keys()));
    
    this.joinUserChats(userId);

    this.broadcastUserStatus(userId, "online");

    this.setupEventListeners(socket, userId);
  }

  private setupEventListeners(socket: any, userId: string) {
    socket.on("joinChat", (data: { chatId: string }) => {
      socket.join(data.chatId);
    });

    socket.on("leaveChat", (data: { chatId: string }) => {
      socket.leave(data.chatId);
    });

    socket.on("typing", (data: { chatId: string; isTyping: boolean }) => {
      socket.to(data.chatId).emit("typing", {
        userId,
        chatId: data.chatId,
        isTyping: data.isTyping
      });
    });

    socket.on("message", async (message: SocketMessage) => {
      if (!message.chatId) {
        console.error('[Socket.IO] Received message with undefined chatId:', message);
        return;
      }
      try {
        await this.handleNewMessage(message);
      } catch (error) {
        console.error('[Socket.IO] Error handling new message:', error);
      }
    });

    socket.on("messageStatus", async (data: MessageStatusData) => {
      try {
        await this.chatRepository.updateMessageStatus(data.messageId, data.status);
        socket.to(data.messageId).emit("messageStatus", data);
      } catch (error) {
        console.error('[Socket.IO] Error updating message status:', error);
      }
    });

    socket.on("removeReaction", (data: ReactionData) => {
      this.chatNamespace.to(data.chatId).emit("messageReactionRemoved", {
        messageId: data.messageId,
        userId: data.userId,
      });
    });

    socket.on("deleteMessage", (data: DeleteMessageData) => {
      this.chatNamespace.to(data.chatId).emit("messageDeleted", {
        messageId: data.messageId,
        chatId: data.chatId,
      });
    });

    socket.on("disconnect", (reason: string) => {
      this.handleDisconnect(socket, reason);
    });
  }

  private handleDisconnect(socket: any, reason: string) {
    const userId = this.getUserIdBySocketId(socket.id);
    if (userId) {
      this.userSockets.delete(userId);
      this.broadcastUserStatus(userId, "offline");
    }
  }

  private broadcastUserStatus(userId: string, status: "online" | "offline") {
    this.chatNamespace.emit("userStatus", { userId, status });
  }

  private async joinUserChats(userId: string) {
    try {
      const response = await this.chatRepository.getChats({ userId, page: 1, limit: 100 });
      const socketId = this.userSockets.get(userId);
      
      if (socketId) {
        response.data.forEach((chat) => {
          this.chatNamespace.sockets.get(socketId)?.join(chat.id);
        });
      }
    } catch (error) {
      console.error('[Socket.IO] Error joining user chats:', { userId, error });
    }
  }

  private getUserIdBySocketId(socketId: string): string | undefined {
    for (const [userId, sid] of this.userSockets.entries()) {
      if (sid === socketId) return userId;
    }
    return undefined;
  }

  public async handleNewMessage(message: SocketMessage) {
    const chatId = message.chatId;
    
    this.chatNamespace.to(chatId).emit("message", message);
    
    try {
      const chat = await this.chatRepository.getChatDetails(chatId, message.senderId);
      if (chat) {
        chat.participants.forEach((participant) => {
          if (participant.id !== message.senderId) {
            const socketId = this.userSockets.get(participant.id);
            if (socketId) {
              this.chatNamespace.to(socketId).emit("messageStatus", {
                messageId: message.id,
                status: "delivered"
              });
            }
          }
        });
      }
    } catch (error) {
      console.error('[Socket.IO] Error handling message status:', error);
    }
  }

  public async handleUpdatedChat(chat: any) {
    if (!chat || !chat.id) return;
    this.chatNamespace.to(chat.id).emit('chat', chat);
  }
} 