import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { getUserSiteSectionsComposer } from '../../../infrastructure/services/site-management/UserSiteSectionComposers';

const userSiteSectionRouter = Router();
const userSiteSectionController = getUserSiteSectionsComposer();

// Single route with query parameter to match frontend
userSiteSectionRouter.get('/', (req, res) =>
  expressAdapter(req, res, userSiteSectionController.getSections.bind(userSiteSectionController))
);

export default userSiteSectionRouter; 