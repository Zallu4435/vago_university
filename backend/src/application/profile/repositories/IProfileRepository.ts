import { GetProfileResult, ProfileUser, SaveableProfileUser } from "../../../domain/profile/entities/User";

export interface IProfileRepository {
    getProfile(userId: string): Promise<GetProfileResult>;
    updateProfile(userId: string): Promise<{ user: SaveableProfileUser; isFaculty: boolean }>;
    changePassword(userId: string): Promise<SaveableProfileUser>;
    updateProfilePicture(userId: string): Promise<SaveableProfileUser>;
    findUserByEmail(email: string): Promise<ProfileUser>;
    findFacultyByEmail(email: string): Promise<ProfileUser>;
    saveUser<T extends { save: () => Promise<T> }>(user: T): Promise<T>;
}