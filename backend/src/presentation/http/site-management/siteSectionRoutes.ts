import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { getSiteSectionsComposer } from '../../../infrastructure/services/site-management/SiteSectionComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { siteSectionImageUpload } from '../../../config/cloudinary.config';

const SiteSectionRouter = Router();
const SiteSectionController = getSiteSectionsComposer();

SiteSectionRouter.get('/', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, SiteSectionController.getSections.bind(SiteSectionController))
);
SiteSectionRouter.get('/:id', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, SiteSectionController.getSectionById.bind(SiteSectionController))
);
SiteSectionRouter.post('/', authMiddleware, siteSectionImageUpload.single('image'), (req, res, next) =>
  expressAdapter(req, res, next, SiteSectionController.createSection.bind(SiteSectionController))
);
SiteSectionRouter.put('/:id', authMiddleware, siteSectionImageUpload.single('image'), (req, res, next) =>
  expressAdapter(req, res, next, SiteSectionController.updateSection.bind(SiteSectionController))
);
SiteSectionRouter.delete('/:id', authMiddleware, (req, res, next) =>
  expressAdapter(req, res, next, SiteSectionController.deleteSection.bind(SiteSectionController))
);

export default SiteSectionRouter;