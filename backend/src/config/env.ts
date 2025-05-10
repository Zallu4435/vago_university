import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET!,
  mongoUri: process.env.MONGODB_URI!,
  postgresUrl: process.env.DATABASE_URL!
};
