import { Server as SocketIOServer, Namespace } from "socket.io";
import { Server as HTTPServer } from "http";
import { ChatRepository } from "../../repositories/chat/ChatRepository";
import { MessageStatus } from "../../../domain/chat/entities/Message";
import jwt from "jsonwebtoken";

export class SocketService {
  private io: SocketIOServer;
  private chatNamespace: Namespace;
  private chatRepository: ChatRepository;
  private userSockets: Map<string, string> = new Map();

  constructor(server: HTTPServer) {

    this.io = new SocketIOServer(server, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      },
      transports: ["websocket", "polling"],
      path: '/socket.io',
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.chatNamespace = this.io.of('/chat');
    this.chatRepository = new ChatRepository();

    this.io.on('connection', (socket) => {
    });

    this.io.on('error', (error) => {
      console.error('\n=== Socket.IO Server Error ===');
      console.error('Error details:', error);
    });

    this.chatNamespace.on('error', (error) => {
      console.error('\n=== Chat Namespace Error ===');
      console.error('Error details:', error);
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.chatNamespace.use((socket, next) => {

      let token = socket.handshake.auth.token;
      if (typeof token !== 'string') {
        if (typeof token === 'object' && token !== null) {
          if (socket.handshake.headers.cookie) {
            const match = socket.handshake.headers.cookie.match(/auth_token=([^;]+)/);
            if (match) {
              token = match[1];
            } else {
              token = '';
            }
          } else {
            token = '';
          }
        } else {
          token = String(token);
        }
      }
      if (!token) {
        console.error('Authentication failed: No token provided');
        return next(new Error("Authentication error: No token provided"));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret") as any;
        socket.data.user = {
          id: decoded.userId,
          collection: decoded.collection,
        };

        next();
      } catch (err) {
        console.error('Authentication failed:', {
          error: err,
          token: typeof token === 'string' ? token.substring(0, 20) + '...' : token
        });
        next(new Error("Authentication error: Invalid token"));
      }
    });

    this.chatNamespace.on("connection", (socket) => {
      const userId = socket.data.user.id;
      this.userSockets.set(userId, socket.id);
      // Send the list of currently online users to the newly connected socket
      socket.emit("onlineUsers", Array.from(this.userSockets.keys()));
      this.joinUserChats(userId);

      console.log(`[Socket.IO] User connected: ${userId}, socket id: ${socket.id}`);

      // Emit online status to all
      this.chatNamespace.emit("userStatus", { userId, status: "online" });
      // Emit online status for all other users to the newly connected user
      Array.from(this.userSockets.keys()).forEach(id => {
        if (id !== userId) {
          socket.emit("userStatus", { userId: id, status: "online" });
        }
      });

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

      socket.on("message", async (message: any) => {
        if (!message.chatId) {
          console.error('Received message with undefined chatId:', message);
          return;
        }
        try {
          await this.handleNewMessage(message);
        } catch (error) {
          console.error('Error handling new message:', error);
        }
      });

      socket.on("messageStatus", async (data: { messageId: string; status: MessageStatus }) => {
        try {
          await this.chatRepository.updateMessageStatus(data.messageId, data.status);
          socket.to(data.messageId).emit("messageStatus", data);
        } catch (error) {
          console.error('Error updating message status:', error);
        }
      });

      socket.on("removeReaction", (data: { messageId: string; userId: string; chatId: string }) => {
        this.handleRemoveReaction(data.messageId, data.userId, data.chatId);
      });

      socket.on("deleteMessage", (data: { messageId: string; chatId: string }) => {
        this.handleDeleteMessage(data.messageId, data.chatId);
      });

      socket.on("disconnect", (reason) => {
        const userId = this.getUserIdBySocketId(socket.id);
        if (userId) {
          this.userSockets.delete(userId);
          console.log(`[Socket.IO] User disconnected: ${userId}, socket id: ${socket.id}, reason: ${reason}`);
          this.chatNamespace.emit("userStatus", { userId, status: "offline" });
          console.log(`[Socket.IO] Emitted userStatus: offline for user ${userId}`);
        } else {
        }
      });
    });

  }

  private joinUserChats(userId: string) {
    this.chatRepository
      .getChats({ userId, page: 1, limit: 100 })
      .then((response) => {
        response.data.forEach((chat) => {
          const socketId = this.userSockets.get(userId);
          if (socketId) {
            this.chatNamespace.sockets.get(socketId)?.join(chat.id);
          }
        });
      })
      .catch((error) => {
        console.error('Error joining user chats:', {
          userId,
          error
        });
      });
  }

  private getUserIdBySocketId(socketId: string): string | undefined {
    for (const [userId, sid] of this.userSockets.entries()) {
      if (sid === socketId) return userId;
    }
    return undefined;
  }

  public async handleNewMessage(message: any) {
    const chatId = message.chatId;
    // No longer save the message here. Only emit the message to the chat room.
    this.chatNamespace.to(chatId).emit("message", message);
    // ...rest of your code ...
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
  }

  public async handleMessageRead(chatId: string, userId: string) {
    this.chatNamespace.to(chatId).emit("messageStatus", {
      chatId,
      userId,
      status: "read"
    });
  }

  public async handleReaction(messageId: string, reaction: any) {
    const message = await this.chatRepository.getChatMessages({
      chatId: reaction.chatId,
      userId: reaction.userId,
      page: 1,
      limit: 1,
    });
    if (message.data.length > 0) {
      const reactionData = reaction.emoji ? reaction : { userId: reaction.userId };
      this.chatNamespace.to(reaction.chatId).emit("messageReaction", {
        messageId,
        reaction: reactionData,
      });
    }
  }

  public async handleUserStatus(userId: string, status: "online" | "offline") {
    this.chatNamespace.emit("userStatus", { userId, status });
  }

  public async handleRemoveReaction(messageId: string, userId: string, chatId: string) {
    this.chatNamespace.to(chatId).emit("messageReactionRemoved", {
      messageId,
      userId,
    });
  }

  public async handleDeleteMessage(messageId: string, chatId: string) {
    this.chatNamespace.to(chatId).emit("messageDeleted", {
      messageId,
      chatId,
    });
  }

  public async handleUpdatedChat(chat: any) {
    if (!chat || !chat.id) return;
    this.chatNamespace.to(chat.id).emit('chat', chat);
  }
} 