import { IProfileRepository } from '../../../application/profile/repositories/IProfileRepository';
import {
    GetProfileUseCase,
    UpdateProfileUseCase,
    ChangePasswordUseCase,
    UpdateProfilePictureUseCase
} from '../../../application/profile/useCases/ProfileUseCases';
import {
    IGetProfileUseCase,
    IUpdateProfileUseCase,
    IChangePasswordUseCase,
    IUpdateProfilePictureUseCase,
} from '../../../application/profile/useCases/IProfileUseCases';
import { ProfileRepository } from '../../repositories/profile/ProfileRepository';
import { ProfileController } from '../../../presentation/http/profile/ProfileController';
import { IProfileController } from '../../../presentation/http/IHttp';

export function getProfileComposer(): IProfileController {
    const repository: IProfileRepository = new ProfileRepository();
    const getProfileUseCase: IGetProfileUseCase = new GetProfileUseCase(repository);
    const updateProfileUseCase: IUpdateProfileUseCase = new UpdateProfileUseCase(repository);
    const changePasswordUseCase: IChangePasswordUseCase = new ChangePasswordUseCase(repository);
    const updateProfilePictureUseCase: IUpdateProfilePictureUseCase = new UpdateProfilePictureUseCase(repository);
    return new ProfileController(
        getProfileUseCase,
        updateProfileUseCase,
        changePasswordUseCase,
        updateProfilePictureUseCase
    );
}