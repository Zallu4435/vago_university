import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { MaterialComposers } from '../../../infrastructure/services/materials/MaterialComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { materialUpload } from '../../../config/cloudinary.config';

const materialController = MaterialComposers.composeMaterialController();
const router = Router();

router.get('/', authMiddleware, (req, res, next) => expressAdapter(req, res, next, materialController.getMaterials.bind(materialController)));
router.get('/:id', authMiddleware, (req, res, next) => expressAdapter(req, res, next, materialController.getMaterialById.bind(materialController)));

router.post('/', authMiddleware, materialUpload, (req, res, next) => {
  expressAdapter(req, res, next, materialController.createMaterial.bind(materialController));
});

router.put('/:id', authMiddleware, materialUpload, (req, res, next) => {
  expressAdapter(req, res, next, materialController.updateMaterial.bind(materialController));
});

router.delete('/:id', authMiddleware, (req, res, next) => expressAdapter(req, res, next, materialController.deleteMaterial.bind(materialController)));

export default router; 