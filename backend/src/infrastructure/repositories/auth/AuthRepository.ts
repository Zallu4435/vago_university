// infrastructure/repositories/auth/AuthRepository.ts (Updated)
import {
    UserAlreadyExistsError, InvalidCredentialsError, EmailNotConfirmedError,
    AdmissionExistsError, EmailNotFoundError,
    FacultyAlreadyExistsError, UserNotFoundError, AlreadyConfirmedError
} from "../../../domain/auth/errors/AuthErrors";
import { RefreshSession } from '../../database/mongoose/auth/refreshToken.model';

import {
    RegisterRequestDTO, LoginRequestDTO, RefreshTokenRequestDTO, LogoutRequestDTO,
    RegisterFacultyRequestDTO, SendEmailOtpRequestDTO, ResetPasswordRequestDTO,
} from "../../../domain/auth/dtos/AuthRequestDTOs";
import {
    RegisterResponseDTO, LoginResponseDTO, RefreshTokenResponseDTO, LogoutResponseDTO,
    RegisterFacultyResponseDTO, SendEmailOtpResponseDTO, ResetPasswordResponseDTO,
} from "../../../domain/auth/dtos/AuthResponseDTOs";

import { IAuthRepository } from "../../../application/auth/repositories/IAuthRepository";

import { Register } from "../../database/mongoose/auth/register.model";
import { Admin } from "../../database/mongoose/auth/admin.model";
import { User as UserModel } from "../../database/mongoose/auth/user.model";
import { Faculty as FacultyModel } from "../../database/mongoose/auth/faculty.model";
import { FacultyRegister } from "../../database/mongoose/models/facultyRegister.model";
import { Admission } from "../../database/mongoose/admission/AdmissionModel";

export class AuthRepository implements IAuthRepository {

    private async findUserByEmailAcrossCollections(
        email: string
    ): Promise<{ user: any; collection: "register" | "admin" | "user" | "faculty" } | null> {
        let user;

        user = await Admin.findOne({ email });
        if (user) return { user, collection: "admin" };

        user = await UserModel.findOne({ email });
        if (user) return { user, collection: "user" };

        user = await FacultyModel.findOne({ email });
        if (user) return { user, collection: "faculty" };

        user = await Register.findOne({ email });
        if (user) return { user, collection: "register" };

        return null;
    }

    private async findUserByIdAcrossCollections(
        userId: string,
        collectionType: "register" | "admin" | "user" | "faculty"
    ): Promise<{ user: any; collection: "register" | "admin" | "user" | "faculty" } | null> {
        let user;
        switch (collectionType) {
            case "register":
                user = await Register.findById(userId);
                break;
            case "admin":
                user = await Admin.findById(userId);
                break;
            case "user":
                user = await UserModel.findById(userId);
                break;
            case "faculty":
                user = await FacultyModel.findById(userId);
                break;
            default:
                return null;
        }
        if (user) return { user, collection: collectionType };
        return null;
    }

