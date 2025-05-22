import { Register } from '../../../infrastructure/database/mongoose/models/register.model';
import { Admin } from '../../../infrastructure/database/mongoose/models/admin.model';
import { User } from '../../../infrastructure/database/mongoose/models/user.model';
import { Faculty } from '../../../infrastructure/database/mongoose/models/faculty.model';
import { emailService } from '../../../infrastructure/services/email.service';
import { otpStorage } from '../../../infrastructure/services/otpStorage';

interface SendEmailOtpParams {
  email: string;
}

class SendEmailOtp {
  async execute({ email }: SendEmailOtpParams): Promise<void> {
    // Find user across collections
    let user = await Admin.findOne({ email });
    let collection: 'register' | 'admin' | 'user' | 'faculty' = 'admin';

    if (!user) {
      user = await User.findOne({ email });
      if (user) collection = 'user';
    }

    if (!user) {
      user = await Faculty.findOne({ email });
      if (user) collection = 'faculty';
    }

    if (!user) {
      user = await Register.findOne({ email });
      if (user) collection = 'register';
    }

    if (!user) {
      throw new Error('Email not found');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP
    otpStorage.storeOtp(email, otp);

    // Send OTP email
    await emailService.sendPasswordResetOtpEmail({
      to: email,
      name: user.firstName || 'User',
      otp,
    });

    console.log(`OTP sent to ${email}`);
  }
}

export const sendEmailOtp = new SendEmailOtp();