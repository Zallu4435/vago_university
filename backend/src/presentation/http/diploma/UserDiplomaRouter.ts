import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getUserDiplomaComposer } from "../../../infrastructure/services/diploma/UserDiplomaComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const userDiplomaRouter = Router();
const userDiplomaController = getUserDiplomaComposer();

userDiplomaRouter.get("/", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.getUserDiplomas.bind(userDiplomaController));
});

userDiplomaRouter.get("/:id", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.getUserDiplomaById.bind(userDiplomaController));
});

userDiplomaRouter.get("/:courseId/chapters/:chapterId", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.getUserDiplomaChapter.bind(userDiplomaController));
});

userDiplomaRouter.post("/:courseId/chapters/:chapterId/progress", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.updateVideoProgress.bind(userDiplomaController));
});

userDiplomaRouter.post("/:courseId/chapters/:chapterId/complete", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.markChapterComplete.bind(userDiplomaController));
});

userDiplomaRouter.post("/:courseId/chapters/:chapterId/bookmark", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.toggleBookmark.bind(userDiplomaController));
});

userDiplomaRouter.get("/:courseId/completed-chapters", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.getCompletedChapters.bind(userDiplomaController));
});

userDiplomaRouter.get("/:courseId/bookmarked-chapters", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.getBookmarkedChapters.bind(userDiplomaController));
});

export default userDiplomaRouter; 