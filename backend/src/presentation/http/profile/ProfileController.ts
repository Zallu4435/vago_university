import {
  IGetProfileUseCase,
  IUpdateProfileUseCase,
  IChangePasswordUseCase,
  IUpdateProfilePictureUseCase,
} from '../../../application/profile/useCases/ProfileUseCases';
import {
  GetProfileRequestDTO,
  UpdateProfileRequestDTO,
  ChangePasswordRequestDTO,
  UpdateProfilePictureRequestDTO,
} from '../../../domain/profile/dtos/ProfileRequestDTOs';
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IProfileController } from '../IHttp';

export class ProfileController implements IProfileController {
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor(
    private getProfileUseCase: IGetProfileUseCase,
    private updateProfileUseCase: IUpdateProfileUseCase,
    private changePasswordUseCase: IChangePasswordUseCase,
    private updateProfilePictureUseCase: IUpdateProfilePictureUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async getProfile(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const userId = httpRequest.user?.id;
    if (!userId) {
      return this.httpErrors.error_401();
    }
    const dto: GetProfileRequestDTO = { userId };
    const response = await this.getProfileUseCase.execute(dto);
    if (!response.success) {
      const errorMessage = (response.data as any)?.error || 'Profile not found';
      return this.httpErrors.error_400(errorMessage);
    }
    return this.httpSuccess.success_200(response.data);
  }

  async updateProfile(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const userId = httpRequest.user?.id;
    if (!userId) {
      return this.httpErrors.error_401();
    }
    const { firstName, lastName, phone, email } = httpRequest.body || {};
    const dto: UpdateProfileRequestDTO = { userId, firstName, lastName, phone, email };
    const response = await this.updateProfileUseCase.execute(dto);
    if (!response.success) {
      const errorMessage = (response.data as any)?.error || 'Failed to update profile';
      return this.httpErrors.error_400(errorMessage);
    }
    return this.httpSuccess.success_200(response.data);
  }

  async changePassword(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const userId = httpRequest.user?.id;
    if (!userId) {
      return this.httpErrors.error_401();
    }
    const { currentPassword, newPassword, confirmPassword } = httpRequest.body || {};
    const dto: ChangePasswordRequestDTO = { userId, currentPassword, newPassword, confirmPassword };
    const response = await this.changePasswordUseCase.execute(dto);
    if (!response.success) {
      const errorMessage = (response.data as any)?.error || 'Failed to change password';
      return this.httpErrors.error_400(errorMessage);
    }
    return this.httpSuccess.success_200(response.data);
  }

  async updateProfilePicture(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const userId = httpRequest.user?.id;
    const file = httpRequest.file;
    if (!userId) {
      return this.httpErrors.error_401();
    }
    if (!file) {
      return this.httpErrors.error_400('Profile picture file is required');
    }
    const dto: UpdateProfilePictureRequestDTO = { userId, filePath: file.path };
    const response = await this.updateProfilePictureUseCase.execute(dto);
    if (!response.success || !('profilePicture' in response.data)) {
      const errorMessage = (response.data as any)?.error || 'Failed to update profile picture';
      return this.httpErrors.error_400(errorMessage);
    }
    return this.httpSuccess.success_200({ url: (response.data as any).profilePicture });
  }
}