import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { getUserSiteSectionsComposer } from '../../../infrastructure/services/site-management/UserSiteSectionComposers';

const userSiteSectionRouter = Router();
const userSiteSectionController = getUserSiteSectionsComposer();

userSiteSectionRouter.get('/', (req, res) =>
  expressAdapter(req, res, userSiteSectionController.getSections.bind(userSiteSectionController))
);

export default userSiteSectionRouter; 