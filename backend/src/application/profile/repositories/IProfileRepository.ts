import {
    GetProfileRequestDTO,
    UpdateProfileRequestDTO,
    ChangePasswordRequestDTO,
    UpdateProfilePictureRequestDTO,
} from "../../../domain/profile/dtos/ProfileRequestDTOs";

export interface IProfileRepository {
    getProfile(params: GetProfileRequestDTO): Promise<any>;
    updateProfile(params: UpdateProfileRequestDTO): Promise<any>;
    changePassword(params: ChangePasswordRequestDTO): Promise<any>;
    updateProfilePicture(params: UpdateProfilePictureRequestDTO): Promise<any>;
    findUserByEmail(email: string): Promise<any>;
    findFacultyByEmail(email: string): Promise<any>;
    saveUser(user: any): Promise<any>;
}