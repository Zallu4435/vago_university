import { Router, Request, Response, NextFunction } from 'express';
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
    (req: Request, res: Response, next: NextFunction) => {
        console.log('🎬 [ROUTE] POST /categories/:category/videos - Video upload route hit');
        req.body.category = req.params.category;
        expressAdapter(req, res, next, videoController.createVideo.bind(videoController));
    }
);

router.get(
    '/videos',
    authMiddleware as any,
    (req: Request, res: Response, next: NextFunction) => expressAdapter(req, res, next, videoController.getVideos.bind(videoController))
);

router.get(
    '/videos/:id',
    authMiddleware as any,
    (req: Request, res: Response, next: NextFunction) => expressAdapter(req, res, next, videoController.getVideoById.bind(videoController))
);

router.put(
    '/videos/:id',
    authMiddleware as any,
    contentVideoUploadWithErrorHandling,
    (req: Request, res: Response, next: NextFunction) => {
        console.log('🎬 [ROUTE] PUT /videos/:id - Video update route hit');
        expressAdapter(req, res, next, videoController.updateVideo.bind(videoController));
    }
);

router.delete(
    '/videos/:id',
    authMiddleware as any,
    (req: Request, res: Response, next: NextFunction) => expressAdapter(req, res, next, videoController.deleteVideo.bind(videoController))
);

export default router; 