import { Router } from 'express';
import { VideoComposer } from '../../../infrastructure/services/vedios/VideoComposer';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { videoUpload } from '../../../config/cloudinary.config';

const router = Router();
const videoController = VideoComposer.composeVideoController();

// Create a new video for a diploma category
router.post(
    '/categories/:category/videos',
    authMiddleware as any,
    (req, res) => {
        console.log('\n=== Video Upload Route ===');
        console.log('Request received:', {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body,
            params: req.params
        });

        // Add category from params to body
        req.body.category = req.params.category;
        
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
    videoUpload.single('videoFile'),
    (req, res) => expressAdapter(req, res, videoController.updateVideo.bind(videoController))
);

// Delete a video
router.delete(
    '/videos/:id',
    authMiddleware as any,
    (req, res) => expressAdapter(req, res, videoController.deleteVideo.bind(videoController))
);

export default router; 