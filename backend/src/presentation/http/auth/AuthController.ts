import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IAuthController } from '../../http/IHttp';
import {
  RegisterUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  LogoutUseCase,
  RegisterFacultyUseCase,
  SendEmailOtpUseCase,
  VerifyEmailOtpUseCase,
  ResetPasswordUseCase,
} from "../../../application/auth/useCases/AuthUseCases";
import { facultyUpload } from "../../../config/cloudinary.config";

export class AuthController implements IAuthController {
  private httpErrors: HttpErrors; 
  private httpSuccess: HttpSuccess;
  private uploadDocuments = facultyUpload.fields([
    { name: "cv", maxCount: 1 },
    { name: "certificates", maxCount: 5 },
  ]);

  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUseCase: LogoutUseCase,
    private registerFacultyUseCase: RegisterFacultyUseCase,
    private sendEmailOtpUseCase: SendEmailOtpUseCase,
    private verifyEmailOtpUseCase: VerifyEmailOtpUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async register(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { firstName, lastName, email, password } = httpRequest.body;
      if (!firstName || !lastName || !email || !password) {
        return this.httpErrors.error_400();
      }
      const response = await this.registerUseCase.execute({ firstName, lastName, email, password });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_201(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async login(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      if (!email || !password) {
        return this.httpErrors.error_400();
      }
      const response = await this.loginUseCase.execute({ email, password });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async refreshToken(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { token } = httpRequest.body;
      if (!token) {
        return this.httpErrors.error_400();
      }
      const response = await this.refreshTokenUseCase.execute({ token });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async logout(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const response = await this.logoutUseCase.execute({});
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async registerFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { fullName, email, phone, department, qualification, experience, aboutMe } = httpRequest.body;
      if (!fullName || !email || !phone || !department || !qualification || !experience || !aboutMe) {
        return this.httpErrors.error_400();
      }
      const files = httpRequest.files as (Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] });
      let cvUrl: string | undefined;
      let certificatesUrl: string[] | undefined;
      if (files && !Array.isArray(files) && files.cv && files.cv.length > 0) {
        cvUrl = files.cv[0].path;
      }
      if (files && !Array.isArray(files) && files.certificates && files.certificates.length > 0) {
        certificatesUrl = files.certificates.map((file) => file.path);
      }
      const response = await this.registerFacultyUseCase.execute({
        fullName,
        email,
        phone,
        department,
        qualification,
        experience,
        aboutMe,
        cvUrl,
        certificatesUrl,
      });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_201(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async sendEmailOtp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { email } = httpRequest.body;
      if (!email) {
        return this.httpErrors.error_400();
      }
      const response = await this.sendEmailOtpUseCase.execute({ email });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }

  async verifyEmailOtp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { email, otp } = httpRequest.body;
      if (!email || !otp) {
        return this.httpErrors.error_400();
      }
      const response = await this.verifyEmailOtpUseCase.execute({ email, otp });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_400();
    }
  }

  async resetPassword(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { resetToken, newPassword } = httpRequest.body;
      if (!resetToken || !newPassword) {
        return this.httpErrors.error_400();
      }
      const response = await this.resetPasswordUseCase.execute({ resetToken, newPassword });
      if (!response.success) {
        return this.httpErrors.error_400();
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }
}