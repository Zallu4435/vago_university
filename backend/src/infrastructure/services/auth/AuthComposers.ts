import { IAuthRepository } from '../../../application/auth/repositories/IAuthRepository';
import {
  RegisterUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  LogoutUseCase,
  RegisterFacultyUseCase,
  SendEmailOtpUseCase,
  VerifyEmailOtpUseCase,
  ResetPasswordUseCase,
} from '../../../application/auth/useCases/AuthUseCases';
import { AuthRepository } from '../../../infrastructure/repositories/auth/AuthRepository';
import { AuthController } from '../../../presentation/http/auth/AuthController';
import { IAuthController } from '../../../presentation/http/IHttp';

export function getAuthComposer(): IAuthController {
  const repository: IAuthRepository = new AuthRepository();
  const registerUseCase = new RegisterUseCase(repository);
  const loginUseCase = new LoginUseCase(repository);
  const refreshTokenUseCase = new RefreshTokenUseCase(repository);
  const logoutUseCase = new LogoutUseCase(repository);
  const registerFacultyUseCase = new RegisterFacultyUseCase(repository);
  const sendEmailOtpUseCase = new SendEmailOtpUseCase(repository);
  const verifyEmailOtpUseCase = new VerifyEmailOtpUseCase(repository);
  const resetPasswordUseCase = new ResetPasswordUseCase(repository);
  return new AuthController(
    registerUseCase,
    loginUseCase,
    refreshTokenUseCase,
    logoutUseCase,
    registerFacultyUseCase,
    sendEmailOtpUseCase,
    verifyEmailOtpUseCase,
    resetPasswordUseCase
  );
}