    async register(params: RegisterRequestDTO): Promise<RegisterResponseDTO> {
        const existingUser = await Register.findOne({ email: params.email });
        if (existingUser) {
            throw new UserAlreadyExistsError(params.email);
        }

        const user = new Register({
            firstName: params.firstName,
            lastName: params.lastName,
            email: params.email,
            password: params.password,
            pending: true,
        });

        await user.save();

        return {
            message: "User registered successfully, pending confirmation.",
            user: {
                id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
        };
    }

    async login(params: LoginRequestDTO): Promise<LoginResponseDTO> {
        const userResult = await this.findUserByEmailAcrossCollections(params.email);

        if (!userResult) {
            throw new InvalidCredentialsError();
        }

        const { user, collection } = userResult;

        if (collection === "register") {
            const admission = await Admission.findOne({ registerId: user._id });
            if (admission) {
                throw new AdmissionExistsError();
            }
            if (user.pending) {
                throw new EmailNotConfirmedError();
            }
        }

        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user._id?.toString(),
                profilePicture: (user as any).profilePicture || "",
                password: user.password,
                blocked: user.blocked,
            },
            collection,
        };
    }

    async refreshToken(params: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {
        const userResult = await this.findUserByIdAcrossCollections(
            params.userId as string,
            params.collection as "register" | "admin" | "user" | "faculty"
        );

        if (!userResult || userResult.user.email !== params.email) {
            throw new UserNotFoundError("User linked to token not found or email mismatch.");
        }

        const { user, collection } = userResult;

        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user._id?.toString(),
                profilePicture: (user as any).profilePicture || "",
            },
            collection,
        };
    }

    async registerFaculty(params: RegisterFacultyRequestDTO): Promise<RegisterFacultyResponseDTO> {
        const existingFaculty = await FacultyRegister.findOne({ email: params.email });
        if (existingFaculty) {
            throw new FacultyAlreadyExistsError(params.email);
        }

        const faculty = new FacultyRegister({
            fullName: params.fullName,
            email: params.email,
            phone: params.phone,
            department: params.department,
            qualification: params.qualification,
            experience: params.experience,
            aboutMe: params.aboutMe,
            cvUrl: params.cvUrl,
            certificatesUrl: params.certificatesUrl,
        });

        await faculty.save();

        return {
            user: {
                fullName: faculty.fullName,
                email: faculty.email,
                phone: faculty.phone,
                department: faculty.department,
                id: faculty._id.toString(),
            },
            collection: "faculty",
        };
    }

    async sendEmailOtp(params: SendEmailOtpRequestDTO): Promise<SendEmailOtpResponseDTO> {
        const userResult = await this.findUserByEmailAcrossCollections(params.email);

        if (!userResult) {
            throw new EmailNotFoundError();
        }
        return { message: "User found for OTP." };
    }

    // --- VERIFY EMAIL OTP (REMOVED from repo logic) ---
    // This method is now entirely handled by OtpService and JwtService within the Use Case.
    // async verifyEmailOtp(params: VerifyEmailOtpRequestDTO): Promise<VerifyEmailOtpResponseDTO> {
    //     // This method should be removed from here.
    //     // Its logic is now in VerifyEmailOtpUseCase.
    //     throw new Error("VerifyEmailOtp logic moved to Use Case and OtpService.");
    // }

    async resetPassword(params: ResetPasswordRequestDTO): Promise<ResetPasswordResponseDTO> {
        const userResult = await this.findUserByEmailAcrossCollections(params.email); // `email` comes from verified token in Use Case

        if (!userResult) {
            throw new UserNotFoundError();
        }

        const { user, collection } = userResult;
        let Model: any;

        switch (collection) {
            case "admin": Model = Admin; break;
            case "user": Model = UserModel; break;
            case "faculty": Model = FacultyModel; break;
            case "register": Model = Register; break;
            default: throw new Error("Invalid user collection type.");
        }

        await Model.updateOne({ email: params.email }, { password: params.newPassword });

        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user._id?.toString(),
                profilePicture: (user as any).profilePicture || "",
            },
            collection,
        };
    }

    async confirmRegistration(email: string): Promise<{ message: string }> {
        const user = await Register.findOne({ email: email });

        if (!user) {
            throw new UserNotFoundError("User for confirmation not found.");
        }
        if (!user.pending) {
            throw new AlreadyConfirmedError("User account is already confirmed.");
        }

        user.pending = false;
        await user.save();

        return { message: "Email confirmed successfully. You can now log in." };
    }

    // --- SESSION-BASED METHODS BELOW ---
    async createRefreshSession(params: {
        userId: string;
        sessionId: string;
        refreshToken: string;
        userAgent: string;
        ipAddress: string;
        createdAt: Date;
        lastUsedAt: Date;
        expiresAt: Date;
    }): Promise<void> {
        await RefreshSession.create(params);
    }

    async findSessionBySessionIdAndUserId(sessionId: string, userId: string): Promise<any> {
        return await RefreshSession.findOne({ sessionId, userId });
    }
    async updateSessionRefreshToken(sessionId: string, newRefreshToken: string, newExpiresAt: Date, newLastUsedAt: Date): Promise<void> {
        await RefreshSession.updateOne(
            { sessionId },
            { $set: { refreshToken: newRefreshToken, expiresAt: newExpiresAt, lastUsedAt: newLastUsedAt } }
        );
    }
    async deleteSessionBySessionId(sessionId: string): Promise<void> {
        await RefreshSession.deleteOne({ sessionId });
    }
    async deleteAllSessionsByUserId(userId: string): Promise<void> {
        await RefreshSession.deleteMany({ userId });
    }

    async findSessionByUserIdAndDevice(userId: string, userAgent: string, ipAddress: string): Promise<any> {
        const session = await RefreshSession.findOne({ userId, userAgent, ipAddress });
        if (session) {
            console.log('Found existing session for user/device:', session.sessionId);
        }
        return session;
    }

    async findLatestSessionByUserId(userId: string): Promise<any> {
        // Find the most recently used session for this user
        return await RefreshSession.findOne({ userId }).sort({ lastUsedAt: -1 });
    }

    async getAllSessions(): Promise<any[]> {
        return await RefreshSession.find({});
    }
}