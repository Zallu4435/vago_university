import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getChatComposer } from "../../../infrastructure/services/chat/ChatComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const chatRouter = Router();
const chatController = getChatComposer();

// User search route
chatRouter.get("/users/search", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.searchUsers.bind(chatController))
);

// Create chat route
chatRouter.post("/", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.createChat.bind(chatController))
);

// Chat routes
chatRouter.get("/", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.getChats.bind(chatController))
);

chatRouter.get("/search", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.searchChats.bind(chatController))
);

chatRouter.get("/:chatId", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.getChatDetails.bind(chatController))
);

chatRouter.get("/:chatId/messages", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.getChatMessages.bind(chatController))
);

chatRouter.post("/:chatId/messages", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.sendMessage.bind(chatController))
);

chatRouter.put("/:chatId/read", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.markMessagesAsRead.bind(chatController))
);

chatRouter.post("/messages/:messageId/reactions", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.addReaction.bind(chatController))
);

chatRouter.delete("/messages/:messageId/reactions", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.removeReaction.bind(chatController))
);

export default chatRouter; 