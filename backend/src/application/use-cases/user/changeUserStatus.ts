// application/use-cases/user/changeUserStatus.ts
import { User } from "../../../infrastructure/database/mongoose/models/user.model";

class ChangeUserStatus {
  async execute(userId: string, status: string) {
    console.log(`Changing status for user with ID: ${userId} to ${status}`);
    
    // Validate status value
    const validStatuses = ["Active", "Pending", "Suspended"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(", ")}`);
    }
    
    // Find user and update status
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { status } },
      { new: true }
    ).lean();
    
    if (!user) {
      console.warn(`User with ID ${userId} not found`);
      return null;
    }
    
    // Remove password from response
    const userObject = { ...user };
    delete userObject.password;
    
    console.log(`Status for user with ID ${userId} changed to ${status} successfully`);
    return userObject;
  }
}

export const changeUserStatus = new ChangeUserStatus();