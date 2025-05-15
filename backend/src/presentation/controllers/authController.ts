import { Request, Response, NextFunction } from 'express';
import { registerUser } from '../../application/use-cases/auth/registerUser';
import { loginUser } from '../../application/use-cases/auth/loginUser';
import { refreshToken } from '../../application/use-cases/auth/refreshToken';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, password } = req.body;

      console.log(`Received POST /api/auth/register with body:`, { firstName, lastName, email });

      if (!firstName || !lastName || !email || !password) {
        throw new Error('All fields are required');
      }

      const result = await registerUser.execute({
        firstName,
        lastName,
        email,
        password,
      });

      res.status(201).json(result);
    } catch (err) {
      console.error(`Error in register:`, err);
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      console.log(`Received POST /api/auth/login with body:`, { email });

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const result = await loginUser.execute({
        email,
        password,
      });

      res.status(200).json(result);
    } catch (err) {
      console.error(`Error in login:`, err);
      next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      console.log(`Received POST /api/auth/refresh-token`);

      if (!token) {
        throw new Error('Token is required');
      }

      const result = await refreshToken.execute({ token });

      res.status(200).json(result);
    } catch (err) {
      console.error(`Error in refreshToken:`, err);
      next(err);
    }
  }
}

export const authController = new AuthController();