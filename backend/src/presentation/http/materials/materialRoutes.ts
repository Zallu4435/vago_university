import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { MaterialComposers } from '../../../infrastructure/services/materials/MaterialComposers';

const materialController = MaterialComposers.composeMaterialController();
const router = Router();

router.get('/', (req, res) => expressAdapter(req, res, materialController.getMaterials.bind(materialController)));
router.get('/:id', (req, res) => expressAdapter(req, res, materialController.getMaterialById.bind(materialController)));
router.post('/', (req, res) => expressAdapter(req, res, materialController.createMaterial.bind(materialController)));
router.put('/:id', (req, res) => expressAdapter(req, res, materialController.updateMaterial.bind(materialController)));
router.delete('/:id', (req, res) => expressAdapter(req, res, materialController.deleteMaterial.bind(materialController)));

export default router; 