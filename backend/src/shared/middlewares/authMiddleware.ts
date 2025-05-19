import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Register } from '../../infrastructure/database/mongoose/models/register.model';

interface JwtPayload {
  userId: string;
  collection: 'register' | 'admin' | 'user' | 'faculty';
  firstName: string;
  lastName: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        collection: 'register' | 'admin' | 'user' | 'faculty';
        firstName: string;
        lastName: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log('authMiddleware: Processing request for', req.path);
  console.log('authMiddleware: Headers:', req.headers);

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('authMiddleware: Missing or invalid Authorization header');
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    console.log('authMiddleware: Token received:', token.slice(0, 10) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as JwtPayload;
    console.log('authMiddleware: Token decoded:', decoded);

    if (decoded.collection !== 'register') {
      console.error('authMiddleware: Access restricted, collection:', decoded.collection);
      return res.status(403).json({ error: 'Access restricted to register users' });
    }

    // Verify user exists in Register collection
    const user = await Register.findById(decoded.userId);
    if (!user) {
      console.error('authMiddleware: User not found for userId:', decoded.userId);
      return res.status(401).json({ error: 'User not found in Register collection' });
    }

    // Attach user to request
    req.user = {
      id: decoded.userId,
      collection: decoded.collection,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
    };
    console.log('authMiddleware: User attached to req.user:', req.user);

    next();
  } catch (error: any) {
    console.error('authMiddleware: Error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};