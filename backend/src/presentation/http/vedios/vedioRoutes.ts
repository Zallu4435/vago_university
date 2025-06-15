import { Router } from 'express';
import { VideoController } from './videoController';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { videoUpload } from '../../../config/cloudinary.config';

const router = Router();
const videoController = new VideoController();

// Get all videos for a diploma category

router.get(
    '/videos',
    authMiddleware,
    (req, res) => expressAdapter(req, res, videoController.getVideos.bind(videoController))
); 

// Get a specific video
router.get(
    '/videos/:id',
    authMiddleware,
    (req, res) => expressAdapter(req, res, videoController.getVideoById.bind(videoController))
);

// Create a new video for a diploma category
router.post(
    '/categories/:category/videos',
    authMiddleware,
    videoUpload.single('videoFile'),
    (req, res) => expressAdapter(req, res, videoController.createVideo.bind(videoController))
);

// Update a video
router.put(
    '/videos/:id',
    authMiddleware,
    videoUpload.single('videoFile'),
    (req, res) => expressAdapter(req, res, videoController.updateVideo.bind(videoController))
);

// Delete a video
router.delete(
    '/videos/:id',
    authMiddleware,
    (req, res) => expressAdapter(req, res, videoController.deleteVideo.bind(videoController))
);

export default router; 