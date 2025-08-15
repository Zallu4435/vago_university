import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getUserDiplomaComposer } from "../../../infrastructure/services/diploma/UserDiplomaComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const userDiplomaRouter = Router();
const userDiplomaController = getUserDiplomaComposer();

userDiplomaRouter.use(authMiddleware);

userDiplomaRouter.get("/", (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.getUserDiplomas.bind(userDiplomaController));
});

userDiplomaRouter.get("/:id", (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.getUserDiplomaById.bind(userDiplomaController));
});

userDiplomaRouter.get("/:courseId/chapters/:chapterId", (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.getUserDiplomaChapter.bind(userDiplomaController));
});

userDiplomaRouter.post("/:courseId/chapters/:chapterId/progress", (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.updateVideoProgress.bind(userDiplomaController));
});

userDiplomaRouter.post("/:courseId/chapters/:chapterId/complete", (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.markChapterComplete.bind(userDiplomaController));
});

userDiplomaRouter.post("/:courseId/chapters/:chapterId/bookmark", (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.toggleBookmark.bind(userDiplomaController));
});

userDiplomaRouter.get("/:courseId/completed-chapters", (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.getCompletedChapters.bind(userDiplomaController));
});

userDiplomaRouter.get("/:courseId/bookmarked-chapters", (req, res, next) => {
  expressAdapter(req, res, next, userDiplomaController.getBookmarkedChapters.bind(userDiplomaController));
});

export default userDiplomaRouter; 