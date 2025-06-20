import { Router } from 'express';
import { VideoComposer } from '../../../infrastructure/services/vedios/VideoComposer';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { contentVideoUploadWithErrorHandling } from '../../../config/cloudinary.config';

const router = Router();
const videoController = VideoComposer.composeVideoController();

router.post(
    '/categories/:category/videos',
    authMiddleware as any,
    contentVideoUploadWithErrorHandling,
    (req, res) => {
        console.log('\n🎬 === VIDEO CREATION ROUTE START ===');
        console.log('📋 Request details:', {
            method: req.method,
            url: req.url,
            params: req.params,
            headers: {
                'content-type': req.headers['content-type'],
                'content-length': req.headers['content-length']
            }
        });
        console.log('📁 File details:', req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : 'No file uploaded');
        console.log('📝 Body data:', req.body);
        console.log('👤 User info:', {
            userId: req.user?.id
        });

        req.body.category = req.params.category;
        console.log('✅ Category added to body:', req.body.category);

        console.log('🎬 === CALLING VIDEO CONTROLLER ===');
        expressAdapter(req, res, videoController.createVideo.bind(videoController));
    }
);

router.get(
    '/videos',
    authMiddleware as any,
    (req, res) => expressAdapter(req, res, videoController.getVideos.bind(videoController))
);

router.get(
    '/videos/:id',
    authMiddleware as any,
    (req, res) => expressAdapter(req, res, videoController.getVideoById.bind(videoController))
);

router.put(
    '/videos/:id',
    authMiddleware as any,
    contentVideoUploadWithErrorHandling,
    (req, res) => {
        console.log('\n🎬 === VIDEO UPDATE ROUTE START ===');
        console.log('📋 Update request details:', {
            method: req.method,
            url: req.url,
            params: req.params,
            headers: {
                'content-type': req.headers['content-type'],
                'content-length': req.headers['content-length']
            }
        });
        console.log('📁 File details:', req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : 'No file uploaded');
        console.log('📝 Body data:', req.body);
        console.log('👤 User info:', {
            userId: req.user?.id
        });

        console.log('🎬 === CALLING VIDEO CONTROLLER ===');
        expressAdapter(req, res, videoController.updateVideo.bind(videoController));
    }
);

router.delete(
    '/videos/:id',
    authMiddleware as any,
    (req, res) => expressAdapter(req, res, videoController.deleteVideo.bind(videoController))
);

export default router; 