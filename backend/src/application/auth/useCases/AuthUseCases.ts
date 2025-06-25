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
import { AuthErrorType } from "../../../domain/auth/enums/AuthErrorType";
import { IAuthRepository } from "../repositories/IAuthRepository";

interface ResponseDTO<T> {
  data: T | { error: string };
  success: boolean;
}

export interface IRegisterUseCase {
  execute(params: RegisterRequestDTO): Promise<ResponseDTO<RegisterResponseDTO>>;
}

export interface ILoginUseCase {
  execute(params: LoginRequestDTO): Promise<ResponseDTO<LoginResponseDTO>>;
}

export interface IRefreshTokenUseCase {
  execute(params: RefreshTokenRequestDTO): Promise<ResponseDTO<RefreshTokenResponseDTO>>;
}

export interface ILogoutUseCase {
  execute(params: LogoutRequestDTO): Promise<ResponseDTO<LogoutResponseDTO>>;
}

export interface IRegisterFacultyUseCase {
  execute(params: RegisterFacultyRequestDTO): Promise<ResponseDTO<RegisterFacultyResponseDTO>>;
}

export interface ISendEmailOtpUseCase {
  execute(params: SendEmailOtpRequestDTO): Promise<ResponseDTO<SendEmailOtpResponseDTO>>;
}

export interface IVerifyEmailOtpUseCase {
  execute(params: VerifyEmailOtpRequestDTO): Promise<ResponseDTO<VerifyEmailOtpResponseDTO>>;
}

export interface IResetPasswordUseCase {
  execute(params: ResetPasswordRequestDTO): Promise<ResponseDTO<ResetPasswordResponseDTO>>;
}

export interface IConfirmRegistrationUseCase {
  execute(token: string): Promise<{ message: string }>;
}

export class RegisterUseCase implements IRegisterUseCase {
  constructor(private authRepository: IAuthRepository) { }

  async execute(params: RegisterRequestDTO): Promise<ResponseDTO<RegisterResponseDTO>> {
    try {
      const result = await this.authRepository.register(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("RegisterUseCase: Error:", error);
      return { data: { error: error.message || AuthErrorType.UserAlreadyExists }, success: false };
    }
  }
}

export class LoginUseCase implements ILoginUseCase {
  constructor(private authRepository: IAuthRepository) { }

  async execute(params: LoginRequestDTO): Promise<ResponseDTO<LoginResponseDTO>> {
    try {
      const result = await this.authRepository.login(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("LoginUseCase: Error:", error);
      return { data: { error: error.message || AuthErrorType.InvalidCredentials }, success: false };
    }
  }
}

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(private authRepository: IAuthRepository) { }

  async execute(params: RefreshTokenRequestDTO): Promise<ResponseDTO<RefreshTokenResponseDTO>> {
    try {
      const result = await this.authRepository.refreshToken(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("RefreshTokenUseCase: Error:", error);
      return { data: { error: error.message || AuthErrorType.InvalidToken }, success: false };
    }
  }
}

export class LogoutUseCase implements ILogoutUseCase {
  constructor(private authRepository: IAuthRepository) { }

  async execute(params: LogoutRequestDTO): Promise<ResponseDTO<LogoutResponseDTO>> {
    try {
      const result = await this.authRepository.logout(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("LogoutUseCase: Error:", error);
      return { data: { error: error.message || "Failed to logout" }, success: false };
    }
  }
}

export class RegisterFacultyUseCase implements IRegisterFacultyUseCase {
  constructor(private authRepository: IAuthRepository) { }

  async execute(params: RegisterFacultyRequestDTO): Promise<ResponseDTO<RegisterFacultyResponseDTO>> {
    try {
      const result = await this.authRepository.registerFaculty(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("RegisterFacultyUseCase: Error:", error);
      return { data: { error: error.message || AuthErrorType.FacultyAlreadyExists }, success: false };
    }
  }
}

export class SendEmailOtpUseCase implements ISendEmailOtpUseCase {
  constructor(private authRepository: IAuthRepository) { }

  async execute(params: SendEmailOtpRequestDTO): Promise<ResponseDTO<SendEmailOtpResponseDTO>> {
    try {
      const result = await this.authRepository.sendEmailOtp(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("SendEmailOtpUseCase: Error:", error);
      return { data: { error: error.message || AuthErrorType.EmailNotFound }, success: false };
    }
  }
}

export class VerifyEmailOtpUseCase implements IVerifyEmailOtpUseCase {
  constructor(private authRepository: IAuthRepository) { }

  async execute(params: VerifyEmailOtpRequestDTO): Promise<ResponseDTO<VerifyEmailOtpResponseDTO>> {
    try {
      const result = await this.authRepository.verifyEmailOtp(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("VerifyEmailOtpUseCase: Error:", error);
      return { data: { error: error.message || AuthErrorType.InvalidOtp }, success: false };
    }
  }
}

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(private authRepository: IAuthRepository) { }

  async execute(params: ResetPasswordRequestDTO): Promise<ResponseDTO<ResetPasswordResponseDTO>> {
    try {
      const result = await this.authRepository.resetPassword(params);
      return { data: result, success: true };
    } catch (error: any) {
      console.error("ResetPasswordUseCase: Error:", error);
      return { data: { error: error.message || AuthErrorType.InvalidToken }, success: false };
    }
  }
}

export class ConfirmRegistrationUseCase implements IConfirmRegistrationUseCase {
  constructor(private authRepository: IAuthRepository) { }
  async execute(token: string): Promise<{ message: string }> {
    return this.authRepository.confirmRegistration(token);
  }
}