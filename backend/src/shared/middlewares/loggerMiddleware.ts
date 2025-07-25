import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  req.headers['x-request-id'] = requestId;

  const startTime = Date.now();

  Logger.http(`${req.method} ${req.url} - IP: ${req.ip} - RequestID: ${requestId}`);

  if (req.body && Object.keys(req.body).length > 0 && !req.is('multipart/form-data')) {
    Logger.debug(`Request Body [${requestId}]: ${JSON.stringify(req.body)}`);
  }

  if (req.query && Object.keys(req.query).length > 0) {
    Logger.debug(`Query Params [${requestId}]: ${JSON.stringify(req.query)}`);
  }

  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - startTime;

    res.setHeader('X-Request-ID', requestId);

    Logger.http(`Response [${requestId}]: ${res.statusCode} - Duration: ${duration}ms`);

    if (res.statusCode >= 400) {
      Logger.warn(`Error Response [${requestId}]: Status ${res.statusCode} - ${body}`);
    }

    return originalSend.call(this, body);
  };

  next();
}; 