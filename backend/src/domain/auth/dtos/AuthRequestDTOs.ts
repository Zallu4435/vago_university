import { IUser, FacultyProps } from "../entities/AuthTypes";

export type RegisterRequestDTO = Pick<IUser, "firstName" | "lastName" | "email" | "password">;

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RefreshTokenRequestDTO {
  token: string;
  userId: string;
  email: string;
  collection: "register" | "admin" | "user" | "faculty";
}

export interface LogoutRequestDTO {
  // No params needed
}

export type RegisterFacultyRequestDTO = Pick<FacultyProps, "fullName" | "email" | "phone" | "department" | "qualification" | "experience" | "aboutMe" | "cvUrl" | "certificatesUrl">;

export interface SendEmailOtpRequestDTO {
  email: string;
}

export interface VerifyEmailOtpRequestDTO {
  email: string;
  otp: string;
}

export interface ResetPasswordRequestDTO {
  resetToken: string;
  newPassword: string;
  email: string;
}