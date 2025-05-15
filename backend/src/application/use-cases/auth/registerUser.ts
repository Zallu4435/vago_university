import { Register, IRegister } from '../../../infrastructure/database/mongoose/models/register.model';
import bcrypt from 'bcryptjs';

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

class RegisterUser {
  async execute({ firstName, lastName, email, password }: RegisterParams): Promise<RegisterResponse> {
    console.log(`Executing registerUser use case with params:`, { firstName, lastName, email });

    // Check if user already exists
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new Register({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await user.save();

    console.log(`User registered successfully: ${email}`);

    return {
      message: 'User registered successfully',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }
}

export const registerUser = new RegisterUser();