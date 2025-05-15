// application/use-cases/user/createUser.ts
import { User } from "../../../infrastructure/database/mongoose/models/user.model";
import { hashPassword } from "../../../infrastructure/services/passwordService";

interface UserData {
  name: string;
  email: string;
  password?: string;
  role: string;
  status?: string;
}

class CreateUser {
  async execute(userData: UserData) {
    console.log(`Creating new user with email: ${userData.email}`);
    
    // Check if user already exists with this email
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.warn(`User with email ${userData.email} already exists`);
      throw new Error("Email already in use");
    }
    
    // Hash password if provided
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }
    
    // Set default status if not provided
    if (!userData.status) {
      userData.status = "Pending";
    }
    
    // Create new user
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      status: userData.status,
      createdAt: new Date()
    });
    
    await user.save();
    
    // Return user object (without password)
    const userObject = user.toObject();
    delete userObject.password;
    
    console.log(`Created user:`, { id: userObject._id, email: userObject.email });
    
    return userObject;
  }
}

export const createUser = new CreateUser();