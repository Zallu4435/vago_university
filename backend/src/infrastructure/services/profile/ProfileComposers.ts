import { IProfileRepository } from '../../../application/profile/repositories/IProfileRepository';
import {
    GetProfileUseCase,
    UpdateProfileUseCase,
    ChangePasswordUseCase,
    UpdateProfilePictureUseCase,
} from '../../../application/profile/useCases/ProfileUseCases';
import { ProfileRepository } from '../../repositories/profile/ProfileRepository';
import { ProfileController } from '../../../presentation/http/profile/ProfileController';
import { IProfileController } from '../../../presentation/http/IHttp';

export function getProfileComposer(): IProfileController {
    const repository: IProfileRepository = new ProfileRepository();
    const getProfileUseCase = new GetProfileUseCase(repository);
    const updateProfileUseCase = new UpdateProfileUseCase(repository);
    const changePasswordUseCase = new ChangePasswordUseCase(repository);
    const updateProfilePictureUseCase = new UpdateProfilePictureUseCase(repository);
    return new ProfileController(
        getProfileUseCase,
        updateProfileUseCase,
        changePasswordUseCase,
        updateProfilePictureUseCase
    );
}