import bcrypt from "bcryptjs";
import { User } from "../../database/mongoose/auth/user.model";
import { Faculty } from "../../database/mongoose/auth/faculty.model";
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
    async getProfile(params: GetProfileRequestDTO): Promise<any> {
        let user = await User.findById(params.userId).select("firstName lastName email phone profilePicture passwordChangedAt");
        let isFaculty = false;
        if (!user) {
            const faculty = await Faculty.findById(params.userId).select("firstName lastName email phone profilePicture passwordChangedAt");
            user = faculty as any;
            isFaculty = true;
        }
        return { user, isFaculty };
    }

    async updateProfile(params: UpdateProfileRequestDTO): Promise<any> {
        let user = await User.findById(params.userId);
        let isFaculty = false;
        if (!user) {
            const faculty = await Faculty.findById(params.userId);
            user = faculty as any;
            isFaculty = true;
        }
        return { user, isFaculty };
    }

    async findUserByEmail(email: string): Promise<any> {
        const user = await User.findOne({ email });
        return user;
    }

    async findFacultyByEmail(email: string): Promise<any> {
        const faculty = await Faculty.findOne({ email });
        return faculty;
    }

    async saveUser(user: any): Promise<any> {
        return await user.save();
    }

    async changePassword(params: ChangePasswordRequestDTO): Promise<any> {
        let user = await User.findById(params.userId);
        if (!user) {
            const faculty = await Faculty.findById(params.userId);
            user = faculty as any;
        }
        return user;
    }

    async updateProfilePicture(params: UpdateProfilePictureRequestDTO): Promise<any> {
        let user = await User.findById(params.userId);
        if (!user) {
            const faculty = await Faculty.findById(params.userId);
            user = faculty as any;
        }
        return user;
    }
}