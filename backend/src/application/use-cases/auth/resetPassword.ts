import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Register } from '../../../infrastructure/database/mongoose/models/register.model';
import { Admin } from '../../../infrastructure/database/mongoose/models/admin.model';
import { User } from '../../../infrastructure/database/mongoose/models/user.model';
import { Faculty } from '../../../infrastructure/database/mongoose/models/faculty.model';

interface LoginResponse {
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
  };
  collection: 'register' | 'admin' | 'user' | 'faculty';
  profilePicture: string;
}

interface ResetPasswordParams {
  resetToken: string;
  newPassword: string;
}

class ResetPassword {
  async execute({ resetToken, newPassword }: ResetPasswordParams): Promise<LoginResponse> {
    // Verify reset token
    let payload: { email: string; type: string };
    try {
      payload = jwt.verify(resetToken, process.env.JWT_SECRET || 'your-secret-key') as {
        email: string;
        type: string;
      };
      if (payload.type !== 'password-reset') {
        throw new Error('Invalid token');
      }
    } catch (err) {
      throw new Error('Invalid or expired reset token');
    }

    const { email } = payload;

    // Find user
    let user = await Admin.findOne({ email });
    let collection: 'register' | 'admin' | 'user' | 'faculty' = 'admin';
    let Model: any = Admin;

    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        collection = 'user';
        Model = User;
      }
    }

    if (!user) {
      user = await Faculty.findOne({ email });
      if (user) {
        collection = 'faculty';
        Model = Faculty;
      }
    }

    if (!user) {
      user = await Register.findOne({ email });
      if (user) {
        collection = 'register';
        Model = Register;
      }
    }

    if (!user) {
      throw new Error('Email not found');
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Model.updateOne({ email }, { password: hashedPassword });

    // Generate new login token
    const token = jwt.sign(
      { userId: user._id, email: user.email, collection },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    console.log(`Password reset and user logged in: ${email}`);

    return {
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id.toString(),
        profilePicture: user.profilePicture || '',
      },
      collection,
    };
  }
}

export const resetPassword = new ResetPassword();