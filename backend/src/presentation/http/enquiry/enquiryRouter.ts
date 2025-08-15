import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getEnquiryComposer } from "../../../infrastructure/services/enquiry/EnquiryComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const enquiryRouter = Router();
const enquiryController = getEnquiryComposer();

enquiryRouter.post("/", (req, res, next) => expressAdapter(req, res, next, enquiryController.createEnquiry.bind(enquiryController)));

enquiryRouter.get("/", authMiddleware, (req, res, next) => expressAdapter(req, res, next, enquiryController.getEnquiries.bind(enquiryController)));

enquiryRouter.get("/:id", authMiddleware, (req, res, next) => expressAdapter(req, res, next, enquiryController.getEnquiryById.bind(enquiryController)));

enquiryRouter.patch("/:id/status", authMiddleware, (req, res, next) => expressAdapter(req, res, next, enquiryController.updateEnquiryStatus.bind(enquiryController)));

enquiryRouter.post("/:id/reply", authMiddleware, (req, res, next) => expressAdapter(req, res, next, enquiryController.sendReply.bind(enquiryController)));

enquiryRouter.delete("/:id", authMiddleware, (req, res, next) => expressAdapter(req, res, next, enquiryController.deleteEnquiry.bind(enquiryController)));

export default enquiryRouter; 