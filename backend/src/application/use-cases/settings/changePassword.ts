import { User } from '../../../infrastructure/database/mongoose/models/user.model';
import bcrypt from 'bcryptjs';

interface ChangePasswordParams {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

class ChangePassword {
  async execute(params: ChangePasswordParams): Promise<void> {
    console.log(`Executing changePassword use case with params:`, { userId: params.userId });

    const user = await User.findById(params.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(params.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(params.newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    console.log(`Password updated successfully for user: ${params.userId}`);
  }
}

export const changePassword = new ChangePassword();