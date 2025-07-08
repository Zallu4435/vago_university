// application/auth/repositories/IAuthRepository.ts (Updated Interface)
import {
  RegisterRequestDTO, LoginRequestDTO, RefreshTokenRequestDTO, LogoutRequestDTO,
  RegisterFacultyRequestDTO, SendEmailOtpRequestDTO, ResetPasswordRequestDTO,
  // Note: VerifyEmailOtpRequestDTO is no longer processed by repo directly
} from "../../../domain/auth/dtos/AuthRequestDTOs";
import {
  RegisterResponseDTO, LoginResponseDTO, RefreshTokenResponseDTO, LogoutResponseDTO,
  RegisterFacultyResponseDTO, SendEmailOtpResponseDTO, ResetPasswordResponseDTO,
  // Note: VerifyEmailOtpResponseDTO is no longer returned by repo directly
} from "../../../domain/auth/dtos/AuthResponseDTOs";

export interface IAuthRepository {
  register(params: RegisterRequestDTO): Promise<RegisterResponseDTO>;
  login(params: LoginRequestDTO): Promise<LoginResponseDTO>;
  refreshToken(params: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO>;
  logout(params: LogoutRequestDTO): Promise<LogoutResponseDTO>;
  registerFaculty(params: RegisterFacultyRequestDTO): Promise<RegisterFacultyResponseDTO>;
  sendEmailOtp(params: SendEmailOtpRequestDTO): Promise<SendEmailOtpResponseDTO>;
  // IMPORTANT: Removed verifyEmailOtp from IAuthRepository as it's handled by OtpService/JwtService in UseCase
  // verifyEmailOtp(params: VerifyEmailOtpRequestDTO): Promise<VerifyEmailOtpResponseDTO>; // <--- REMOVE THIS LINE
  resetPassword(params: ResetPasswordRequestDTO): Promise<ResetPasswordResponseDTO>;
  // Updated signature: now takes email directly
  confirmRegistration(email: string): Promise<{ message: string }>;
}