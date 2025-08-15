import {
    GetProfileRequestDTO,
    UpdateProfileRequestDTO,
    ChangePasswordRequestDTO,
    UpdateProfilePictureRequestDTO,
} from "../../../domain/profile/dtos/ProfileRequestDTOs";
import {
    ProfileResponseDTO,
    UpdateProfileResponseDTO,
    ChangePasswordResponseDTO,
    UpdateProfilePictureResponseDTO,
} from "../../../domain/profile/dtos/ProfileResponseDTOs";
import { ProfileErrorType } from "../../../domain/profile/enums/ProfileErrorType";
import { IProfileRepository } from "../repositories/IProfileRepository";
import bcrypt from "bcryptjs";

interface ResponseDTO<T> {
    data: T | { error: string };
    success: boolean;
}

export interface IGetProfileUseCase {
    execute(params: GetProfileRequestDTO): Promise<ResponseDTO<ProfileResponseDTO>>;
}

export interface IUpdateProfileUseCase {
    execute(params: UpdateProfileRequestDTO): Promise<ResponseDTO<UpdateProfileResponseDTO>>;
}

export interface IChangePasswordUseCase {
    execute(params: ChangePasswordRequestDTO): Promise<ResponseDTO<ChangePasswordResponseDTO>>;
}

export interface IUpdateProfilePictureUseCase {
    execute(params: UpdateProfilePictureRequestDTO): Promise<ResponseDTO<UpdateProfilePictureResponseDTO>>;
}

export class GetProfileUseCase implements IGetProfileUseCase {
    constructor(private profileRepository: IProfileRepository) { }

    async execute(params: GetProfileRequestDTO): Promise<ResponseDTO<ProfileResponseDTO>> {
        const { user, isFaculty } = await this.profileRepository.getProfile(params);
        if (!user) {
            return { data: { error: ProfileErrorType.UserNotFound }, success: false };
        }
        return {
            data: {
                firstName: user.firstName,
                lastName: user.lastName || undefined,
                email: user.email,
                phone: user.phone,
                profilePicture: user.profilePicture,
                facultyId: isFaculty ? user._id.toString() : undefined,
                studentId: !isFaculty ? user._id.toString() : undefined,
                passwordChangedAt: user.passwordChangedAt ? user.passwordChangedAt.toISOString() : undefined,
            },
            success: true
        };
    }
}

export class UpdateProfileUseCase implements IUpdateProfileUseCase {
    constructor(private profileRepository: IProfileRepository) { }

    async execute(params: UpdateProfileRequestDTO): Promise<ResponseDTO<UpdateProfileResponseDTO>> {
        const { user, isFaculty } = await this.profileRepository.updateProfile(params);
        if (!user) {
            return { data: { error: ProfileErrorType.UserNotFound }, success: false };
        }
        if (params.email && params.email !== user.email) {
            const existingUser = await this.profileRepository.findUserByEmail(params.email);
            const existingFaculty = await this.profileRepository.findFacultyByEmail(params.email);
            if (existingUser || existingFaculty) {
                return { data: { error: ProfileErrorType.EmailAlreadyInUse }, success: false };
            }
        }
        user.firstName = params.firstName;
        user.lastName = params.lastName;
        user.phone = params.phone;
        user.email = params.email;
        await this.profileRepository.saveUser(user);
        return {
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
            },
            success: true
        };
    }
}

export class ChangePasswordUseCase implements IChangePasswordUseCase {
    constructor(private profileRepository: IProfileRepository) { }

    async execute(params: ChangePasswordRequestDTO): Promise<ResponseDTO<ChangePasswordResponseDTO>> {
        if (params.newPassword !== params.confirmPassword) {
            return { data: { error: ProfileErrorType.PasswordsDoNotMatch }, success: false };
        }
        let user = await this.profileRepository.changePassword(params);
        if (!user) {
            return { data: { error: ProfileErrorType.UserNotFound }, success: false };
        }
        const isPasswordValid = await bcrypt.compare(params.currentPassword, user.password);
        if (!isPasswordValid) {
            return { data: { error: ProfileErrorType.IncorrectCurrentPassword }, success: false };
        }
        user.password = params.newPassword;
        await this.profileRepository.saveUser(user);
        return { data: { message: "Password updated successfully" }, success: true };
    }
}

export class UpdateProfilePictureUseCase implements IUpdateProfilePictureUseCase {
    constructor(private profileRepository: IProfileRepository) { }

    async execute(params: UpdateProfilePictureRequestDTO): Promise<ResponseDTO<UpdateProfilePictureResponseDTO>> {
        let user = await this.profileRepository.updateProfilePicture(params);
        if (!user) {
            return { data: { error: ProfileErrorType.UserNotFound }, success: false };
        }
        user.profilePicture = params.filePath;
        await this.profileRepository.saveUser(user);
        return { data: { profilePicture: user.profilePicture || "" }, success: true };
    }
}