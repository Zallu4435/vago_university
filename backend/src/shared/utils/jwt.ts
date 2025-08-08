import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  email: string;
  collection: 'register' | 'admin' | 'user' | 'faculty';
}

export function verifyToken(token: string): DecodedToken {
  if (!token) {
    throw new Error('Token not provided');
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}
