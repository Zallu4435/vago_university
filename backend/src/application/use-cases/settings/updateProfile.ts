import { User } from '../../../infrastructure/database/mongoose/models/user.model';

interface UpdateProfileParams {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface UpdateProfileResponse {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

class UpdateProfile {
  async execute(params: UpdateProfileParams): Promise<UpdateProfileResponse> {
    console.log(`Executing updateProfile use case with params:`, { userId: params.userId });

    const user = await User.findById(params.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if email is already in use by another user
    if (params.email !== user.email) {
      const existingUser = await User.findOne({ email: params.email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    user.firstName = params.firstName;
    user.lastName = params.lastName;
    user.phone = params.phone;
    user.email = params.email;

    await user.save();

    console.log(`User profile updated successfully: ${params.userId}`);

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      email: user.email,
    };
  }
}

export const updateProfile = new UpdateProfile();