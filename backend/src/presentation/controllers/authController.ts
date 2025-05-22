import { Request, Response, NextFunction } from "express";
import { registerUser } from "../../application/use-cases/auth/registerUser";
import { loginUser } from "../../application/use-cases/auth/loginUser";
import { refreshToken } from "../../application/use-cases/auth/refreshToken";
import { registerFaculty } from "../../application/use-cases/auth/registerFaculty";
import { facultyUpload } from '../../config/cloudinary.config';
import { sendEmailOtp } from "../../application/use-cases/auth/sendEmailOtp";
import { verifyEmailOtp } from "../../application/use-cases/auth/verifyEmailOtp";
import { resetPassword } from "../../application/use-cases/auth/resetPassword";

class AuthController {

  uploadDocuments = facultyUpload.fields([
    { name: "cv", maxCount: 1 },
    { name: "certificates", maxCount: 5 },
  ]);

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, password } = req.body;

      console.log(`Received POST /api/auth/register with body:`, {
        firstName,
        lastName,
        email,
      });

      if (!firstName || !lastName || !email || !password) {
        throw new Error("All fields are required");
      }

      const result = await registerUser.execute({
        firstName,
        lastName,
        email,
        password,
      });

      res.status(201).json(result);
    } catch (err) {
      console.error(`Error in register:`, err);
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      console.log(`Received POST /api/auth/login with body:`, { email });

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const result = await loginUser.execute({
        email,
        password,
      });

      res.status(200).json(result);
    } catch (err) {
      console.error(`Error in login:`, err);
      next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      console.log(`Received POST /api/auth/refresh-token`);

      if (!token) {
        throw new Error("Token is required");
      }

      const result = await refreshToken.execute({ token });

      res.status(200).json(result);
    } catch (err) {
      console.error(`Error in refreshToken:`, err);
      next(err);
    }
  }

 async registerFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req, "body");
      console.log(req.files, "files");
      
      const { fullName, email, phone, department, qualification, experience, aboutMe } = req.body;

      console.log(`Received POST /api/auth/register-faculty with body:`, { fullName, email, phone, department });

      if (!fullName || !email || !phone || !department || !qualification || !experience || !aboutMe) {
        throw new Error('All required fields must be provided');
      }

      // Get file info from multer
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Extract CV URL if available
      let cvUrl: string | undefined;
      if (files && files.cv && files.cv.length > 0) {
        cvUrl = files.cv[0].path; // Cloudinary URL is stored in the path property
      }

      // Extract certificate URLs if available
      let certificatesUrl: string[] | undefined;
      if (files && files.certificates && files.certificates.length > 0) {
        certificatesUrl = files.certificates.map(file => file.path);
      }

      const result = await registerFaculty.execute({
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

      res.status(201).json(result);
    } catch (err) {
      console.error(`Error in registerFaculty:`, err);
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(`Received POST /api/auth/logout`);

      // Clear the auth_token cookie
      res.clearCookie('auth_token', {
        httpOnly: false, // Must be false since frontend sets the cookie
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      console.error(`Error in logout:`, err);
      next(err);
    }
  }

   async sendEmailOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      console.log(`Received POST /api/auth/send-email-otp with body:`, { email });

      if (!email) {
        throw new Error('Email is required');
      }

      await sendEmailOtp.execute({ email });

      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
      console.error(`Error in sendEmailOtp:`, err);
      next(err);
    }
  }

  async verifyEmailOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;

      console.log(`Received POST /api/auth/verify-email-otp with body:`, { email });

      if (!email || !otp) {
        throw new Error('Email and OTP are required');
      }

      const resetToken = await verifyEmailOtp.execute({ email, otp });

      res.status(200).json({ resetToken });
    } catch (err) {
      console.error(`Error in verifyEmailOtp:`, err);
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { resetToken, newPassword } = req.body;

      console.log(`Received POST /api/auth/reset-password`);

      if (!resetToken || !newPassword) {
        throw new Error('Reset token and new password are required');
      }

      const loginResponse = await resetPassword.execute({ resetToken, newPassword });

      res.status(200).json(loginResponse);
    } catch (err) {
      console.error(`Error in resetPassword:`, err);
      next(err);
    }
  }
}

export const authController = new AuthController();
