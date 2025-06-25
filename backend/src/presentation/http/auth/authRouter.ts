import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getAuthComposer } from "../../../infrastructure/services/auth/AuthComposers";
import { facultyUpload } from "../../../config/cloudinary.config";

const authRouter = Router();
const authController = getAuthComposer();

authRouter.post("/register", (req, res, next) => expressAdapter(req, res, authController.register.bind(authController)));

authRouter.post("/login", (req, res, next) => expressAdapter(req, res, authController.login.bind(authController)));

authRouter.post("/refresh-token", (req, res, next) => expressAdapter(req, res, authController.refreshToken.bind(authController)));

authRouter.post("/logout", (req, res, next) => expressAdapter(req, res, authController.logout.bind(authController)));

authRouter.post(
  "/faculty/request",
  facultyUpload.fields([
    { name: "cv", maxCount: 1 },
    { name: "certificates", maxCount: 5 },
  ]),
  (req, res, next) => expressAdapter(req, res, authController.registerFaculty.bind(authController))
);

authRouter.post("/send-email-otp", (req, res, next) => expressAdapter(req, res, authController.sendEmailOtp.bind(authController)));

authRouter.post("/verify-email-otp", (req, res, next) => expressAdapter(req, res, authController.verifyEmailOtp.bind(authController)));

authRouter.post("/reset-password", (req, res, next) => expressAdapter(req, res, authController.resetPassword.bind(authController)));

authRouter.post("/confirm-registration", (req, res, next) => expressAdapter(req, res, authController.confirmRegistration.bind(authController)));

export default authRouter;