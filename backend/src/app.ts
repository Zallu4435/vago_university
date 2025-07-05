import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./config/config";
import indexRoute from './presentation/routes/index'
import path from "path";
import { createServer } from "http";
import { Server as SocketIOServer } from 'socket.io';
import chatRouter from "./presentation/http/chat/chatRoutes";
import { setupSessionSocketHandlers } from './infrastructure/services/socket/SessionSocketService';

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://10.0.14.4:5173",
      "http://10.0.14.4:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Create a single Socket.IO server instance
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://10.0.14.4:5173",
      "http://10.0.14.4:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
  path: '/socket.io',
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Initialize Socket.IO services
console.log('Initializing Socket.IO services...');
import { SocketService } from "./infrastructure/services/socket/SocketService";
const socketService = new SocketService(io);
setupSessionSocketHandlers(io);
console.log('Socket.IO services initialized');

// Routes
app.use("/api/chats", chatRouter);
app.use("/api", indexRoute);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong" });
});

// MongoDB connection
mongoose
  .connect(config.database.mongoUri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

export { app, httpServer, socketService };