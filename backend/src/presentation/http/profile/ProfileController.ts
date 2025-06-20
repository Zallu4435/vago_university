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
    try {
      const userId = httpRequest.user?.id;
      if (!userId) {
        return this.httpErrors.error_401();
      }
      const dto: GetProfileRequestDTO = { userId };
      const response = await this.getProfileUseCase.execute(dto);
      if (!response.success) {
        return this.httpErrors.error_404();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async updateProfile(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = httpRequest.user?.id;
      if (!userId) {
        return this.httpErrors.error_401();
      }
      const { firstName, lastName, phone, email } = httpRequest.body || {};
      const dto: UpdateProfileRequestDTO = { userId, firstName, lastName, phone, email };
      const response = await this.updateProfileUseCase.execute(dto);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async changePassword(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = httpRequest.user?.id;
      if (!userId) {
        return this.httpErrors.error_401();
      }
      const { currentPassword, newPassword, confirmPassword } = httpRequest.body || {};
      const dto: ChangePasswordRequestDTO = { userId, currentPassword, newPassword, confirmPassword };
      const response = await this.changePasswordUseCase.execute(dto);
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch {
      return this.httpErrors.error_500();
    }
  }

  async updateProfilePicture(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userId = httpRequest.user?.id;
      const file = httpRequest.file;
      if (!userId) {
        return this.httpErrors.error_401();
      }
      if (!file) {
        return this.httpErrors.error_400();
      }
      const dto: UpdateProfilePictureRequestDTO = { userId, filePath: file.path };
      const response = await this.updateProfilePictureUseCase.execute(dto);
      if (!response.success || !('profilePicture' in response.data)) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200({ url: (response.data as any).profilePicture });
    } catch {
      return this.httpErrors.error_500();
    }
  }
}