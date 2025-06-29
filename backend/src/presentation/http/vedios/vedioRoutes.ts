import { Router, Request, Response } from 'express';
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
    (req: Request, res: Response) => {
        req.body.category = req.params.category;
        expressAdapter(req, res, videoController.createVideo.bind(videoController));
    }
);

router.get(
    '/videos',
    authMiddleware as any,
    (req: Request, res: Response) => expressAdapter(req, res, videoController.getVideos.bind(videoController))
);

router.get(
    '/videos/:id',
    authMiddleware as any,
    (req: Request, res: Response) => expressAdapter(req, res, videoController.getVideoById.bind(videoController))
);

router.put(
    '/videos/:id',
    authMiddleware as any,
    contentVideoUploadWithErrorHandling,
    (req: Request, res: Response) => {
        expressAdapter(req, res, videoController.updateVideo.bind(videoController));
    }
);

router.delete(
    '/videos/:id',
    authMiddleware as any,
    (req: Request, res: Response) => expressAdapter(req, res, videoController.deleteVideo.bind(videoController))
);

export default router; 