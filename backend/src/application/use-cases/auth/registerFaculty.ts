// src/application/use-cases/faculty/register-faculty.use-case.ts
import { FacultyRegister } from '../../../infrastructure/database/mongoose/models/facultyRegister.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface RegisterFacultyParams {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  qualification: string;
  experience: string;
  aboutMe: string;
  cvUrl?: string;
  certificatesUrl?: string[];
}

interface RegisterFacultyResponse {
  token: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
    department: string;
    id: string;
  };
  collection: 'faculty';
  generatedPassword: string; // Include the generated password in the response
}

class RegisterFaculty {
  async execute({
    fullName,
    email,
    phone,
    department,
    qualification,
    experience,
    aboutMe,
    cvUrl,
    certificatesUrl,
  }: RegisterFacultyParams): Promise<RegisterFacultyResponse> {
    console.log(`Executing registerFaculty use case with params:`, { fullName, email, phone, department });

    // Check if email already exists in faculty collection
    const existingFaculty = await FacultyRegister.findOne({ email });
    if (existingFaculty) {
      throw new Error('Email already registered in faculty collection');
    }

    // Create new faculty document with Cloudinary URLs
    // No password is set at this stage - it will be set when sending offer letter
    const faculty = new FacultyRegister({
      fullName,
      email,
      phone,
      department,
      qualification,
      experience,
      aboutMe,
      cvUrl,
      certificatesUrl,
    });

    await faculty.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: faculty._id, email: faculty.email, collection: 'faculty' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    console.log(`Faculty registered successfully: ${email} in faculty collection`);

    return {
      token,
      user: {
        fullName: faculty.fullName,
        email: faculty.email,
        phone: faculty.phone,
        department: faculty.department,
        id: faculty._id,
      },
      collection: 'faculty',
    };
  }
}

export const registerFaculty = new RegisterFaculty();