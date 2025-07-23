import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getAuthComposer } from "../../../infrastructure/services/auth/AuthComposers";
import { facultyUpload } from "../../../config/cloudinary.config";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const authRouter = Router();
const authController = getAuthComposer();

authRouter.post("/register", (req, res, next) => expressAdapter(req, res, next, authController.register.bind(authController)));

authRouter.post("/login", (req, res, next) => expressAdapter(req, res, next, authController.login.bind(authController)));

authRouter.post("/refresh-token", (req, res, next) => expressAdapter(req, res, next, authController.refreshToken.bind(authController)));

authRouter.post("/logout", (req, res, next) => expressAdapter(req, res, next, authController.logout.bind(authController)));

authRouter.post("/logout-all", (req, res, next) => expressAdapter(req, res, next, authController.logoutAll.bind(authController)));

authRouter.post(
  "/faculty/request",
  facultyUpload.fields([
    { name: "cv", maxCount: 1 },
    { name: "certificates", maxCount: 5 },
  ]),
  (req, res, next) => expressAdapter(req, res, next, authController.registerFaculty.bind(authController))
);

authRouter.post("/send-email-otp", (req, res, next) => expressAdapter(req, res, next, authController.sendEmailOtp.bind(authController)));

authRouter.post("/verify-email-otp", (req, res, next) => expressAdapter(req, res, next, authController.verifyEmailOtp.bind(authController)));

authRouter.post("/reset-password", (req, res, next) => expressAdapter(req, res, next, authController.resetPassword.bind(authController)));

authRouter.post("/confirm-registration", (req, res, next) => expressAdapter(req, res, next, authController.confirmRegistration.bind(authController)));

authRouter.get("/me", authMiddleware, (req, res, next) => expressAdapter(req, res, next, authController.me.bind(authController)));

export default authRouter;