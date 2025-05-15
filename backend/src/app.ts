import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./config/env";
import indexRoute from './presentation/routes/index'

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust if frontend is hosted elsewhere
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api", indexRoute);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong" });
});

// MongoDB connection
mongoose
  .connect(config.mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default app;