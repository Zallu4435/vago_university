import { Router } from "express";
import { expressAdapter } from "../../adapters/ExpressAdapter";
import { getDiplomaComposer } from "../../../infrastructure/services/diploma/DiplomaComposers";
import { authMiddleware } from "../../../shared/middlewares/authMiddleware";

const diplomaRouter = Router();
const diplomaController = getDiplomaComposer();

diplomaRouter.get("/", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, diplomaController.getDiplomas.bind(diplomaController));
});

diplomaRouter.get("/:id", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, diplomaController.getDiplomaById.bind(diplomaController));
});

diplomaRouter.post("/", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, diplomaController.createDiploma.bind(diplomaController));
});

diplomaRouter.put("/:id", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, diplomaController.updateDiploma.bind(diplomaController));
});

diplomaRouter.delete("/:id", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, diplomaController.deleteDiploma.bind(diplomaController));
});

diplomaRouter.post("/:diplomaId/diploma-enrollments", authMiddleware, (req, res, next) => {
  expressAdapter(req, res, next, diplomaController.enrollStudent.bind(diplomaController));
});

export default diplomaRouter; 