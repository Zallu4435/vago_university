import { Request, Response, NextFunction } from 'express';
import { updateProfile } from '../../application/use-cases/settings/updateProfile';
import { changePassword } from '../../application/use-cases/settings/changePassword';
import { updateProfilePicture } from '../../application/use-cases/settings/updateProfilePicture';
import { getProfile } from '../../application/use-cases/settings/getProfile';

class ProfileController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // From auth middleware

      console.log(`Received GET /api/profile for user:`, { userId });

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const result = await getProfile.execute({ userId });

      res.status(200).json(result);
    } catch (err) {
      console.error(`Error in getProfile:`, err);
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, phone, email } = req.body;
      const userId = req.user?.id; // From auth middleware

      console.log(`Received PUT /api/profile with body:`, {
        firstName,
        lastName,
        phone,
        email,
      });

      if (!userId) {
        throw new Error('User not authenticated');
      }

    //   if (!firstName || !lastName || !phone || !email) {
    //     throw new Error('All fields are required');
    //   }

      const result = await updateProfile.execute({
        userId,
        firstName,
        lastName,
        phone,
        email,
      });

      res.status(200).json(result);
    } catch (err) {
      console.error(`Error in updateProfile:`, err);
      next(err);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;

      const userId = req.user?.id; // From auth middleware

      console.log(`Received POST /api/password with body:`, { userId });

      if (!userId) {
        throw new Error('User not authenticated');
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('All password fields are required');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('New password and confirmation do not match');
      }

      await changePassword.execute({
        userId,
        currentPassword,
        newPassword,
      });

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error(`Error in changePassword:`, err);
      next(err);
    }
  }

  async uploadProfilePicture(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // From auth middleware
      const file = req.file;

      console.log(`Received POST /api/profile-picture for user:`, { userId });

      if (!userId) {
        throw new Error('User not authenticated');
      }

      if (!file) {
        throw new Error('Profile picture file is required');
      }

      const result = await updateProfilePicture.execute({
        userId,
        filePath: file.path, // Cloudinary URL
      });

      res.status(200).json({ url: result.profilePicture });
    } catch (err) {
      console.error(`Error in uploadProfilePicture:`, err);
      next(err);
    }
  }
}

export const profileController = new ProfileController();