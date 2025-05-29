import { Router } from "express";
import { clubController } from "../controllers/clubController";

const router = Router();

router.get("/club-requests", clubController.getClubRequests);
router.get("/club-requests/:id", clubController.getClubRequestDetails);
router.post("/club-requests/:id/approve", clubController.approveClubRequest);
router.post("/club-requests/:id/reject", clubController.rejectClubRequest);

router.get("/", clubController.getClubs);
router.get("/:id", clubController.getClubById);
router.post("/", clubController.createClub);
router.put("/:id", clubController.updateClub);
router.delete("/:id", clubController.deleteClub);

export default router;
