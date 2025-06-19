import { Router } from 'express';
import { VideoComposer } from '../../../infrastructure/services/vedios/VideoComposer';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { contentVideoUploadWithErrorHandling } from '../../../config/cloudinary.config';

const router = Router();
const videoController = VideoComposer.composeVideoController();

// Create a new video for a diploma category
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

        // Add category from params to body
        req.body.category = req.params.category;
        console.log('✅ Category added to body:', req.body.category);
        
        console.log('🎬 === CALLING VIDEO CONTROLLER ===');
        expressAdapter(req, res, videoController.createVideo.bind(videoController));
    }
);

// Get all videos for a diploma category
router.get(
    '/videos',
    authMiddleware as any,
    (req, res) => expressAdapter(req, res, videoController.getVideos.bind(videoController))
);

// Get a specific video by ID
router.get(
    '/videos/:id',
    authMiddleware as any,
    (req, res) => expressAdapter(req, res, videoController.getVideoById.bind(videoController))
);

// Update a video
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

// Delete a video
router.delete(
    '/videos/:id',
    authMiddleware as any,
    (req, res) => expressAdapter(req, res, videoController.deleteVideo.bind(videoController))
);

export default router; 