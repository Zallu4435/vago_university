import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Register } from '../../infrastructure/database/mongoose/models/register.model';
import { Admin } from '../../infrastructure/database/mongoose/models/admin.model';
import { User } from '../../infrastructure/database/mongoose/models/user.model';
import { Faculty } from '../../infrastructure/database/mongoose/models/faculty.model';
import { Admission } from '../../infrastructure/database/mongoose/models/admission.model';

interface JwtPayload {
  userId: string;
  email: string;
  collection: 'register' | 'admin' | 'user' | 'faculty';
  firstName: string;
  lastName: string;
}

interface AuthenticatedUser {
  id: string;
  collection: 'register' | 'admin' | 'user' | 'faculty';
  firstName: string;
  lastName: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('authMiddleware: Missing or invalid Authorization header');
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    // console.log('authMiddleware: Token received:', token.slice(0, 10) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as JwtPayload;
    // console.log('authMiddleware: Token decoded:', decoded);

    let user;
    switch (decoded.collection) {
      case 'admin':
        user = await Admin.findById(decoded.userId);
        break;
      case 'user':
        user = await User.findById(decoded.userId);
        break;
      case 'faculty':
        user = await Faculty.findById(decoded.userId);
        break;
      case 'register':
        user = await Register.findById(decoded.userId);
        if (user) {
          const admission = await Admission.findOne({ registerId: user._id });
          if (admission) {
            console.error('authMiddleware: User has an admission and cannot access:', decoded.userId);
            return res.status(403).json({ error: 'User has already made an admission' });
          }
        }
        break;
      default:
        console.error('authMiddleware: Invalid collection:', decoded.collection);
        return res.status(403).json({ error: 'Invalid user collection' });
    }

    if (!user) {
      console.error('authMiddleware: User not found for userId:', decoded.userId, 'in collection:', decoded.collection);
      return res.status(401).json({ error: 'User not found in specified collection' });
    }

    // Attach user to request
    req.user = {
      id: decoded.userId,
      collection: decoded.collection,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };


    next();
  } catch (error: any) {
    console.error('authMiddleware: Error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};