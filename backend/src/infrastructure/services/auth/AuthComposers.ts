import { IAuthRepository } from '../../../application/auth/repositories/IAuthRepository';
import {
    IRegisterUseCase, // Using interfaces for clarity and consistency
    ILoginUseCase,
    IRefreshTokenUseCase,
    ILogoutUseCase,
    IRegisterFacultyUseCase,
    ISendEmailOtpUseCase,
    IVerifyEmailOtpUseCase,
    IResetPasswordUseCase,
    IConfirmRegistrationUseCase,
    // Import concrete Use Case classes to instantiate them
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    RegisterFacultyUseCase,
    SendEmailOtpUseCase,
    VerifyEmailOtpUseCase,
    ResetPasswordUseCase,
    ConfirmRegistrationUseCase,
} from '../../../application/auth/useCases/AuthUseCases'; // Make sure this path is correct
import { AuthRepository } from '../../../infrastructure/repositories/auth/AuthRepository'; // Make sure this path is correct
import { AuthController } from '../../../presentation/http/auth/AuthController'; // Make sure this path is correct
import { IAuthController } from '../../../presentation/http/IHttp'; // Make sure this path is correct

// Import new services and their interfaces
import { IJwtService, JwtService } from '../../services/auth/JwtService';
import { IOtpService, OtpService } from '../../services/auth/OtpService';
import { IEmailService, emailService } from '../../services/email.service'; // Assuming emailService is a singleton export
import { otpStorage } from "../../services/otpStorage"; // otpStorage is a dependency for OtpService

export function getAuthComposer(): IAuthController {
    // Instantiate the Repository
    const repository: IAuthRepository = new AuthRepository();

    // Instantiate the new Services
    const jwtService: IJwtService = new JwtService();
    const otpService: IOtpService = new OtpService(otpStorage); // otpStorage is injected into OtpService
    const emailsvc: IEmailService = emailService; // Using the singleton instance of emailService

    // Instantiate Use Cases, injecting their respective dependencies
    const registerUseCase: IRegisterUseCase = new RegisterUseCase(repository, jwtService, emailsvc);
    const loginUseCase: ILoginUseCase = new LoginUseCase(repository, jwtService);
    const refreshTokenUseCase: IRefreshTokenUseCase = new RefreshTokenUseCase(repository, jwtService);
    const logoutUseCase: ILogoutUseCase = new LogoutUseCase(repository); // LogoutUseCase has no new dependencies
    const registerFacultyUseCase: IRegisterFacultyUseCase = new RegisterFacultyUseCase(repository, jwtService);
    const sendEmailOtpUseCase: ISendEmailOtpUseCase = new SendEmailOtpUseCase(repository, otpService, emailsvc);
    const verifyEmailOtpUseCase: IVerifyEmailOtpUseCase = new VerifyEmailOtpUseCase(otpService, jwtService);
    const resetPasswordUseCase: IResetPasswordUseCase = new ResetPasswordUseCase(repository, jwtService);
    const confirmRegistrationUseCase: IConfirmRegistrationUseCase = new ConfirmRegistrationUseCase(repository, jwtService);

    // Instantiate the Controller with all the Use Cases
    return new AuthController(
        registerUseCase,
        loginUseCase,
        refreshTokenUseCase,
        logoutUseCase,
        registerFacultyUseCase,
        sendEmailOtpUseCase,
        verifyEmailOtpUseCase,
        resetPasswordUseCase,
        confirmRegistrationUseCase
    );
}