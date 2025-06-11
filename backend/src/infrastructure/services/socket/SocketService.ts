import { Server as SocketIOServer, Namespace } from "socket.io";
import { Server as HTTPServer } from "http";
import { ChatRepository } from "../../repositories/chat/ChatRepository";
import { MessageStatus } from "../../../domain/chat/entities/Message";
import jwt from "jsonwebtoken";

export class SocketService {
  private io: SocketIOServer;
  private chatNamespace: Namespace;
  private chatRepository: ChatRepository;
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HTTPServer) {
    console.log('\n=== Socket.IO Service Initialization Started ===');
    console.log('Server details:', {
      port: server.address(),
      type: server.constructor.name
    });
    
    // Initialize Socket.IO with CORS and proper path
    console.log('\nCreating Socket.IO server with config...');
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
    console.log('Socket.IO server created successfully');

    // Create chat namespace with proper path
    console.log('\nCreating chat namespace...');
    this.chatNamespace = this.io.of('/chat');
    this.chatRepository = new ChatRepository();
    console.log('Chat namespace created at /chat');

    // Add connection logging for main socket
    this.io.on('connection', (socket) => {
      console.log('\n=== Main Socket Connection ===');
      console.log('Socket ID:', socket.id);
      console.log('Connection details:', {
        handshake: {
          address: socket.handshake.address,
          time: socket.handshake.time,
          url: socket.handshake.url,
          query: socket.handshake.query
        }
      });
    });

    // Add error handling
    this.io.on('error', (error) => {
      console.error('\n=== Socket.IO Server Error ===');
      console.error('Error details:', error);
    });

    this.chatNamespace.on('error', (error) => {
      console.error('\n=== Chat Namespace Error ===');
      console.error('Error details:', error);
    });

    console.log('\nSetting up socket handlers...');
    this.setupSocketHandlers();
    console.log('=== Socket.IO Service Initialization Complete ===\n');
  }

  private setupSocketHandlers() {
    console.log('\n=== Setting up Socket Handlers ===');
    
    // Authentication middleware for chat namespace
    this.chatNamespace.use((socket, next) => {
      console.log('\n=== Authentication Attempt ===');
      console.log('Socket ID:', socket.id);
      console.log('Connection details:', {
        auth: socket.handshake.auth, 
        headers: socket.handshake.headers,
        query: socket.handshake.query,
        address: socket.handshake.address,
        time: socket.handshake.time,
        url: socket.handshake.url
      });

      let token = socket.handshake.auth.token;
      // Ensure token is a string
      if (typeof token !== 'string') {
        // If token is an object (incorrect), try to get from cookies or stringify
        if (typeof token === 'object' && token !== null) {
          // Try to get from cookies (if available)
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
        console.log('Verifying JWT token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret") as any;
        socket.data.user = {
          id: decoded.userId,
          collection: decoded.collection,
        };
        console.log('Authentication successful:', {
          userId: decoded.userId,
          collection: decoded.collection,
          token: token.substring(0, 20) + '...'
        });
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
      console.log('\n=== New Chat Namespace Connection ===');
      console.log('Socket ID:', socket.id);
      console.log('User Data:', socket.data.user);
      console.log('Connection state:', {
        connected: socket.connected,
        disconnected: socket.disconnected,
        handshake: {
          address: socket.handshake.address,
          time: socket.handshake.time,
          url: socket.handshake.url
        }
      });
      
      const userId = socket.data.user.id;
      this.userSockets.set(userId, socket.id);
      
      console.log('User connected:', {
        userId,
        socketId: socket.id,
        totalConnections: this.userSockets.size
      });
      
      this.joinUserChats(userId);

      // Join chat room
      socket.on("joinChat", (data: { chatId: string }) => {
        console.log('\n=== Join Chat Event ===');
        console.log('User joining chat:', {
          userId,
          chatId: data.chatId,
          socketId: socket.id
        });
        socket.join(data.chatId);
      });

      // Leave chat room
      socket.on("leaveChat", (data: { chatId: string }) => {
        console.log('\n=== Leave Chat Event ===');
        console.log('User leaving chat:', {
          userId,
          chatId: data.chatId,
          socketId: socket.id
        });
        socket.leave(data.chatId);
      });

      // Handle typing status
      socket.on("typing", (data: { chatId: string; isTyping: boolean }) => {
        console.log('\n=== Typing Event ===');
        console.log('User typing:', {
          userId,
          chatId: data.chatId,
          isTyping: data.isTyping
        });
        socket.to(data.chatId).emit("typing", {
          userId,
          chatId: data.chatId,
          isTyping: data.isTyping
        });
      });

      // Handle new messages
      socket.on("message", async (message: any) => {
        console.log('\n=== New Message Event ===');
        console.log('Message received:', {
          chatId: message.chatId,
          senderId: message.senderId,
          type: message.type,
          content: message.content?.substring(0, 50) + '...' // Log only part of the content
        });
        try {
          await this.handleNewMessage(message);
        } catch (error) {
          console.error('Error handling new message:', error);
        }
      });

      // Handle message status updates
      socket.on("messageStatus", async (data: { messageId: string; status: MessageStatus }) => {
        console.log('\n=== Message Status Update ===');
        console.log('Status update:', {
          messageId: data.messageId,
          status: data.status
        });
        try {
          await this.chatRepository.updateMessageStatus(data.messageId, data.status);
          socket.to(data.messageId).emit("messageStatus", data);
        } catch (error) {
          console.error('Error updating message status:', error);
        }
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log('\n=== Socket Disconnection ===');
        const userId = this.getUserIdBySocketId(socket.id);
        if (userId) {
          this.userSockets.delete(userId);
          this.chatNamespace.emit("userStatus", { userId, status: "offline" });
          console.log('User disconnected:', {
            userId,
            socketId: socket.id,
            remainingConnections: this.userSockets.size
          });
        }
      });
    });

    console.log('=== Socket Handlers Setup Complete ===\n');
  }

  private joinUserChats(userId: string) {
    console.log('\n=== Joining User Chats ===');
    console.log('User ID:', userId);
    
    this.chatRepository
      .getChats({ userId, page: 1, limit: 100 })
      .then((response) => {
        console.log('Found chats for user:', {
          userId,
          chatCount: response.data.length
        });
        
        response.data.forEach((chat) => {
          const socketId = this.userSockets.get(userId);
          if (socketId) {
            this.chatNamespace.sockets.get(socketId)?.join(chat.id);
            console.log('User joined chat:', {
              userId,
              chatId: chat.id,
              socketId
            });
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
    this.chatNamespace.to(chatId).emit("message", message);

    // Update message status to delivered for all participants
    const chat = await this.chatRepository.getChatDetails(chatId);
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
      // If removing a reaction, send the userId only
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
} 