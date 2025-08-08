import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { contentVideoUploadWithErrorHandling } from '../../../config/cloudinary.config';
import { getVideoComposer } from '../../../infrastructure/services/vedios/VideoComposer';

const router = Router();
const videoController = getVideoComposer();

router.post(
    '/categories/:category/videos',
    authMiddleware,
    contentVideoUploadWithErrorHandling,
    (req: Request, res: Response, next: NextFunction) => {
        req.body.category = req.params.category;
        expressAdapter(req, res, next, videoController.createVideo.bind(videoController));
    }
);

router.get(
    '/videos',
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => expressAdapter(req, res, next, videoController.getVideos.bind(videoController))
);

router.get(
    '/videos/:id',
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => expressAdapter(req, res, next, videoController.getVideoById.bind(videoController))
);

router.put(
    '/videos/:id',
    authMiddleware,
    contentVideoUploadWithErrorHandling,
    (req: Request, res: Response, next: NextFunction) => {
        console.log('🎬 [ROUTE] PUT /videos/:id - Video update route hit');
        expressAdapter(req, res, next, videoController.updateVideo.bind(videoController));
    }
);

router.delete(
    '/videos/:id',
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => expressAdapter(req, res, next, videoController.deleteVideo.bind(videoController))
);

export default router; 