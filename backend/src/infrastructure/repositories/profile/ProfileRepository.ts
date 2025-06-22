import bcrypt from "bcryptjs";
import { User } from "../../database/mongoose/models/user.model";
import { Faculty } from "../../database/mongoose/models/faculty.model";
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
        // Try to find user first
        let user = await User.findById(params.userId).select("firstName lastName email phone profilePicture passwordChangedAt");
        let isFaculty = false;

        if (!user) {
            // If not found in User collection, try Faculty collection
            const faculty = await Faculty.findById(params.userId).select("firstName lastName email phone profilePicture passwordChangedAt");
            if (!faculty) {
                throw new Error(ProfileErrorType.UserNotFound);
            }
            user = faculty as any; // Type assertion for compatibility
            isFaculty = true;
        }

        return {
            firstName: user.firstName,
            lastName: user.lastName || undefined,
            email: user.email,
            phone: user.phone,
            profilePicture: user.profilePicture,
            facultyId: isFaculty ? user._id.toString() : undefined,
            studentId: !isFaculty ? user._id.toString() : undefined,
            passwordChangedAt: user.passwordChangedAt ? user.passwordChangedAt.toISOString() : undefined,
        };
    }

    async updateProfile(params: UpdateProfileRequestDTO): Promise<UpdateProfileResponseDTO> {
        // Try to find user first
        let user = await User.findById(params.userId);
        let isFaculty = false;

        if (!user) {
            // If not found in User collection, try Faculty collection
            const faculty = await Faculty.findById(params.userId);
            if (!faculty) {
                throw new Error(ProfileErrorType.UserNotFound);
            }
            user = faculty as any; // Type assertion for compatibility
            isFaculty = true;
        }

        if (params.email && params.email !== user.email) {
            // Check for email uniqueness in both collections
            const existingUser = await User.findOne({ email: params.email });
            const existingFaculty = await Faculty.findOne({ email: params.email });
            
            if (existingUser || existingFaculty) {
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
        // Try to find user first
        let user = await User.findById(params.userId);

        if (!user) {
            // If not found in User collection, try Faculty collection
            const faculty = await Faculty.findById(params.userId);
            if (!faculty) {
                throw new Error(ProfileErrorType.UserNotFound);
            }
            user = faculty as any; // Type assertion for compatibility
        }

        const isPasswordValid = await bcrypt.compare(params.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error(ProfileErrorType.IncorrectCurrentPassword);
        }

        // Set the new password (pre-save middleware will hash it and set passwordChangedAt)
        user.password = params.newPassword;

        await user.save();

        return { message: "Password updated successfully" };
    }

    async updateProfilePicture(params: UpdateProfilePictureRequestDTO): Promise<UpdateProfilePictureResponseDTO> {
        // Try to find user first
        let user = await User.findById(params.userId);

        if (!user) {
            // If not found in User collection, try Faculty collection
            const faculty = await Faculty.findById(params.userId);
            if (!faculty) {
                throw new Error(ProfileErrorType.UserNotFound);
            }
            user = faculty as any; // Type assertion for compatibility
        }

        user.profilePicture = params.filePath;
        await user.save();

        return { profilePicture: user.profilePicture || "" };
    }
}