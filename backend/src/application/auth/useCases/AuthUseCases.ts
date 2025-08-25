import bcrypt from "bcryptjs";
import { config } from "../../../config/config";
import { v4 as uuidv4 } from 'uuid';

import {
  RegisterRequestDTO, LoginRequestDTO, RefreshTokenRequestDTO, LogoutRequestDTO,
  RegisterFacultyRequestDTO, SendEmailOtpRequestDTO, VerifyEmailOtpRequestDTO, ResetPasswordRequestDTO,
} from "../../../domain/auth/dtos/AuthRequestDTOs";
import {
  RegisterResponseDTO, LoginResponseDTO, RefreshTokenResponseDTO, LogoutResponseDTO,
  RegisterFacultyResponseDTO, SendEmailOtpResponseDTO, VerifyEmailOtpResponseDTO, ResetPasswordResponseDTO,
} from "../../../domain/auth/dtos/AuthResponseDTOs";

import { IAuthRepository } from '../repositories/IAuthRepository';
import { RegisterRequest, RegisterFacultyRequest } from "../../../domain/auth/entities/Auth";

import { IJwtService } from "../../../infrastructure/services/auth/JwtService";
import { IOtpService } from '../../../infrastructure/services/auth/OtpService';
import { IEmailService } from "../service/IEmailService";
import { InvalidCredentialsError, InvalidTokenError, BlockedAccountError } from "../../../domain/auth/errors/AuthErrors";

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


export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private jwtService: IJwtService,
    private emailService: IEmailService
  ) { }

  async execute(params: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(params.password, salt);

    const registerRequest = RegisterRequest.create({
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      password: hashedPassword
    });

    const resultFromRepo = await this.authRepository.register(registerRequest);

    const confirmationToken = this.jwtService.generateToken(
      { email: params.email },
      "1d"
    );

    const confirmationUrl = `${config.frontendUrl}/confirm-registration?token=${confirmationToken}`;

    await this.emailService.sendRegistrationConfirmationEmail({
      to: params.email,
      name: params.firstName,
      confirmationUrl,
    });

    return {
      message: "Registration successful. Please check your email to confirm your account.",
      user: {
        firstName: resultFromRepo.user.firstName,
        lastName: resultFromRepo.user.lastName,
        email: resultFromRepo.user.email,
        id: resultFromRepo.user.id,
      },
    };
  }
}

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private _authRepository: IAuthRepository,
    private _jwtService: IJwtService
  ) { }

  async execute(params: LoginRequestDTO & { userAgent: string; ipAddress: string }): Promise<LoginResponseDTO & { sessionId: string }> {
    const resultFromRepo = await this._authRepository.login(params.email);

    const user = resultFromRepo.user;
    const collection = resultFromRepo.collection;

    const isPasswordValid = await bcrypt.compare(params.password, user.password as string);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    if (user.blocked) {
      throw new BlockedAccountError();
    }

    const tokenPayload = { 
      userId: user.id, 
      email: user.email, 
      collection 
    };

    const accessToken = this._jwtService.generateAccessToken(tokenPayload);
    let sessionId: string;
    let refreshToken: string;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const existingSession = await this._authRepository.findSessionByUserIdAndDevice(user.id, params.userAgent, params.ipAddress);
    if (existingSession) {
      sessionId = existingSession.sessionId;
      refreshToken = this._jwtService.generateRefreshToken({ ...tokenPayload, sessionId });
      await this._authRepository.updateSessionRefreshToken(sessionId, refreshToken, expiresAt, now);
    } else {
      sessionId = uuidv4();
      refreshToken = this._jwtService.generateRefreshToken({ ...tokenPayload, sessionId });
      await this._authRepository.createRefreshSession({
        userId: user.id,
        sessionId,
        refreshToken,
        userAgent: params.userAgent,
        ipAddress: params.ipAddress,
        createdAt: now,
        lastUsedAt: now,
        expiresAt,
      });
    }

    return {
      accessToken,
      refreshToken,
      sessionId,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user.id,
        profilePicture: user.profilePicture,
        password: user.password,
        blocked: user.blocked,
      },
      collection,
    };
  }
}

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private _authRepository: IAuthRepository,
    private _jwtService: IJwtService
  ) { }

  async execute(params: { refreshToken: string }): Promise<RefreshTokenResponseDTO> {
    let decoded;
    try {
      decoded = this._jwtService.verifyToken<{ userId: string; email: string; collection: string; sessionId: string }>(params.refreshToken, { isRefreshToken: true });
    } catch (err) {
      throw new InvalidTokenError('Invalid or expired refresh token');
    }
    const { userId, email, collection, sessionId } = decoded;
    const session = await this._authRepository.findSessionBySessionIdAndUserId(sessionId, userId);
    if (!session || session.refreshToken !== params.refreshToken) {
      throw new InvalidTokenError('Session not found or refresh token mismatch');
    }
    const newRefreshToken = this._jwtService.generateRefreshToken({ userId, email, collection, sessionId });
    const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const newLastUsedAt = new Date();
    await this._authRepository.updateSessionRefreshToken(sessionId, newRefreshToken, newExpiresAt, newLastUsedAt);
    const tokenPayload = { userId, email, collection };
    const accessToken = this._jwtService.generateAccessToken(tokenPayload);
    const resultFromRepo = await this._authRepository.refreshToken(userId, collection);
    return {
      accessToken,
      user: {
        firstName: resultFromRepo.user.firstName,
        lastName: resultFromRepo.user.lastName,
        email: resultFromRepo.user.email,
        id: resultFromRepo.user.id as string,
        profilePicture: resultFromRepo.user.profilePicture,
      },
      collection: resultFromRepo.collection,
    };
  }
}

