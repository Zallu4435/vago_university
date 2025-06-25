import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { MaterialComposers } from '../../../infrastructure/services/materials/MaterialComposers';
import multer from 'multer';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { materialUpload } from '../../../config/cloudinary.config';

const materialController = MaterialComposers.composeMaterialController();
const router = Router();

router.get('/', authMiddleware, (req, res) => expressAdapter(req, res, materialController.getMaterials.bind(materialController)));
router.get('/:id', authMiddleware, (req, res) => expressAdapter(req, res, materialController.getMaterialById.bind(materialController)));

router.post('/', authMiddleware, (req, res) => {
    materialUpload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('[MaterialRoute] Multer error:', err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File size too large. Maximum size is 20MB' });
            }
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            console.error('[MaterialRoute] Upload error:', err);
            return res.status(400).json({ success: false, message: err.message });
        }
        if (!req.file) {
            console.error('[MaterialRoute] No file was uploaded');
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        expressAdapter(req, res, materialController.createMaterial.bind(materialController));
    });
});

router.put('/:id', authMiddleware, (req, res) => {
    materialUpload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('[MaterialRoute] Multer error:', err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File size too large. Maximum size is 20MB' });
            }
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            console.error('[MaterialRoute] Upload error:', err);
            return res.status(400).json({ success: false, message: err.message });
        }
        if (req.file) {
            console.log('[MaterialRoute] File received:', req.file);
        } else {
            console.log('[MaterialRoute] No file uploaded (update may be metadata only)');
        }
        expressAdapter(req, res, materialController.updateMaterial.bind(materialController));
    });
});

router.delete('/:id', authMiddleware, (req, res) => expressAdapter(req, res, materialController.deleteMaterial.bind(materialController)));

export default router; 