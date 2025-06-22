import { Router } from "express";
import { profilePictureUpload } from "../../../config/cloudinary.config";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getProfileComposer } from "../../../infrastructure/services/profile/ProfileComposers";

const profileRouter = Router();
const profileController = getProfileComposer();

profileRouter.get(
  "/",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, profileController.getProfile.bind(profileController))
);

profileRouter.put(
  "/",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, profileController.updateProfile.bind(profileController))
);

profileRouter.post(
  "/password",
  authMiddleware,
  (req, res, next) => expressAdapter(req, res, profileController.changePassword.bind(profileController))
);

profileRouter.post(
  "/profile-picture",
  authMiddleware,
  profilePictureUpload.single("profilePicture"),
  (req, res, next) => expressAdapter(req, res, profileController.updateProfilePicture.bind(profileController))
);

export default profileRouter;