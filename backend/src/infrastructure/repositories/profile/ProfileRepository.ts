import { User } from "../../database/mongoose/auth/user.model";
import { Faculty } from "../../database/mongoose/auth/faculty.model";
import { IProfileRepository } from "../../../application/profile/repositories/IProfileRepository";

export class ProfileRepository implements IProfileRepository {
    async getProfile(userId: string) {
        let user = await User.findById(userId).select("firstName lastName email phone profilePicture passwordChangedAt");
        let isFaculty = false;
        if (!user) {
            const faculty = await Faculty.findById(userId).select("firstName lastName email phone profilePicture passwordChangedAt");
            user = faculty;
            isFaculty = true;
        }
        return { user, isFaculty };
    } 

    async updateProfile(userId: string) {
        let user = await User.findById(userId);
        let isFaculty = false;
        if (!user) {
            const faculty = await Faculty.findById(userId);
            user = faculty;
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

    async saveUser(user) {
        return await user.save();
    }

    async changePassword(userId: string) {
        let user = await User.findById(userId);
        if (!user) {
            const faculty = await Faculty.findById(userId);
            user = faculty;
        }
        return user;
    }

    async updateProfilePicture(userId: string) {
        let user = await User.findById(userId);
        if (!user) {
            const faculty = await Faculty.findById(userId);
            user = faculty;
        }
        return user;
    }
}