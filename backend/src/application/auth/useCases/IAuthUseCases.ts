import {
  RegisterRequestDTO, LoginRequestDTO, RefreshTokenRequestDTO, LogoutRequestDTO,
  RegisterFacultyRequestDTO, SendEmailOtpRequestDTO, VerifyEmailOtpRequestDTO, ResetPasswordRequestDTO,
} from "../../../domain/auth/dtos/AuthRequestDTOs";
import {
  RegisterResponseDTO, LoginResponseDTO, RefreshTokenResponseDTO, LogoutResponseDTO,
  RegisterFacultyResponseDTO, SendEmailOtpResponseDTO, VerifyEmailOtpResponseDTO, ResetPasswordResponseDTO,
} from "../../../domain/auth/dtos/AuthResponseDTOs";

export interface IRegisterUseCase {
  execute(params: RegisterRequestDTO): Promise<RegisterResponseDTO>;
}

export interface ILoginUseCase {
  execute(params: LoginRequestDTO): Promise<LoginResponseDTO>;
}

export interface IRefreshTokenUseCase {
  execute(params: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO>;
}

export interface ILogoutUseCase {
  execute(params: LogoutRequestDTO): Promise<LogoutResponseDTO>;
}

export interface IRegisterFacultyUseCase {
  execute(params: RegisterFacultyRequestDTO): Promise<RegisterFacultyResponseDTO>;
}

export interface ISendEmailOtpUseCase {
  execute(params: SendEmailOtpRequestDTO): Promise<SendEmailOtpResponseDTO>;
}

export interface IVerifyEmailOtpUseCase {
  execute(params: VerifyEmailOtpRequestDTO): Promise<VerifyEmailOtpResponseDTO>;
}

export interface IResetPasswordUseCase {
  execute(params: ResetPasswordRequestDTO): Promise<ResetPasswordResponseDTO>;
}

export interface IConfirmRegistrationUseCase {
  execute(token: string): Promise<{ message: string }>;
}
