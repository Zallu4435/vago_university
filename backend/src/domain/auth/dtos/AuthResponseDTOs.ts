import { IUser, FacultyProps } from "../entities/AuthTypes";

export interface RegisterResponseDTO {
  message: string;
  user: Pick<IUser, "firstName" | "lastName" | "email"> & { id: string };
}

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: Pick<IUser, "firstName" | "lastName" | "email" | "id" | "profilePicture"> & { password: string; blocked?: boolean };
  collection: "register" | "admin" | "user" | "faculty";
}

export interface RefreshTokenResponseDTO {
  accessToken: string;
  user: Pick<IUser, "firstName" | "lastName" | "email" | "id" | "profilePicture">;
  collection: "register" | "admin" | "user" | "faculty";
}

export interface LogoutResponseDTO {
  message: string;
}

export interface RegisterFacultyResponseDTO {
  token: string;
  user: Pick<FacultyProps, "fullName" | "email" | "phone" | "department" | "id">;
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
  user: Pick<IUser, "firstName" | "lastName" | "email" | "id" | "profilePicture">;
  collection: "register" | "admin" | "user" | "faculty";
}