import { Register } from '../../../infrastructure/database/mongoose/models/register.model';
import { Admin } from '../../../infrastructure/database/mongoose/models/admin.model';
import { User } from '../../../infrastructure/database/mongoose/models/user.model';
import { Faculty } from '../../../infrastructure/database/mongoose/models/faculty.model';
import { Admission } from '../../../infrastructure/database/mongoose/models/admission.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface LoginParams {
  email: string;
  password: string;
} 

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

class LoginUser {
  async execute({ email, password }: LoginParams): Promise<LoginResponse> {
    console.log(`Executing loginUser use case with params:`, { email });

    let user;
    let collection: 'register' | 'admin' | 'user' | 'faculty' = 'register';

    user = await Admin.findOne({ email });
    if (user) {
      collection = 'admin';
    }

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
      if (user) {
        const admission = await Admission.findOne({ registerId: user._id });
        if (admission) {
          throw new Error('User has already made an admission and cannot log in from register.');
        }
        collection = 'register';
      }
    }

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, collection },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    console.log(`User logged in successfully: ${email} from ${collection} collection`);

    return {
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id.toString(),
        profilePicture: user?.profilePicture
      },
      collection,
    };
  }    
}

export const loginUser = new LoginUser();
