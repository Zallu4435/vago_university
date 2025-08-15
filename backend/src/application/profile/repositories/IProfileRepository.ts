import {
    GetProfileRequestDTO,
    UpdateProfileRequestDTO,
    ChangePasswordRequestDTO,
    UpdateProfilePictureRequestDTO,
} from "../../../domain/profile/dtos/ProfileRequestDTOs";

export interface IProfileRepository {
    getProfile(params: GetProfileRequestDTO);
    updateProfile(params: UpdateProfileRequestDTO);
    changePassword(params: ChangePasswordRequestDTO);
    updateProfilePicture(params: UpdateProfilePictureRequestDTO);
    findUserByEmail(email: string);
    findFacultyByEmail(email: string);
    saveUser(user);
}