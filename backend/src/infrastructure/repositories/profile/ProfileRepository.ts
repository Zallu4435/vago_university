import bcrypt from "bcryptjs";
import { User } from "../../database/mongoose/models/user.model";
import { ProfileErrorType } from "../../../domain/profile/enums/ProfileErrorType";
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
import { IProfileRepository } from "../../../application/profile/repositories/IProfileRepository";

export class ProfileRepository implements IProfileRepository {
    async getProfile(params: GetProfileRequestDTO): Promise<ProfileResponseDTO> {
        const user = await User.findById(params.userId).select("firstName lastName email phone profilePicture");
        if (!user) {
            throw new Error(ProfileErrorType.UserNotFound);
        }

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            profilePicture: user.profilePicture,
        };
    }

    async updateProfile(params: UpdateProfileRequestDTO): Promise<UpdateProfileResponseDTO> {
        const user = await User.findById(params.userId);
        if (!user) {
            throw new Error(ProfileErrorType.UserNotFound);
        }

        if (params.email && params.email !== user.email) {
            const existingUser = await User.findOne({ email: params.email });
            if (existingUser) {
                throw new Error(ProfileErrorType.EmailAlreadyInUse);
            }
        }

        user.firstName = params.firstName;
        user.lastName = params.lastName;
        user.phone = params.phone;
        user.email = params.email;

        await user.save();

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
        };
    }

    async changePassword(params: ChangePasswordRequestDTO): Promise<ChangePasswordResponseDTO> {
        const user = await User.findById(params.userId);
        if (!user) {
            throw new Error(ProfileErrorType.UserNotFound);
        }

        const isPasswordValid = await bcrypt.compare(params.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error(ProfileErrorType.IncorrectCurrentPassword);
        }

        const hashedPassword = await bcrypt.hash(params.newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        return { message: "Password updated successfully" };
    }

    async updateProfilePicture(params: UpdateProfilePictureRequestDTO): Promise<UpdateProfilePictureResponseDTO> {
        const user = await User.findById(params.userId);
        if (!user) {
            throw new Error(ProfileErrorType.UserNotFound);
        }

        user.profilePicture = params.filePath;
        await user.save();

        return { profilePicture: user.profilePicture || "" };
    }
}