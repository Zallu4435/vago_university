import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  Logger.http(`${req.method} ${req.url} - IP: ${req.ip}`);
  
  if (req.body && Object.keys(req.body).length > 0 && !req.is('multipart/form-data')) {
    Logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
  }
  
  if (req.query && Object.keys(req.query).length > 0) {
    Logger.debug(`Query Params: ${JSON.stringify(req.query)}`);
  }

  const originalSend = res.send;
  res.send = function (body) {
    Logger.http(`Response: ${res.statusCode}`);
    return originalSend.call(this, body);
  };

  next();
}; 