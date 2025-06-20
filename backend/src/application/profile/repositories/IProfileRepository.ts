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

export interface IProfileRepository {
    getProfile(params: GetProfileRequestDTO): Promise<ProfileResponseDTO>;
    updateProfile(params: UpdateProfileRequestDTO): Promise<UpdateProfileResponseDTO>;
    changePassword(params: ChangePasswordRequestDTO): Promise<ChangePasswordResponseDTO>;
    updateProfilePicture(params: UpdateProfilePictureRequestDTO): Promise<UpdateProfilePictureResponseDTO>;
}