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
    console.log('[Socket.IO] Setting up socket handlers for chat namespace');
    this.chatNamespace.use(this.authenticateSocket.bind(this));
    
    // Add connection attempt listener
    this.chatNamespace.on("connection_error", (err) => {
      console.error('[Socket.IO] Namespace connection error:', err);
    });
    
    this.chatNamespace.on("connect_error", (err) => {
      console.error('[Socket.IO] Namespace connect error:', err);
    });
    
    this.chatNamespace.on("connection", this.handleConnection.bind(this));
    
    console.log('[Socket.IO] Socket handlers setup complete');
  }

  private authenticateSocket(socket: any, next: (err?: Error) => void) {
    try {
      console.log('[Socket.IO] Authenticating socket connection attempt...');
      const token = this.extractToken(socket);
      
      if (!token) {
        console.error('[Socket.IO] Authentication failed: No access_token cookie provided');
        return next(new Error("Authentication error: No access_token cookie provided"));
      }

      console.log('[Socket.IO] access_token cookie found, verifying JWT...');
      const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
      
      try {
        const decoded = jwt.verify(token, jwtSecret) as any;
        socket.data.user = {
          userId: decoded.userId,
          collection: decoded.collection,
        } as AuthenticatedSocket;
        
        console.log(`[Socket.IO] Socket authenticated for user: ${decoded.userId}`);
        next();
      } catch (jwtError) {
        console.error('[Socket.IO] JWT verification failed:', jwtError);
        next(new Error("Authentication error: Invalid access_token"));
      }
    } catch (err) {
      console.error('[Socket.IO] Authentication process failed:', err);
      next(new Error("Authentication error: " + (err instanceof Error ? err.message : "Unknown error")));
    }
  }

  private extractToken(socket: any): string | null {
    console.log('[Socket.IO] Extracting token from socket handshake...');
    
    // Try cookie - this is the primary method when using withCredentials
    if (socket.handshake.headers?.cookie) {
      const cookieStr = socket.handshake.headers.cookie;
      console.log('[Socket.IO] Checking cookies for access_token. Raw cookie string:', cookieStr);
      
      // Try access_token cookie (primary cookie used in the app)
      const accessTokenMatch = cookieStr.match(/access_token=([^;]+)/);
      if (accessTokenMatch) {
        console.log('[Socket.IO] Token found in access_token cookie');
        return decodeURIComponent(accessTokenMatch[1]);
      }
    }

    console.log('[Socket.IO] No access_token cookie found in request');
    return null;
  }

  private handleConnection(socket: any) {
    const userId = socket.data.user.userId;
    this.userSockets.set(userId, socket.id);
    
    console.log(`[Socket.IO] User connected: ${userId}, socketId: ${socket.id}`);
    console.log(`[Socket.IO] Total connected users: ${this.userSockets.size}`);
    
    // Emit the list of online users to the newly connected user
    socket.emit("onlineUsers", Array.from(this.userSockets.keys()));
    console.log(`[Socket.IO] Sent online users list to ${userId}: ${Array.from(this.userSockets.keys()).join(', ')}`);
    
    // Join user to their chat rooms
    this.joinUserChats(userId);

    // Broadcast user's online status to all connected clients
    this.broadcastUserStatus(userId, "online");

    // Set up event listeners for this socket
    this.setupEventListeners(socket, userId);
  }

  private setupEventListeners(socket: any, userId: string) {
    socket.on("joinChat", (data: { chatId: string }) => {
      console.log(`[Socket.IO] User ${userId} joined chat ${data.chatId}`);
      socket.join(data.chatId);
    });

    socket.on("leaveChat", (data: { chatId: string }) => {
      console.log(`[Socket.IO] User ${userId} left chat ${data.chatId}`);
      socket.leave(data.chatId);
    });

    socket.on("typing", (data: { chatId: string; isTyping: boolean }) => {
      console.log(`[Socket.IO] User ${userId} typing in chat ${data.chatId}: ${data.isTyping}`);
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
      console.log(`[Socket.IO] Received message from user ${userId} in chat ${message.chatId}:`, message);
      try {
        await this.handleNewMessage(message);
      } catch (error) {
        console.error('[Socket.IO] Error handling new message:', error);
      }
    });

    socket.on("messageStatus", async (data: MessageStatusData) => {
      console.log(`[Socket.IO] Message status update from user ${userId}:`, data);
      try {
        await this.chatRepository.updateMessageStatus(data.messageId, data.status);
        socket.to(data.messageId).emit("messageStatus", data);
      } catch (error) {
        console.error('[Socket.IO] Error updating message status:', error);
      }
    });

    socket.on("removeReaction", (data: ReactionData) => {
      console.log(`[Socket.IO] User ${userId} removed reaction in chat ${data.chatId}:`, data);
      this.chatNamespace.to(data.chatId).emit("messageReactionRemoved", {
        messageId: data.messageId,
        userId: data.userId,
      });
    });

    socket.on("deleteMessage", (data: DeleteMessageData) => {
      console.log(`[Socket.IO] User ${userId} deleted message in chat ${data.chatId}:`, data);
      this.chatNamespace.to(data.chatId).emit("messageDeleted", {
        messageId: data.messageId,
        chatId: data.chatId,
      });
    });

    socket.on("disconnect", (reason: string) => {
      console.log(`[Socket.IO] User disconnected: ${userId}, socketId: ${socket.id}, reason: ${reason}`);
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