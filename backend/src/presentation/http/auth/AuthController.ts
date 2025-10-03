import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IAuthController } from '../../http/IHttp';
import {
  IRegisterUseCase,
  ILoginUseCase,
  IRefreshTokenUseCase,
  ILogoutUseCase,
  IRegisterFacultyUseCase,
  ISendEmailOtpUseCase,
  IVerifyEmailOtpUseCase,
  IResetPasswordUseCase,
  IConfirmRegistrationUseCase
} from "../../../application/auth/useCases/IAuthUseCases";
import { LogoutAllUseCase } from "../../../application/auth/useCases/AuthUseCases";
import { AuthRepository } from '../../../infrastructure/repositories/auth/AuthRepository';
import { facultyUpload } from "../../../config/cloudinary.config";

export class AuthController implements IAuthController {
  private _httpErrors: HttpErrors;
  private _httpSuccess: HttpSuccess;
  private _uploadDocuments = facultyUpload.fields([
    { name: "cv", maxCount: 1 },
    { name: "certificates", maxCount: 5 },
  ]);

  constructor(
    private _registerUseCase: IRegisterUseCase,
    private _loginUseCase: ILoginUseCase,
    private _refreshTokenUseCase: IRefreshTokenUseCase,
    private _logoutUseCase: ILogoutUseCase,
    private _registerFacultyUseCase: IRegisterFacultyUseCase,
    private _sendEmailOtpUseCase: ISendEmailOtpUseCase,
    private _verifyEmailOtpUseCase: IVerifyEmailOtpUseCase,
    private _resetPasswordUseCase: IResetPasswordUseCase,
    private _confirmRegistrationUseCase: IConfirmRegistrationUseCase,
    private _logoutAllUseCase: LogoutAllUseCase,
    private _authRepository: AuthRepository,
  ) {
    this._httpErrors = new HttpErrors();
    this._httpSuccess = new HttpSuccess();
  }

  async register(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { firstName, lastName, email, password } = httpRequest.body;
    if (!firstName || !lastName || !email || !password) {
      return this._httpErrors.error_400("All required fields must be provided!");
    }
    const data = await this._registerUseCase.execute({ firstName, lastName, email, password });
    return this._httpSuccess.success_201(data);
  }

  async login(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { email, password } = httpRequest.body;
    if (!email || !password) {
      return this._httpErrors.error_400("Email and password are required");
    }
    const userAgent = (httpRequest.headers && httpRequest.headers['user-agent']) ? String(httpRequest.headers['user-agent']) : '';
    const ipAddress = httpRequest.ip || '';
    const data = await this._loginUseCase.execute({ email, password, userAgent, ipAddress });
    const response = this._httpSuccess.success_200({
      user: data.user,
      collection: data.collection,
      sessionId: data.sessionId,
    });
    response.cookies = [
      {
        name: 'access_token',
        value: data.accessToken,
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 10 * 60 * 1000 
        }
      }
    ];
    return response;
  }

  async refreshToken(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const userId = httpRequest.body?.userId;
    const allSessions = await this._authRepository.getAllSessions();
    if (!userId) {
      return this._httpErrors.error_400('No userId provided');
    }
    const session = await this._authRepository.findLatestSessionByUserId(userId);
    if (!session) {
      return this._httpErrors.error_401('No valid refresh session found');
    }
    const data = await this._refreshTokenUseCase.execute({ refreshToken: session.refreshToken });
    const response = this._httpSuccess.success_200({
      user: data.user,
      collection: data.collection,
    });
    response.cookies = [
      {
        name: 'access_token',
        value: data.accessToken,
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 10 * 60 * 1000 
        }
      }
    ];
    return response;
  }

  async logout(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const accessToken = httpRequest.cookies?.access_token;
    const response = this._httpSuccess.success_200({ message: 'Logged out successfully' });
    response.cookies = [
      { name: 'access_token', value: '', options: { httpOnly: true, path: '/', maxAge: 0 } }
    ];
    if (!accessToken) {
      return response;
    }
    let decoded;
    try {
      decoded = this._loginUseCase['jwtService'].verifyToken(accessToken);
    } catch (err) {
      return response;
    }
    const userId = decoded.userId;
    await this._authRepository.deleteAllSessionsByUserId(userId);
    return response;
  }

  async logoutAll(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const accessToken = httpRequest.cookies?.access_token;
    const response = this._httpSuccess.success_200({ message: 'Logged out from all devices' });
    response.cookies = [
      { name: 'access_token', value: '', options: { httpOnly: true, path: '/', maxAge: 0 } }
    ];
    
    if (!accessToken) {
      return response;
    }
    
    let decoded;
    try {
      decoded = this._loginUseCase['jwtService'].verifyToken(accessToken);
    } catch (err) {
      return response; // Return success even if token is invalid
    }
    
    const userId = decoded.userId;
    await this._logoutAllUseCase.execute({ userId });
    return response;
  }

  async registerFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { fullName, email, phone, department, qualification, experience, aboutMe } = httpRequest.body;

    if (!fullName || !email || !phone || !department || !qualification || !experience || !aboutMe) {
      return this._httpErrors.error_400("All required fields must be provided!");
    }

    const files = httpRequest.files as Express.Multer.File[];
    let cvUrl: string | undefined;
    let certificatesUrl: string[] = [];

    if (Array.isArray(files)) {
      for (const file of files) {
        if (file.fieldname === 'cv') {
          cvUrl = file.path;
        } else if (file.fieldname === 'certificates') {
          certificatesUrl.push(file.path);
        }
      }
    } else {
      console.error('No files uploaded or invalid file structure');
    }

    try {
      const data = await this._registerFacultyUseCase.execute({
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
      return this._httpSuccess.success_201(data);
    } catch (err) {
      if (err instanceof Error) {
        return this._httpErrors.error_400(err.message);
      }
      return this._httpErrors.error_500();
    }
  }

  async sendEmailOtp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { email } = httpRequest.body;
    if (!email) {
      return this._httpErrors.error_400("Email is required");
    }
    const data = await this._sendEmailOtpUseCase.execute({ email });
    return this._httpSuccess.success_200(data);
  }

  async verifyEmailOtp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { email, otp } = httpRequest.body;
    if (!email || !otp) {
      return this._httpErrors.error_400("Email and OTP are required");
    }
    const data = await this._verifyEmailOtpUseCase.execute({ email, otp });
    return this._httpSuccess.success_200(data);
  }

  async resetPassword(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { resetToken, newPassword } = httpRequest.body;
    if (!resetToken || !newPassword) {
      return this._httpErrors.error_400("Reset token and new password are required");
    }
    const data = await this._resetPasswordUseCase.execute({ resetToken, newPassword });
    return this._httpSuccess.success_200(data);
  }

  async confirmRegistration(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const token = httpRequest.body.token || httpRequest.query.token;
    if (!token) {
      return this._httpErrors.error_400("Confirmation token is required");
    }
    const data = await this._confirmRegistrationUseCase.execute(token);
    return this._httpSuccess.success_200(data);
  }

  async me(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this._httpErrors.error_401('Not authenticated');
    }
    return this._httpSuccess.success_200_flat({
      user: httpRequest.user,
      collection: httpRequest.user.collection,
    });
  }
}