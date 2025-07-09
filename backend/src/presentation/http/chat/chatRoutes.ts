import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getChatComposer } from "../../../infrastructure/services/chat/ChatComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";
import { chatAttachmentUpload } from '../../../config/cloudinary.config';
import { profilePictureUpload } from '../../../config/cloudinary.config';

const chatRouter = Router();
const chatController = getChatComposer();

chatRouter.get("/users/search", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.searchUsers.bind(chatController))
);

chatRouter.post("/", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.createChat.bind(chatController))
);

chatRouter.get("/", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.getChats.bind(chatController))
);

chatRouter.get("/search", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.searchChats.bind(chatController))
);

chatRouter.get("/:chatId", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.getChatDetails.bind(chatController))
);

chatRouter.get("/:chatId/messages", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.getChatMessages.bind(chatController))
);

chatRouter.post(
  "/:chatId/messages",
  authMiddleware,
  chatAttachmentUpload.array('files'),
  (req, res, next) => expressAdapter(req, res, next, chatController.sendMessage.bind(chatController))
);

chatRouter.put("/:chatId/messages/:messageId", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.editMessage.bind(chatController))
);

chatRouter.delete("/:chatId/messages/:messageId", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.deleteMessage.bind(chatController))
);

chatRouter.put("/:chatId/read", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.markMessagesAsRead.bind(chatController))
);

chatRouter.post("/messages/:messageId/reactions", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.addReaction.bind(chatController))
);

chatRouter.delete("/messages/:messageId/reactions", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.removeReaction.bind(chatController))
);

chatRouter.post("/group", authMiddleware, profilePictureUpload.single('avatar'), (req, res, next) =>
  expressAdapter(req, res, next, chatController.createGroupChat.bind(chatController))
);

chatRouter.post("/group/:chatId/members", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.addGroupMember.bind(chatController))
);

chatRouter.delete("/group/:chatId/members/:userId", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.removeGroupMember.bind(chatController))
);

chatRouter.patch("/group/:chatId/admins/:userId", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.updateGroupAdmin.bind(chatController))
);

chatRouter.patch("/group/:chatId/settings", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.updateGroupSettings.bind(chatController))
);

chatRouter.patch("/group/:chatId", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.updateGroupInfo.bind(chatController))
);

chatRouter.post("/group/:chatId/leave", authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, chatController.leaveGroup.bind(chatController))
);

chatRouter.delete('/:chatId', authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, chatController.deleteChat.bind(chatController));
});

chatRouter.post('/:chatId/block', authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, chatController.blockChat.bind(chatController));
});

chatRouter.delete('/:chatId/messages', authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, chatController.clearChat.bind(chatController));
});

export default chatRouter;