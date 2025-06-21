import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { getSiteSectionsComposer } from '../../../infrastructure/services/site-management/SiteSectionComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';

const siteSectionRouter = Router();
const siteSectionController = getSiteSectionsComposer();

siteSectionRouter.get('/', authMiddleware, (req, res) =>
  expressAdapter(req, res, siteSectionController.getSections.bind(siteSectionController))
);
siteSectionRouter.get('/:id', authMiddleware, (req, res) =>
  expressAdapter(req, res, siteSectionController.getSectionById.bind(siteSectionController))
);
siteSectionRouter.post('/', authMiddleware, (req, res) =>
  expressAdapter(req, res, siteSectionController.createSection.bind(siteSectionController))
);
siteSectionRouter.put('/:id', authMiddleware, (req, res) =>
  expressAdapter(req, res, siteSectionController.updateSection.bind(siteSectionController))
);
siteSectionRouter.delete('/:id', authMiddleware, (req, res) =>
  expressAdapter(req, res, siteSectionController.deleteSection.bind(siteSectionController))
);

export default siteSectionRouter;