import { User } from '../../../infrastructure/database/mongoose/models/user.model';

interface UpdateProfilePictureParams {
  userId: string;
  filePath: string; // Cloudinary URL
}

interface UpdateProfilePictureResponse {
  profilePicture: string;
}

class UpdateProfilePicture {
  async execute(params: UpdateProfilePictureParams): Promise<UpdateProfilePictureResponse> {
    console.log(`Executing updateProfilePicture use case with params:`, { userId: params.userId });

    const user = await User.findById(params.userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.profilePicture = params.filePath;
    await user.save();

    console.log(`Profile picture updated successfully for user: ${params.userId}`);

    return {
      profilePicture: user.profilePicture || '',
    };
  }
}

export const updateProfilePicture = new UpdateProfilePicture();