import { User } from "../../../infrastructure/database/mongoose/models/user.model";

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  profilePicture?: string;
}

interface GetProfileParams {
  userId: string;
}

class GetProfile {
  async execute(params: GetProfileParams): Promise<ProfileData> {
    console.log(`Executing getProfile use case with params:`, {
      userId: params.userId,
    });

    const user = await User.findById(params.userId);
    if (!user) {
      throw new Error("User not found");
    }

    console.log(`Profile fetched successfully for user: ${params.userId}`);

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || "",
      email: user.email,
      profilePicture: user.profilePicture || "",
    };
  }
}

export const getProfile = new GetProfile();
