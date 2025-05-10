import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../../config/env";

export class AuthMiddleware {
    static authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.header('Authorization')?.replace('Bearer', '');
            if (!token) throw new Error('Authentication required');

            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({ error: 'Not authorized' });
        }
    }
}

export const authenticate = AuthMiddleware.authenticate;
