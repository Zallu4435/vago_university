import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getUserDiplomaComposer } from "../../../infrastructure/services/diploma/UserDiplomaComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const userDiplomaRouter = Router();
const userDiplomaController = getUserDiplomaComposer();

// Get all courses
userDiplomaRouter.get("/", authMiddleware, (req, res) => {
  expressAdapter(req, res, userDiplomaController.getUserDiplomas.bind(userDiplomaController));
});

// Get course by ID
userDiplomaRouter.get("/:id", authMiddleware, (req, res) => {
  expressAdapter(req, res, userDiplomaController.getUserDiplomaById.bind(userDiplomaController));
});

// Get chapter by ID
userDiplomaRouter.get("/:courseId/chapters/:chapterId", authMiddleware, (req, res) => {
  expressAdapter(req, res, userDiplomaController.getUserDiplomaChapter.bind(userDiplomaController));
});

// Update video progress
userDiplomaRouter.post("/:courseId/chapters/:chapterId/progress", authMiddleware, (req, res) => {
  expressAdapter(req, res, userDiplomaController.updateVideoProgress.bind(userDiplomaController));
});

// Mark chapter as complete
userDiplomaRouter.post("/:courseId/chapters/:chapterId/complete", authMiddleware, (req, res) => {
  expressAdapter(req, res, userDiplomaController.markChapterComplete.bind(userDiplomaController));
});

// Toggle bookmark
userDiplomaRouter.post("/:courseId/chapters/:chapterId/bookmark", authMiddleware, (req, res) => {
  expressAdapter(req, res, userDiplomaController.toggleBookmark.bind(userDiplomaController));
});

// Get completed chapters
userDiplomaRouter.get("/:courseId/completed-chapters", authMiddleware, (req, res) => {
  expressAdapter(req, res, userDiplomaController.getCompletedChapters.bind(userDiplomaController));
});

// Get bookmarked chapters
userDiplomaRouter.get("/:courseId/bookmarked-chapters", authMiddleware, (req, res) => {
  expressAdapter(req, res, userDiplomaController.getBookmarkedChapters.bind(userDiplomaController));
});

export default userDiplomaRouter; 