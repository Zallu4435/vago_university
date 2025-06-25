import {
    RegisterRequestDTO,
    LoginRequestDTO,
    RefreshTokenRequestDTO,
    LogoutRequestDTO,
    RegisterFacultyRequestDTO,
    SendEmailOtpRequestDTO,
    VerifyEmailOtpRequestDTO,
    ResetPasswordRequestDTO,
  } from "../../../domain/auth/dtos/AuthRequestDTOs";
  import {
    RegisterResponseDTO,
    LoginResponseDTO,
    RefreshTokenResponseDTO,
    LogoutResponseDTO,
    RegisterFacultyResponseDTO,
    SendEmailOtpResponseDTO,
    VerifyEmailOtpResponseDTO,
    ResetPasswordResponseDTO,
  } from "../../../domain/auth/dtos/AuthResponseDTOs";
  
  export interface IAuthRepository {
    register(params: RegisterRequestDTO): Promise<RegisterResponseDTO>;
    login(params: LoginRequestDTO): Promise<LoginResponseDTO>;
    refreshToken(params: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO>;
    logout(params: LogoutRequestDTO): Promise<LogoutResponseDTO>;
    registerFaculty(params: RegisterFacultyRequestDTO): Promise<RegisterFacultyResponseDTO>;
    sendEmailOtp(params: SendEmailOtpRequestDTO): Promise<SendEmailOtpResponseDTO>;
    verifyEmailOtp(params: VerifyEmailOtpRequestDTO): Promise<VerifyEmailOtpResponseDTO>;
    resetPassword(params: ResetPasswordRequestDTO): Promise<ResetPasswordResponseDTO>;
    confirmRegistration(token: string): Promise<{ message: string }>;
  }