export class LogoutUseCase implements ILogoutUseCase {
  constructor(private _authRepository: IAuthRepository) { }

  async execute(params: { sessionId: string }): Promise<LogoutResponseDTO> {
    await this._authRepository.deleteSessionBySessionId(params.sessionId);
    return { message: 'Logged out successfully' };
  }
}

export class LogoutAllUseCase {
  constructor(private _authRepository: IAuthRepository) { }

  async execute(params: { userId: string }): Promise<{ message: string }> {
    await this._authRepository.deleteAllSessionsByUserId(params.userId);
    return { message: 'Logged out from all devices' };
  }
}

export class RegisterFacultyUseCase implements IRegisterFacultyUseCase {
  constructor(
    private _authRepository: IAuthRepository,
    private _jwtService: IJwtService
  ) { }

  async execute(params: RegisterFacultyRequestDTO): Promise<RegisterFacultyResponseDTO> {
    const registerFacultyRequest = RegisterFacultyRequest.create({
      fullName: params.fullName,
      email: params.email,
      phone: params.phone,
      department: params.department,
      qualification: params.qualification,
      experience: params.experience,
      aboutMe: params.aboutMe,
      cvUrl: params.cvUrl,
      certificatesUrl: params.certificatesUrl
    });

    const resultFromRepo = await this._authRepository.registerFaculty(registerFacultyRequest);

    const token = this._jwtService.generateToken(
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

export class SendEmailOtpUseCase implements ISendEmailOtpUseCase {
  constructor(
    private _authRepository: IAuthRepository,
    private _otpService: IOtpService,
    private _emailService: IEmailService
  ) { }

  async execute(params: SendEmailOtpRequestDTO): Promise<SendEmailOtpResponseDTO> {
    await this._authRepository.sendEmailOtp(params.email);

    const otp = this._otpService.generateOtp();
    this._otpService.storeOtp(params.email, otp);

    await this._emailService.sendPasswordResetOtpEmail({
      to: params.email,
      name: "User",
      otp,
    });

    return { message: "OTP sent successfully" };
  }
}

export class VerifyEmailOtpUseCase implements IVerifyEmailOtpUseCase {
  constructor(
    private _otpService: IOtpService,
    private _jwtService: IJwtService
  ) { }

  async execute(params: VerifyEmailOtpRequestDTO): Promise<VerifyEmailOtpResponseDTO> {
    this._otpService.verifyOtp(params.email, params.otp);

    const resetToken = this._jwtService.generateToken(
      { email: params.email, type: "password-reset" },
      "15m"
    );

    return { resetToken };
  }
}

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private _authRepository: IAuthRepository,
    private _jwtService: IJwtService
  ) { }

  async execute(params: ResetPasswordRequestDTO): Promise<ResetPasswordResponseDTO> {
    let payload: { email: string; type: string };
    payload = this._jwtService.verifyToken(params.resetToken);
    if (payload.type !== "password-reset") {
      throw new InvalidTokenError("Invalid token type for password reset.");
    }

    const hashedPassword = await bcrypt.hash(params.newPassword, 10);

    const resultFromRepo = await this._authRepository.resetPassword(payload.email, hashedPassword);

    const token = this._jwtService.generateToken(
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

export class ConfirmRegistrationUseCase implements IConfirmRegistrationUseCase {
  constructor(
    private _authRepository: IAuthRepository,
    private _jwtService: IJwtService
  ) { }

  async execute(token: string): Promise<{ message: string }> {
    let payload: { email: string };
    payload = this._jwtService.verifyToken(token);

    const result = await this._authRepository.confirmRegistration(payload.email);

    return { message: result.message };
  }
}