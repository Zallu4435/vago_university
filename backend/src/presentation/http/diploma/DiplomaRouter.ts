import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getDiplomaComposer } from "../../../infrastructure/services/diploma/DiplomaComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const diplomaRouter = Router();
const diplomaController = getDiplomaComposer();

diplomaRouter.get("/", authMiddleware, (req, res) => {
  expressAdapter(req, res, diplomaController.getDiplomas.bind(diplomaController));
});

diplomaRouter.get("/:id", authMiddleware, (req, res) => {
  expressAdapter(req, res, diplomaController.getDiplomaById.bind(diplomaController));
});

diplomaRouter.post("/", authMiddleware, (req, res) => {
  expressAdapter(req, res, diplomaController.createDiploma.bind(diplomaController));
});

diplomaRouter.put("/:id", authMiddleware, (req, res) => {
  expressAdapter(req, res, diplomaController.updateDiploma.bind(diplomaController));
});

diplomaRouter.delete("/:id", authMiddleware, (req, res) => {
  expressAdapter(req, res, diplomaController.deleteDiploma.bind(diplomaController));
});

export default diplomaRouter; 