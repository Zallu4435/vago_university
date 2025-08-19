
import {
    UserAlreadyExistsError, InvalidCredentialsError, EmailNotConfirmedError,
    AdmissionExistsError, EmailNotFoundError,
    FacultyAlreadyExistsError, UserNotFoundError, AlreadyConfirmedError
} from "../../../domain/auth/errors/AuthErrors";
import { RefreshSession } from '../../database/mongoose/auth/refreshToken.model';

import { IAuthRepository } from "../../../application/auth/repositories/IAuthRepository";
import { RegisterRequest, RegisterFacultyRequest, User } from "../../../domain/auth/entities/Auth";

import { Register } from "../../database/mongoose/auth/register.model";
import { Admin } from "../../database/mongoose/auth/admin.model";
import { User as UserModel } from "../../database/mongoose/auth/user.model";
import { Faculty as FacultyModel } from "../../database/mongoose/auth/faculty.model";
import { FacultyRegister } from "../../database/mongoose/auth/facultyRegister.model";
import { Admission } from "../../database/mongoose/admission/AdmissionModel";

export class AuthRepository implements IAuthRepository {

    private async findUserByEmailAcrossCollections(
        email: string
    ): Promise<{ user; collection: "register" | "admin" | "user" | "faculty" } | null> {
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
    ): Promise<{ user; collection: "register" | "admin" | "user" | "faculty" } | null> {
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

    async register(params: RegisterRequest) {
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

    async login(email: string) {
        const userResult = await this.findUserByEmailAcrossCollections(email);

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
                id: user._id?.toString() || "",
                profilePicture: user.profilePicture || "",
                password: user.password,
                blocked: user.blocked,
            },
            collection,
        };
    }

    async refreshToken(userId: string, collection: "register" | "admin" | "user" | "faculty") {
        const userResult = await this.findUserByIdAcrossCollections(
            userId,
            collection
        );

        if (!userResult) {
            throw new UserNotFoundError("User linked to token not found or email mismatch.");
        }

        const { user, collection: userCollection } = userResult;

        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user._id?.toString() || "",
                profilePicture: user.profilePicture || "",
            },
            collection: userCollection,
        };
    }

    async registerFaculty(params: RegisterFacultyRequest) {
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
            collection: "faculty" as const,
        };
    }

    async sendEmailOtp(email: string) {
        const userResult = await this.findUserByEmailAcrossCollections(email);

        if (!userResult) {
            throw new EmailNotFoundError();
        }
        return { message: "User found for OTP." };
    }

    async resetPassword(email: string, newPassword: string) {
        const userResult = await this.findUserByEmailAcrossCollections(email); 

        if (!userResult) {
            throw new UserNotFoundError();
        }

        const { user, collection } = userResult;
        let Model

        switch (collection) {
            case "admin": Model = Admin; break;
            case "user": Model = UserModel; break;
            case "faculty": Model = FacultyModel; break;
            case "register": Model = Register; break;
            default: throw new Error("Invalid user collection type.");
        }

        await Model.updateOne({ email: email }, { password: newPassword });

        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user._id?.toString() || "",
                profilePicture: user.profilePicture || "",
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

    async findSessionBySessionIdAndUserId(sessionId: string, userId: string) {
        return await RefreshSession.findOne({ sessionId, userId });
    }
    async updateSessionRefreshToken(sessionId: string, newRefreshToken: string, newExpiresAt: Date, newLastUsedAt: Date) {
        await RefreshSession.updateOne(
            { sessionId },
            { $set: { refreshToken: newRefreshToken, expiresAt: newExpiresAt, lastUsedAt: newLastUsedAt } }
        );
    }
    async deleteSessionBySessionId(sessionId: string) {
        await RefreshSession.deleteOne({ sessionId });
    }
    async deleteAllSessionsByUserId(userId: string) {
        await RefreshSession.deleteMany({ userId });
    }

    async findSessionByUserIdAndDevice(userId: string, userAgent: string, ipAddress: string) {
        const session = await RefreshSession.findOne({ userId, userAgent, ipAddress });
        return session;
    }

    async findLatestSessionByUserId(userId: string) {
        return await RefreshSession.findOne({ userId }).sort({ lastUsedAt: -1 });
    }

    async getAllSessions() {
        return await RefreshSession.find({});
    }
}