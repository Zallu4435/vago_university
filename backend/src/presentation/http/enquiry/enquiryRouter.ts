import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getEnquiryComposer } from "../../../infrastructure/services/enquiry/EnquiryComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const enquiryRouter = Router();
const enquiryController = getEnquiryComposer();

// Public routes (no auth required)
enquiryRouter.post("/", async (req, res, next) => {
  await expressAdapter(req, res, enquiryController.createEnquiry.bind(enquiryController));
});

// Protected routes (auth required)
enquiryRouter.get("/", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, enquiryController.getEnquiries.bind(enquiryController));
});

enquiryRouter.get("/:id", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, enquiryController.getEnquiryById.bind(enquiryController));
});

enquiryRouter.patch("/:id/status", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, enquiryController.updateEnquiryStatus.bind(enquiryController));
});

enquiryRouter.post("/:id/reply", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, enquiryController.sendReply.bind(enquiryController));
});

enquiryRouter.delete("/:id", authMiddleware, async (req, res, next) => {
  await expressAdapter(req, res, enquiryController.deleteEnquiry.bind(enquiryController));
});

export default enquiryRouter; 