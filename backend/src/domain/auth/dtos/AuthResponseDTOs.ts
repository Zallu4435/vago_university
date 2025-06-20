import { User, Faculty } from "../entities/Auth";

export interface RegisterResponseDTO {
  message: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface LoginResponseDTO {
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    profilePicture?: string;
  };
  collection: "register" | "admin" | "user" | "faculty";
}

export interface RefreshTokenResponseDTO {
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    profilePicture?: string;
  };
  collection: "register" | "admin" | "user" | "faculty";
}

export interface LogoutResponseDTO {
  message: string;
}

export interface RegisterFacultyResponseDTO {
  token: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
    department: string;
    id: string;
  };
  collection: "faculty";
}

export interface SendEmailOtpResponseDTO {
  message: string;
}

export interface VerifyEmailOtpResponseDTO {
  resetToken: string;
}

export interface ResetPasswordResponseDTO {
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    profilePicture?: string;
  };
  collection: "register" | "admin" | "user" | "faculty";
}