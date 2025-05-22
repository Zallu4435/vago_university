import jwt from 'jsonwebtoken';
import { otpStorage } from '../../../infrastructure/services/otpStorage';

interface VerifyEmailOtpParams {
  email: string;
  otp: string;
}

class VerifyEmailOtp {
  async execute({ email, otp }: VerifyEmailOtpParams): Promise<string> {
    const storedOtp = otpStorage.getOtp(email);

    if (!storedOtp || storedOtp.otp !== otp) {
      throw new Error('Invalid or expired OTP');
    }

    // Clear OTP after verification
    otpStorage.clearOtp(email);

    // Generate temporary reset token (valid for 15 minutes)
    const resetToken = jwt.sign(
      { email, type: 'password-reset' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '15m' }
    );

    console.log(`OTP verified for ${email}`);

    return resetToken;
  }
}

export const verifyEmailOtp = new VerifyEmailOtp();