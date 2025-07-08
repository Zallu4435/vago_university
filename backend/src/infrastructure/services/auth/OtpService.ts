// infrastructure/services/auth/OtpService.ts
import { otpStorage } from "../../services/otpStorage"; // Assuming otpStorage is a simple in-memory or Redis store
import { InvalidOtpError } from "../../../domain/auth/errors/AuthErrors";

// Define a simple interface for the OTP Service for dependency injection
export interface IOtpService {
    generateOtp(): string;
    storeOtp(email: string, otp: string): void;
    verifyOtp(email: string, otp: string): boolean;
    clearOtp(email: string): void;
}

export class OtpService implements IOtpService {
    constructor(private readonly otpStore: typeof otpStorage) {} // Dependency injection for otpStorage

    /**
     * Generates a 6-digit numeric OTP.
     * @returns The generated OTP string.
     */
    generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Stores an OTP associated with an email.
     * @param email The email to associate the OTP with.
     * @param otp The OTP string to store.
     */
    storeOtp(email: string, otp: string): void {
        this.otpStore.storeOtp(email, otp);
    }

    /**
     * Verifies if the provided OTP matches the stored OTP for an email.
     * Clears the OTP on successful verification.
     * @param email The email to check.
     * @param otp The OTP provided by the user.
     * @returns True if the OTP is valid, false otherwise.
     * @throws InvalidOtpError if the OTP is invalid or not found.
     */
    verifyOtp(email: string, otp: string): boolean {
        const storedOtp = this.otpStore.getOtp(email);

        if (!storedOtp || storedOtp.otp !== otp) {
            throw new InvalidOtpError();
        }

        this.otpStore.clearOtp(email); // Clear OTP after successful verification
        return true;
    }

    /**
     * Clears the stored OTP for a given email.
     * @param email The email whose OTP should be cleared.
     */
    clearOtp(email: string): void {
        this.otpStore.clearOtp(email);
    }
}