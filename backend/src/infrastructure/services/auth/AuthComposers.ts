import { IEmailService } from '../../../application/auth/service/IEmailService';
import {
    IRegisterUseCase,
    ILoginUseCase,
    IRefreshTokenUseCase,
    ILogoutUseCase,
    IRegisterFacultyUseCase,
    ISendEmailOtpUseCase,
    IVerifyEmailOtpUseCase,
    IResetPasswordUseCase,
    IConfirmRegistrationUseCase
} from '../../../application/auth/useCases/IAuthUseCases';
import {
    LogoutAllUseCase,
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    RegisterFacultyUseCase,
    SendEmailOtpUseCase,
    VerifyEmailOtpUseCase,
    ResetPasswordUseCase,
    ConfirmRegistrationUseCase
} from '../../../application/auth/useCases/AuthUseCases';
import { AuthRepository } from '../../../infrastructure/repositories/auth/AuthRepository';
import { AuthController } from '../../../presentation/http/auth/AuthController';
import { IAuthController } from '../../../presentation/http/IHttp';

import { IJwtService, JwtService } from '../../services/auth/JwtService';
import { IOtpService, OtpService } from '../../services/auth/OtpService';
import { emailService } from '../../services/email.service';
import { otpStorage } from "../../services/otpStorage";

export function getAuthComposer(): IAuthController {
    const repository: AuthRepository = new AuthRepository();

    const jwtService: IJwtService = new JwtService();
    const otpService: IOtpService = new OtpService(otpStorage);
    const emailsvc: IEmailService = emailService;

    const registerUseCase: IRegisterUseCase = new RegisterUseCase(repository, jwtService, emailsvc);
    const loginUseCase: ILoginUseCase = new LoginUseCase(repository, jwtService);
    const refreshTokenUseCase: IRefreshTokenUseCase = new RefreshTokenUseCase(repository, jwtService);
    const logoutUseCase: ILogoutUseCase = new LogoutUseCase(repository);
    const registerFacultyUseCase: IRegisterFacultyUseCase = new RegisterFacultyUseCase(repository, jwtService);
    const sendEmailOtpUseCase: ISendEmailOtpUseCase = new SendEmailOtpUseCase(repository, otpService, emailsvc);
    const verifyEmailOtpUseCase: IVerifyEmailOtpUseCase = new VerifyEmailOtpUseCase(otpService, jwtService);
    const resetPasswordUseCase: IResetPasswordUseCase = new ResetPasswordUseCase(repository, jwtService);
    const confirmRegistrationUseCase: IConfirmRegistrationUseCase = new ConfirmRegistrationUseCase(repository, jwtService);
    const logoutAllUseCase: LogoutAllUseCase = new LogoutAllUseCase(repository);

    return new AuthController(
        registerUseCase,
        loginUseCase,
        refreshTokenUseCase,
        logoutUseCase,
        registerFacultyUseCase,
        sendEmailOtpUseCase,
        verifyEmailOtpUseCase,
        resetPasswordUseCase,
        confirmRegistrationUseCase,
        logoutAllUseCase,
        repository
    );
}