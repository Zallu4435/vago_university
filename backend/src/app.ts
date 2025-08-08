import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/config";
import indexRoute from './presentation/routes/index'
import path from "path";
import { createServer } from "http";
import { Server as SocketIOServer } from 'socket.io';
import chatRouter from "./presentation/http/chat/chatRoutes";
import { setupSessionSocketHandlers } from './infrastructure/services/socket/SessionSocketService';
import Logger from "./shared/utils/logger";
import { loggerMiddleware } from "./shared/middlewares/loggerMiddleware";

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://10.0.14.4:5173",
    "http://10.0.14.4:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"]
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(loggerMiddleware);

const io = new SocketIOServer(httpServer, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
  path: '/socket.io',
  pingTimeout: 60000,
  pingInterval: 25000,
  cookie: true,
  allowEIO3: true
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check endpoint for Docker
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

Logger.info('Initializing Socket.IO services...');
import { SocketService } from "./infrastructure/services/socket/SocketService";
import { stringIdPlugin } from "./infrastructure/database/mongoose/plugins/stringId.plugin";
const socketService = new SocketService(io);
setupSessionSocketHandlers(io);
Logger.info('Socket.IO services initialized');

app.use("/api/chats", chatRouter);
app.use("/api", indexRoute);

app.use((err: CustomError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  Logger.error(`Error: ${err.message}`);
  Logger.error(`Stack: ${err.stack}`);
  Logger.debug(`Error object: ${JSON.stringify(err)}`);
  Logger.debug(`Error statusCode: ${err.statusCode}`);
  Logger.debug(`Error code: ${err.code}`);

  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Something went wrong",
    code: err.code || "INTERNAL_SERVER_ERROR"
  });
});

mongoose.plugin(stringIdPlugin);

mongoose
  .connect(config.database.mongoUri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
  })
  .then(() => Logger.info("MongoDB connected successfully"))
  .catch((err) => {
    Logger.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });

export { app, httpServer, socketService };