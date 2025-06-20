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
        try {
            console.log(`Executing getProfile use case with params:`, params);
            const result = await this.profileRepository.getProfile(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("GetProfileUseCase: Error:", error);
            return { data: { error: error.message || ProfileErrorType.UserNotFound }, success: false };
        }
    }
}

export class UpdateProfileUseCase implements IUpdateProfileUseCase {
    constructor(private profileRepository: IProfileRepository) { }

    async execute(params: UpdateProfileRequestDTO): Promise<ResponseDTO<UpdateProfileResponseDTO>> {
        try {
            console.log(`Executing updateProfile use case with params:`, params);
            const result = await this.profileRepository.updateProfile(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("UpdateProfileUseCase: Error:", error);
            return { data: { error: error.message || ProfileErrorType.UserNotFound }, success: false };
        }
    }
}

export class ChangePasswordUseCase implements IChangePasswordUseCase {
    constructor(private profileRepository: IProfileRepository) { }

    async execute(params: ChangePasswordRequestDTO): Promise<ResponseDTO<ChangePasswordResponseDTO>> {
        try {
            console.log(`Executing changePassword use case with params:`, params.userId);
            if (params.newPassword !== params.confirmPassword) {
                return { data: { error: ProfileErrorType.PasswordsDoNotMatch }, success: false };
            }
            const result = await this.profileRepository.changePassword(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("ChangePasswordUseCase: Error:", error);
            return { data: { error: error.message || ProfileErrorType.IncorrectCurrentPassword }, success: false };
        }
    }
}

export class UpdateProfilePictureUseCase implements IUpdateProfilePictureUseCase {
    constructor(private profileRepository: IProfileRepository) { }

    async execute(params: UpdateProfilePictureRequestDTO): Promise<ResponseDTO<UpdateProfilePictureResponseDTO>> {
        try {
            console.log(`Executing updateProfilePicture use case with params:`, params);
            const result = await this.profileRepository.updateProfilePicture(params);
            return { data: result, success: true };
        } catch (error: any) {
            console.error("UpdateProfilePictureUseCase: Error:", error);
            return { data: { error: error.message || ProfileErrorType.UserNotFound }, success: false };
        }
    }
}