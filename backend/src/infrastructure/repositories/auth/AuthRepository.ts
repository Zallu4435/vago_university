import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { emailService } from "../../services/email.service";
import { otpStorage } from "../../services/otpStorage";
import { AuthErrorType } from "../../../domain/auth/enums/AuthErrorType";
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
import { IAuthRepository } from "../../../application/auth/repositories/IAuthRepository";
import { Register } from "../../database/mongoose/models/register.model";
import { Admin } from "../../database/mongoose/models/admin.model";
import { User as UserModel } from "../../database/mongoose/models/user.model";
import { Faculty as FacultyModel } from "../../database/mongoose/models/faculty.model";
import { FacultyRegister } from "../../database/mongoose/models/facultyRegister.model";
import { Admission } from "../../database/mongoose/admission/AdmissionModel";

export class AuthRepository implements IAuthRepository {
    async register(params: RegisterRequestDTO): Promise<RegisterResponseDTO> {
        const existingUser = await Register.findOne({ email: params.email });
        if (existingUser) {
            throw new Error(AuthErrorType.UserAlreadyExists);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(params.password, salt);

        const user = new Register({
            firstName: params.firstName,
            lastName: params.lastName,
            email: params.email,
            password: hashedPassword,
        });

        await user.save();

        return {
            message: "User registered successfully",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        };
    }

    async login(params: LoginRequestDTO): Promise<LoginResponseDTO> {
        let user;
        let collection: "register" | "admin" | "user" | "faculty" = "register";

        user = await Admin.findOne({ email: params.email });
        if (user) {
            collection = "admin";
        }

        if (!user) {
            user = await UserModel.findOne({ email: params.email });
            if (user) collection = "user";
        }

        if (!user) {
            user = await FacultyModel.findOne({ email: params.email });
            if (user) collection = "faculty";
        }

        if (!user) {
            user = await Register.findOne({ email: params.email });
            if (user) {
                const admission = await Admission.findOne({ registerId: user._id });
                if (admission) {
                    throw new Error(AuthErrorType.AdmissionExists);
                }
                collection = "register";
            }
        }

        if (!user) {
            throw new Error(AuthErrorType.InvalidCredentials);
        }

        const isPasswordValid = await bcrypt.compare(params.password, user.password);
        if (!isPasswordValid) {
            throw new Error(AuthErrorType.InvalidCredentials);
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, collection },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1h" }
        );

        return {
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user._id.toString(),
                profilePicture: user.profilePicture,
            },
            collection,
        };
    }

    async refreshToken(params: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {
        try {
            const decoded = jwt.verify(
                params.token,
                process.env.JWT_SECRET || "your-secret-key"
            ) as {
                userId: string;
                email: string;
                collection: "register" | "admin" | "user" | "faculty";
            };

            let user;
            switch (decoded.collection) {
                case "register":
                    user = await Register.findById(decoded.userId);
                    break;
                case "admin":
                    user = await Admin.findById(decoded.userId);
                    break;
                case "user":
                    user = await UserModel.findById(decoded.userId);
                    break;
                case "faculty":
                    user = await FacultyModel.findById(decoded.userId);
                    break;
                default:
                    throw new Error(AuthErrorType.InvalidToken);
            }

            if (!user || user.email !== decoded.email) {
                throw new Error(AuthErrorType.InvalidToken);
            }

            const newToken = jwt.sign(
                { userId: user._id, email: user.email, collection: decoded.collection },
                process.env.JWT_SECRET || "your-secret-key",
                { expiresIn: "1h" }
            );

            return {
                token: newToken,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    id: user._id.toString(),
                    profilePicture: user.profilePicture,
                },
                collection: decoded.collection,
            };
        } catch (error) {
            throw new Error(AuthErrorType.InvalidToken);
        }
    }

    async logout(params: LogoutRequestDTO): Promise<LogoutResponseDTO> {
        return { message: "Logged out successfully" };
    }

    async registerFaculty(params: RegisterFacultyRequestDTO): Promise<RegisterFacultyResponseDTO> {
        console.log('=== AUTH REPOSITORY: REGISTER FACULTY START ===');
        console.log('Registration params:', params);
        
        const existingFaculty = await FacultyRegister.findOne({ email: params.email });
        if (existingFaculty) {
            console.log('ERROR: Faculty already exists with email:', params.email);
            throw new Error(AuthErrorType.FacultyAlreadyExists);
        }

        console.log('Creating new faculty record with data:', {
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
        console.log('Faculty saved successfully with ID:', faculty._id);

        const token = jwt.sign(
            { userId: faculty._id, email: faculty.email, collection: "faculty" },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1h" }
        );

        console.log('=== AUTH REPOSITORY: REGISTER FACULTY SUCCESS ===');
        return {
            token,
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
        let user = await Admin.findOne({ email: params.email });
        let collection: "register" | "admin" | "user" | "faculty" = "admin";

        if (!user) {
            user = await UserModel.findOne({ email: params.email });
            if (user) collection = "user";
        }

        if (!user) {
            user = await FacultyModel.findOne({ email: params.email });
            if (user) collection = "faculty";
        }

        if (!user) {
            user = await Register.findOne({ email: params.email });
            if (user) collection = "register";
        }

        if (!user) {
            throw new Error(AuthErrorType.EmailNotFound);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStorage.storeOtp(params.email, otp);

        await emailService.sendPasswordResetOtpEmail({
            to: params.email,
            name: user.firstName || "User",
            otp,
        });

        return { message: "OTP sent successfully" };
    }

    async verifyEmailOtp(params: VerifyEmailOtpRequestDTO): Promise<VerifyEmailOtpResponseDTO> {
        const storedOtp = otpStorage.getOtp(params.email);

        if (!storedOtp || storedOtp.otp !== params.otp) {
            throw new Error(AuthErrorType.InvalidOtp);
        }

        otpStorage.clearOtp(params.email);

        const resetToken = jwt.sign(
            { email: params.email, type: "password-reset" },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "15m" }
        );

        return { resetToken };
    }

    async resetPassword(params: ResetPasswordRequestDTO): Promise<ResetPasswordResponseDTO> {
        let payload: { email: string; type: string };
        try {
            payload = jwt.verify(
                params.resetToken,
                process.env.JWT_SECRET || "your-secret-key"
            ) as { email: string; type: string };
            if (payload.type !== "password-reset") {
                throw new Error(AuthErrorType.InvalidToken);
            }
        } catch (err) {
            throw new Error(AuthErrorType.InvalidToken);
        }

        const { email } = payload;

        let user = await Admin.findOne({ email });
        let collection: "register" | "admin" | "user" | "faculty" = "admin";
        let Model: any = Admin;

        if (!user) {
            user = await UserModel.findOne({ email });
            if (user) {
                collection = "user";
                Model = UserModel;
            }
        }

        if (!user) {
            user = await FacultyModel.findOne({ email });
            if (user) {
                collection = "faculty";
                Model = FacultyModel;
            }
        }

        if (!user) {
            user = await Register.findOne({ email });
            if (user) {
                collection = "register";
                Model = Register;
            }
        }

        if (!user) {
            throw new Error(AuthErrorType.EmailNotFound);
        }

        const hashedPassword = await bcrypt.hash(params.newPassword, 10);
        await Model.updateOne({ email }, { password: hashedPassword });

        const token = jwt.sign(
            { userId: user._id, email: user.email, collection },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1h" }
        );

        return {
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user._id.toString(),
                profilePicture: user.profilePicture || "",
            },
            collection,
        };
    }
}