import { User } from "../../database/mongoose/auth/user.model";
import { Faculty } from "../../database/mongoose/auth/faculty.model";
import {
    GetProfileRequestDTO,
    UpdateProfileRequestDTO,
    ChangePasswordRequestDTO,
    UpdateProfilePictureRequestDTO,
} from "../../../domain/profile/dtos/ProfileRequestDTOs";
import { IProfileRepository } from "../../../application/profile/repositories/IProfileRepository";

export class ProfileRepository implements IProfileRepository {
    async getProfile(params: GetProfileRequestDTO) {
        let user = await User.findById(params.userId).select("firstName lastName email phone profilePicture passwordChangedAt");
        let isFaculty = false;
        if (!user) {
            const faculty = await Faculty.findById(params.userId).select("firstName lastName email phone profilePicture passwordChangedAt");
            user = faculty as any;
            isFaculty = true;
        }
        return { user, isFaculty };
    }

    async updateProfile(params: UpdateProfileRequestDTO) {
        let user = await User.findById(params.userId);
        let isFaculty = false;
        if (!user) {
            const faculty = await Faculty.findById(params.userId);
            user = faculty as any;
            isFaculty = true;
        }
        return { user, isFaculty };
    }

    async findUserByEmail(email: string) {
        const user = await User.findOne({ email });
        return user;
    }

    async findFacultyByEmail(email: string) {
        const faculty = await Faculty.findOne({ email });
        return faculty;
    }

    async saveUser(user: any) {
        return await user.save();
    }

    async changePassword(params: ChangePasswordRequestDTO) {
        let user = await User.findById(params.userId);
        if (!user) {
            const faculty = await Faculty.findById(params.userId);
            user = faculty as any;
        }
        return user;
    }

    async updateProfilePicture(params: UpdateProfilePictureRequestDTO) {
        let user = await User.findById(params.userId);
        if (!user) {
            const faculty = await Faculty.findById(params.userId);
            user = faculty as any;
        }
        return user;
    }
}