// import dotenv from 'dotenv';
// dotenv.config();

// export const config = {
//   port: process.env.PORT || 5000,
//   jwtSecret: process.env.JWT_SECRET!,
//   mongoUri: process.env.MONGODB_URI!,
//   postgresUrl: process.env.DATABASE_URL!
// };



// backend/src/config.ts
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  app: {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development',
  },
  database: {
    mongoUri: process.env.MONGODB_URI!,
    postgresUrl: process.env.DATABASE_URL!,
  },
  email: {
    host: process.env.EMAIL_HOST!,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER!,
    password: process.env.EMAIL_PASSWORD!,
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  }
};