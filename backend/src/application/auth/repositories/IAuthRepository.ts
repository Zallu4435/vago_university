import {
  RegisterRequestDTO, LoginRequestDTO, RefreshTokenRequestDTO, LogoutRequestDTO,
  RegisterFacultyRequestDTO, SendEmailOtpRequestDTO, ResetPasswordRequestDTO,
} from "../../../domain/auth/dtos/AuthRequestDTOs";
import {
  RegisterResponseDTO, LoginResponseDTO, RefreshTokenResponseDTO, LogoutResponseDTO,
  RegisterFacultyResponseDTO, SendEmailOtpResponseDTO, ResetPasswordResponseDTO,
} from "../../../domain/auth/dtos/AuthResponseDTOs";

export interface IAuthRepository {
  register(params: RegisterRequestDTO): Promise<RegisterResponseDTO>;
  login(params: LoginRequestDTO): Promise<LoginResponseDTO>;
  refreshToken(params: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO>;
  registerFaculty(params: RegisterFacultyRequestDTO): Promise<RegisterFacultyResponseDTO>;
  sendEmailOtp(params: SendEmailOtpRequestDTO): Promise<SendEmailOtpResponseDTO>;
  resetPassword(params: ResetPasswordRequestDTO): Promise<ResetPasswordResponseDTO>;
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
  findSessionBySessionIdAndUserId(sessionId: string, userId: string): Promise<any>;
  updateSessionRefreshToken(sessionId: string, newRefreshToken: string, newExpiresAt: Date, newLastUsedAt: Date): Promise<void>;
  deleteSessionBySessionId(sessionId: string): Promise<void>;
  deleteAllSessionsByUserId(userId: string): Promise<void>;
}