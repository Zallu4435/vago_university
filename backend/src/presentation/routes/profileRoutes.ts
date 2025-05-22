import { Router } from 'express';
import { profileController } from '../controllers/profileController';
import { profilePictureUpload } from '../../config/cloudinary.config';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

router.get('/profile', authMiddleware, profileController.getProfile);
router.put('/profile', authMiddleware, profileController.updateProfile);
router.post('/password', authMiddleware, profileController.changePassword);
router.post(
  '/profile-picture',
  authMiddleware,
  profilePictureUpload.single('profilePicture'),
  profileController.uploadProfilePicture
);

export default router;