// infrastructure/services/auth/JwtService.ts
import jwt from "jsonwebtoken";
import { config } from "../../../config/config";
import { InvalidTokenError } from "../../../domain/auth/errors/AuthErrors";

// Define a simple interface for the JWT Service for dependency injection
export interface IJwtService {
    generateToken(payload: object, expiresIn: string): string;
    verifyToken<T>(token: string): T; // T will be the decoded payload type
}

export class JwtService implements IJwtService {
    private readonly secret: jwt.Secret;

    constructor() {
        // Use a more robust way to handle secret, like environment variables
        if (!config.jwt.secret) {
            throw new Error("JWT_SECRET is not defined in config.");
        }
        this.secret = config.jwt.secret as jwt.Secret;
    }

    /**
     * Generates a new JWT token.
     * @param payload The data to encode in the token.
     * @param expiresIn The duration until the token expires (e.g., '1h', '7d').
     * @returns The signed JWT string.
     */
    generateToken(payload: object, expiresIn: string): string {
        return jwt.sign(payload, this.secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
    }

    /**
     * Verifies a JWT token and returns its decoded payload.
     * @param token The JWT string to verify.
     * @returns The decoded payload.
     * @throws InvalidTokenError if the token is invalid or expired.
     */
    verifyToken<T>(token: string): T {
        try {
            return jwt.verify(token, this.secret) as T;
        } catch (error) {
            // Re-throw as a domain-specific error
            throw new InvalidTokenError("Invalid or expired token.");
        }
    }
}