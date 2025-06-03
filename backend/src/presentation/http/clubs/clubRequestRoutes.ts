import { Router } from "express";
import { getClubRequestsComposer } from "../../../infrastructure/services/clubs/ClubRequestComposers";
import { adaptRoute } from "../../adapters/ExpressRouteAdapter";

export default (router: Router): void => {
  const clubRequestController = getClubRequestsComposer();

  router.get("/club-requests", adaptRoute(clubRequestController.getClubRequests));
  router.get("/club-requests/:id", adaptRoute(clubRequestController.getClubRequestDetails));
  router.post("/club-requests/:id/approve", adaptRoute(clubRequestController.approveClubRequest));
  router.post("/club-requests/:id/reject", adaptRoute(clubRequestController.rejectClubRequest));
}; 