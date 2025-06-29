import { Router, Request, Response } from 'express';
import { User as UserModel } from '../../infrastructure/database/mongoose/models/user.model';
import { Faculty as FacultyModel } from '../../infrastructure/database/mongoose/models/faculty.model';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

// Endpoint to save FCM token for a user or faculty
router.post('/:type/:id/fcm-token', authMiddleware, async (req: Request, res: Response) => {
  try {
    console.log("reached here ");
    const { type, id } = req.params; // type: 'user' or 'faculty'
    const { token } = req.body; // FCM token from frontend

    console.log( type, id, token)
    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Invalid FCM token' });
      return;
    }

    // Check if user is authorized (matches ID or is admin)
    if (!req.user || (req.user.id !== id)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    let Model: typeof UserModel | typeof FacultyModel;
    if (type === 'user') {
      Model = UserModel;
    } else if (type === 'faculty') {
      Model = FacultyModel;
    } else {
      res.status(400).json({ error: 'Invalid type' });
      return;
    }

    // Add token to fcmTokens, avoiding duplicates
    const updated = await (Model as typeof UserModel).findByIdAndUpdate(
      id,
      { $addToSet: { fcmTokens: token } }, // Only add if not already present
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ error: `${type} not found` });
      return;
    }

    res.status(200).json({ message: 'FCM token saved' });
  } catch (error: any) {
    console.error('Error saving FCM token:', error);
    res.status(500).json({ error: 'Failed to save FCM token' });
  }
});

export default router;