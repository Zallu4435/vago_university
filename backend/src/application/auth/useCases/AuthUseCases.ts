// application/auth/useCases/AuthUseCases.ts (Updated: No try-catch, direct returns, throws errors)
import bcrypt from "bcryptjs";
import { config } from "../../../config/config";



// DTOs
import {
  RegisterRequestDTO, LoginRequestDTO, RefreshTokenRequestDTO, LogoutRequestDTO,
  RegisterFacultyRequestDTO, SendEmailOtpRequestDTO, VerifyEmailOtpRequestDTO, ResetPasswordRequestDTO,
} from "../../../domain/auth/dtos/AuthRequestDTOs";
import {
  RegisterResponseDTO, LoginResponseDTO, RefreshTokenResponseDTO, LogoutResponseDTO,
  RegisterFacultyResponseDTO, SendEmailOtpResponseDTO, VerifyEmailOtpResponseDTO, ResetPasswordResponseDTO,
} from "../../../domain/auth/dtos/AuthResponseDTOs";

// Repository Interface
import { IAuthRepository } from '../repositories/IAuthRepository';

// Services Interfaces
import { IJwtService } from "../../../infrastructure/services/auth/JwtService";
import { IOtpService } from '../../../infrastructure/services/auth/OtpService';
import { IEmailService } from "../service/IEmailService";
import { InvalidCredentialsError, InvalidTokenError } from "../../../domain/auth/errors/AuthErrors";

// --- Use Case Interfaces (UPDATED: No ResponseDTO wrapper) ---
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
  // This one was already returning { message: string } directly, we maintain this.
  execute(token: string): Promise<{ message: string }>;
}


// --- RegisterUseCase ---
export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private jwtService: IJwtService,
    private emailService: IEmailService
  ) { }

  async execute(params: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    // Hash password before sending to repository
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(params.password, salt);

    const registerParamsWithHashedPassword = { ...params, password: hashedPassword };

    // AuthRepository will throw UserAlreadyExistsError if email exists
    const resultFromRepo = await this.authRepository.register(registerParamsWithHashedPassword);

    // Generate confirmation token after user is saved
    const confirmationToken = this.jwtService.generateToken(
      { email: params.email }, // Use email for confirmation token
      "1d" // Expires in 1 day
    );

    const confirmationUrl = `${config.frontendUrl}/confirm-registration?token=${confirmationToken}`;

    // Send confirmation email
    await this.emailService.sendRegistrationConfirmationEmail({
      to: params.email,
      name: params.firstName,
      confirmationUrl,
    });

    // Return the direct response DTO
    return {
      message: "Registration successful. Please check your email to confirm your account.",
      user: {
        firstName: resultFromRepo.user.firstName,
        lastName: resultFromRepo.user.lastName,
        email: resultFromRepo.user.email,
      },
    };
  }
}

// --- LoginUseCase ---
export class LoginUseCase implements ILoginUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private jwtService: IJwtService
  ) { }

  async execute(params: LoginRequestDTO): Promise<LoginResponseDTO> {
    // Repository fetches user, including hashed password
    const resultFromRepo = await this.authRepository.login(params);

    const user = resultFromRepo.user;
    const collection = resultFromRepo.collection;

    // Compare password (business logic)
    const isPasswordValid = await bcrypt.compare(params.password, user.password as string);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError(); // Throw domain error
    }

    // Generate token (business logic)
    const token = this.jwtService.generateToken(
      { userId: user.id, email: user.email, collection },
      "1h"
    );

    // Return the full DTO directly
    return {
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user.id,
        profilePicture: user.profilePicture,
      },
      collection,
    };
  }
}

// --- RefreshTokenUseCase ---
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private jwtService: IJwtService
  ) { }

  async execute(params: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {
    // Verify the incoming token first
    let decodedPayload: { userId: string; email: string; collection: "register" | "admin" | "user" | "faculty" };
    decodedPayload = this.jwtService.verifyToken(params.token); // JwtService throws InvalidTokenError if invalid

    // Use repository to fetch user based on decoded ID and collection
    const resultFromRepo = await this.authRepository.refreshToken({
      ...params,
      userId: decodedPayload.userId,
      email: decodedPayload.email,
      collection: decodedPayload.collection,
    });

    // Generate a new token
    const newToken = this.jwtService.generateToken(
      { userId: resultFromRepo.user.id, email: resultFromRepo.user.email, collection: resultFromRepo.collection },
      "1h"
    );

    return {
      token: newToken,
      user: {
        firstName: resultFromRepo.user.firstName,
        lastName: resultFromRepo.user.lastName,
        email: resultFromRepo.user.email,
        id: resultFromRepo.user.id,
        profilePicture: resultFromRepo.user.profilePicture,
      },
      collection: resultFromRepo.collection,
    };
  }
}

