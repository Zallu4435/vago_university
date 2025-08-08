import { RegisterRequest, RegisterFacultyRequest } from "../../../domain/auth/entities/Auth";

export interface IAuthRepository {
  register(params: RegisterRequest): Promise<{
    message: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  login(email: string): Promise<{
    user: {
      firstName: string;
      lastName: string;
      email: string;
      id: string;
      profilePicture: string;
      password: string;
      blocked?: boolean;
    };
    collection: "register" | "admin" | "user" | "faculty";
  }>;
  refreshToken(userId: string, collection: "register" | "admin" | "user" | "faculty"): Promise<{
    user: {
      firstName: string;
      lastName: string;
      email: string;
      id: string;
      profilePicture: string;
    };
    collection: "register" | "admin" | "user" | "faculty";
  }>;
  registerFaculty(params: RegisterFacultyRequest): Promise<{
    user: {
      fullName: string;
      email: string;
      phone: string;
      department: string;
      id: string;
    };
    collection: "faculty";
  }>;
  sendEmailOtp(email: string): Promise<{ message: string }>;
  resetPassword(email: string, newPassword: string): Promise<{
    user: {
      firstName: string;
      lastName: string;
      email: string;
      id: string;
      profilePicture: string;
    };
    collection: "register" | "admin" | "user" | "faculty";
  }>;
  confirmRegistration(email: string): Promise<{ message: string }>;
  createRefreshSession(params: {
    userId: string;
    sessionId: string;
    refreshToken: string;
    userAgent: string;
    ipAddress: string;
    createdAt: Date;
    lastUsedAt: Date;
    expiresAt: Date;
  }): Promise<void>;
  findSessionBySessionIdAndUserId(sessionId: string, userId: string);
  findSessionByUserIdAndDevice(userId: string, userAgent: string, ipAddress: string);
  updateSessionRefreshToken(sessionId: string, newRefreshToken: string, newExpiresAt: Date, newLastUsedAt: Date): Promise<void>;
  deleteSessionBySessionId(sessionId: string): Promise<void>;
  deleteAllSessionsByUserId(userId: string): Promise<void>;
}