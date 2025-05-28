// import { Request, Response, NextFunction } from 'express';
// import Redis from 'ioredis';
// import { AuthenticatedUser } from './authMiddleware';

// // Initialize Redis client (configure with your Redis server details)
// const redis = new Redis({
//   host: process.env.REDIS_HOST || 'localhost',
//   port: parseInt(process.env.REDIS_PORT || '6379'),
//   password: process.env.REDIS_PASSWORD,
//   retryStrategy: (times) => Math.min(times * 50, 2000),
// });

// // Handle Redis connection errors
// redis.on('error', (err) => {
//   console.error('Redis connection error:', err);
// });

// export function rateLimiter(limit: number, windowSeconds: number) {
//   return async (req: Request & { user?: AuthenticatedUser }, res: Response, next: NextFunction) => {
//     try {
//       const userId = req.user?._id;
//       if (!userId) {
//         return res.status(401).json({
//           error: { code: 'UNAUTHORIZED', message: 'Authentication required', status: 401 },
//         });
//       }

//       // Unique key per user and endpoint
//       const key = `rate-limit:${userId}:${req.path}`;
      
//       // Use Redis pipeline for atomic operations
//       const pipeline = redis.pipeline();
//       pipeline.incr(key);
//       pipeline.ttl(key);
      
//       const [incrementResult, ttlResult] = await pipeline.exec();
      
//       const currentCount = incrementResult[1] as number;
//       let ttl = ttlResult[1] as number;

//       // Set expiration only on first request
//       if (currentCount === 1) {
//         await redis.expire(key, windowSeconds);
//         ttl = windowSeconds;
//       }

//       // Check if limit exceeded
//       if (currentCount > limit) {
//         return res.status(429).json({
//           error: {
//             code: 'RATE_LIMIT_EXCEEDED',
//             message: `Too many requests. Limit: ${limit} per ${windowSeconds} seconds.`,
//             status: 429,
//           },
//         });
//       }

//       // Optionally add rate limit headers
//       res.set('X-RateLimit-Limit', limit.toString());
//       res.set('X-RateLimit-Remaining', (limit - currentCount).toString());
//       res.set('X-RateLimit-Reset', ttl.toString());

//       next();
//     } catch (err) {
//       console.error('Rate limiter error:', err);
//       // Proceed without rate limiting if Redis fails (fail-open)
//       next();
//     }
//   };
// }