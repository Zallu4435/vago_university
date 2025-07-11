// infrastructure/services/auth/JwtService.ts
import jwt from "jsonwebtoken";
import { config } from "../../../config/config";
import { InvalidTokenError } from "../../../domain/auth/errors/AuthErrors";

// Define a simple interface for the JWT Service for dependency injection
export interface IJwtService {
    generateToken(payload: object, expiresIn: string): string;
    generateAccessToken(payload: object): string;
    generateRefreshToken(payload: object): string;
    verifyToken<T>(token: string): T; // T will be the decoded payload type
}

export class JwtService implements IJwtService {
    private readonly secret: jwt.Secret;
    private readonly refreshSecret: jwt.Secret;

    constructor() {
        // Use a more robust way to handle secret, like environment variables
        if (!config.jwt.secret || !config.jwt.refreshSecret) {
            throw new Error("JWT secrets are not defined in config.");
        }
        this.secret = config.jwt.secret as jwt.Secret;
        this.refreshSecret = config.jwt.refreshSecret as jwt.Secret;
    }

    /**
     * Generates a new JWT token.
     * @param payload The data to encode in the token.
     * @param expiresIn The duration until the token expires (e.g., '1h', '7d').
     * @returns The signed JWT string.
     * @deprecated Use generateAccessToken or generateRefreshToken instead
     */
    generateToken(payload: object, expiresIn: string): string {
        return jwt.sign(payload, this.secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
    }

    /**
     * Generates a new access token with 3 hours expiry.
     * @param payload The data to encode in the token.
     * @returns The signed JWT string.
     */
    generateAccessToken(payload: object): string {
        return jwt.sign(payload, this.secret, { expiresIn: '3h' });
    }

    /**
     * Generates a new refresh token with 7 days expiry.
     * @param payload The data to encode in the token.
     * @returns The signed JWT string.
     */
    generateRefreshToken(payload: object): string {
        return jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });
    }

    /**
     * Verifies a JWT token and returns its decoded payload.
     * @param token The JWT string to verify.
     * @param isRefreshToken Whether this is a refresh token verification
     * @returns The decoded payload.
     * @throws InvalidTokenError if the token is invalid or expired.
     */
    verifyToken<T>(token: string, isRefreshToken: boolean = false): T {
        try {
            const secret = isRefreshToken ? this.refreshSecret : this.secret;
            return jwt.verify(token, secret) as T;
        } catch (error) {
            // Re-throw as a domain-specific error
            throw new InvalidTokenError("Invalid or expired token.");
        }
    }
}