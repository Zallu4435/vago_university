import { Router, Request, Response } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { makeUserMaterialController } from '../../../infrastructure/services/materials/UserMaterialComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';

const userMaterialRoutes = Router();
const userMaterialController = makeUserMaterialController();

// Get materials with filters
userMaterialRoutes.get('/', authMiddleware, (req: Request, res: Response) =>
  expressAdapter(req, res, userMaterialController.getMaterials.bind(userMaterialController))
);

// Get bookmarked materials
userMaterialRoutes.get('/bookmarks', authMiddleware, (req: Request, res: Response) =>
  expressAdapter(req, res, userMaterialController.getBookmarkedMaterials.bind(userMaterialController))
);

// Get liked materials
userMaterialRoutes.get('/likes', authMiddleware, (req: Request, res: Response) =>
  expressAdapter(req, res, userMaterialController.getLikedMaterials.bind(userMaterialController))
);

// Get material by ID
userMaterialRoutes.get('/:id', authMiddleware, (req: Request, res: Response) =>
  expressAdapter(req, res, userMaterialController.getMaterialById.bind(userMaterialController))
);

// Toggle bookmark
userMaterialRoutes.post('/:id/bookmark', authMiddleware, (req: Request, res: Response) =>
  expressAdapter(req, res, userMaterialController.toggleBookmark.bind(userMaterialController))
);

// Toggle like
userMaterialRoutes.post('/:id/like', authMiddleware, (req: Request, res: Response) =>
  expressAdapter(req, res, userMaterialController.toggleLike.bind(userMaterialController))
);

// Download material
userMaterialRoutes.get('/:id/download', authMiddleware, (req: Request, res: Response) =>
  expressAdapter(req, res, userMaterialController.downloadMaterial.bind(userMaterialController))
);

export default userMaterialRoutes