import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getChatComposer } from "../../../infrastructure/services/chat/ChatComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";
import { chatAttachmentUpload } from '../../../config/cloudinary.config';

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

chatRouter.post(
  "/:chatId/messages",
  authMiddleware,
  chatAttachmentUpload.array('files'),
  (req, res) => expressAdapter(req, res, chatController.sendMessage.bind(chatController))
);

// Message editing and deletion routes
chatRouter.put("/:chatId/messages/:messageId", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.editMessage.bind(chatController))
);

chatRouter.delete("/:chatId/messages/:messageId", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.deleteMessage.bind(chatController))
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

// Group chat routes
chatRouter.post("/group", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.createGroupChat.bind(chatController))
);

chatRouter.post("/group/:chatId/members", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.addGroupMember.bind(chatController))
);

chatRouter.delete("/group/:chatId/members/:userId", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.removeGroupMember.bind(chatController))
);

chatRouter.patch("/group/:chatId/admins/:userId", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.updateGroupAdmin.bind(chatController))
);

chatRouter.patch("/group/:chatId/settings", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.updateGroupSettings.bind(chatController))
);

chatRouter.patch("/group/:chatId", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.updateGroupInfo.bind(chatController))
);

chatRouter.post("/group/:chatId/leave", authMiddleware, (req, res) =>
  expressAdapter(req, res, chatController.leaveGroup.bind(chatController))
);

export default chatRouter;