// --- LogoutUseCase ---
export class LogoutUseCase implements ILogoutUseCase {
  constructor(private authRepository: IAuthRepository) { }

  async execute(params: LogoutRequestDTO): Promise<LogoutResponseDTO> {
    // Repository handles any logout logic (e.g., blacklisting tokens)
    const result = await this.authRepository.logout(params);
    return result;
  }
}

// --- RegisterFacultyUseCase ---
export class RegisterFacultyUseCase implements IRegisterFacultyUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private jwtService: IJwtService
  ) { }

  async execute(params: RegisterFacultyRequestDTO): Promise<RegisterFacultyResponseDTO> {
    // Repository handles existence check and saves data
    const resultFromRepo = await this.authRepository.registerFaculty(params);

    // Generate token
    const token = this.jwtService.generateToken(
      { userId: resultFromRepo.user.id, email: resultFromRepo.user.email, collection: resultFromRepo.collection },
      "1h"
    );

    return {
      token,
      user: resultFromRepo.user,
      collection: resultFromRepo.collection,
    };
  }
}

// --- SendEmailOtpUseCase ---
export class SendEmailOtpUseCase implements ISendEmailOtpUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private otpService: IOtpService,
    private emailService: IEmailService
  ) { }

  async execute(params: SendEmailOtpRequestDTO): Promise<SendEmailOtpResponseDTO> {
    // Repository confirms user exists (throws EmailNotFoundError if not)
    await this.authRepository.sendEmailOtp(params);

    // Generate OTP and store it
    const otp = this.otpService.generateOtp();
    this.otpService.storeOtp(params.email, otp);

    // Send OTP email
    await this.emailService.sendPasswordResetOtpEmail({
      to: params.email,
      name: "User", // Placeholder: You might fetch user's name in a real scenario
      otp,
    });

    return { message: "OTP sent successfully" };
  }
}

// --- VerifyEmailOtpUseCase ---
export class VerifyEmailOtpUseCase implements IVerifyEmailOtpUseCase {
  constructor(
    private otpService: IOtpService,
    private jwtService: IJwtService
  ) { }

  async execute(params: VerifyEmailOtpRequestDTO): Promise<VerifyEmailOtpResponseDTO> {
    // Verify OTP using OtpService. This service will throw InvalidOtpError if failed.
    this.otpService.verifyOtp(params.email, params.otp);

    // If OTP is valid, generate a reset token
    const resetToken = this.jwtService.generateToken(
      { email: params.email, type: "password-reset" },
      "15m" // Expires in 15 minutes
    );

    return { resetToken };
  }
}

// --- ResetPasswordUseCase ---
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private jwtService: IJwtService
  ) { }

  async execute(params: ResetPasswordRequestDTO): Promise<ResetPasswordResponseDTO> {
    // Verify the reset token first
    let payload: { email: string; type: string };
    payload = this.jwtService.verifyToken(params.resetToken); // JwtService throws InvalidTokenError
    if (payload.type !== "password-reset") {
      throw new InvalidTokenError("Invalid token type for password reset.");
    }

    // Hash the new password before sending to repository
    const hashedPassword = await bcrypt.hash(params.newPassword, 10);

    // Update password via repository
    const resetPasswordParamsForRepo = { ...params, email: payload.email, newPassword: hashedPassword };
    const resultFromRepo = await this.authRepository.resetPassword(resetPasswordParamsForRepo);

    // Generate a new login token after password reset for immediate login
    const token = this.jwtService.generateToken(
      { userId: resultFromRepo.user.id, email: resultFromRepo.user.email, collection: resultFromRepo.collection },
      "1h"
    );

    return {
      token,
      user: resultFromRepo.user,
      collection: resultFromRepo.collection,
    };
  }
}

// --- ConfirmRegistrationUseCase ---
export class ConfirmRegistrationUseCase implements IConfirmRegistrationUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private jwtService: IJwtService
  ) { }

  async execute(token: string): Promise<{ message: string }> {
    // Verify confirmation token and extract email
    let payload: { email: string };
    payload = this.jwtService.verifyToken(token); // JwtService throws InvalidTokenError

    // Call repository to update user status using the extracted email
    const result = await this.authRepository.confirmRegistration(payload.email);

    return { message: result.message };
  }
}