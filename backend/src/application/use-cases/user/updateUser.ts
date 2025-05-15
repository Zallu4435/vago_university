// application/use-cases/user/updateUser.ts
import { User } from "../../../infrastructure/database/mongoose/models/user.model";
import { hashPassword } from "../../../infrastructure/services/passwordService";

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
}

class UpdateUser {
  async execute(userId: string, userData: UpdateUserData) {
    console.log(`Updating user with ID: ${userId}`);
    
    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      console.warn(`User with ID ${userId} not found`);
      return null;
    }
    
    // Check if email is being updated and if it's already in use
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await User.findOne({ email: userData.email, _id: { $ne: userId } });
      if (emailExists) {
        console.warn(`Email ${userData.email} is already in use`);
        throw new Error("Email already in use by another user");
      }
    }
    
    // Prepare update data
    const updateData: UpdateUserData = {};
    
    if (userData.name) updateData.name = userData.name;
    if (userData.email) updateData.email = userData.email;
    if (userData.role) updateData.role = userData.role;
    if (userData.status) updateData.status = userData.status;
    
    // Hash password if provided
    if (userData.password) {
      updateData.password = await hashPassword(userData.password);
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).lean();
    
    // Remove password from response
    if (updatedUser) {
      const userObject = { ...updatedUser };
      delete userObject.password;
      return userObject;
    }
    
    return null;
  }
}

export const updateUser = new UpdateUser();