// presentation/http/auth/AuthController.ts (Updated: No try-catch, simplified response handling)
import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, IAuthController } from '../../http/IHttp';
import {
  IRegisterUseCase, // Use the interfaces
  ILoginUseCase,
  IRefreshTokenUseCase,
  ILogoutUseCase,
  IRegisterFacultyUseCase,
  ISendEmailOtpUseCase,
  IVerifyEmailOtpUseCase,
  IResetPasswordUseCase,
  IConfirmRegistrationUseCase,
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
    private registerUseCase: IRegisterUseCase, // Use interfaces in constructor type hints
    private loginUseCase: ILoginUseCase,
    private refreshTokenUseCase: IRefreshTokenUseCase,
    private logoutUseCase: ILogoutUseCase,
    private registerFacultyUseCase: IRegisterFacultyUseCase,
    private sendEmailOtpUseCase: ISendEmailOtpUseCase,
    private verifyEmailOtpUseCase: IVerifyEmailOtpUseCase,
    private resetPasswordUseCase: IResetPasswordUseCase,
    private confirmRegistrationUseCase: IConfirmRegistrationUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async register(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { firstName, lastName, email, password } = httpRequest.body;
    if (!firstName || !lastName || !email || !password) {
      return this.httpErrors.error_400("All required fields must be provided!");
    }
    // Direct call, Use Case will throw error on failure
    const data = await this.registerUseCase.execute({ firstName, lastName, email, password });
    return this.httpSuccess.success_201(data);
  }

  async login(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    console.log('👉 Login attempt');
    const { email, password } = httpRequest.body;
    if (!email || !password) {
      return this.httpErrors.error_400("Email and password are required");
    }

    // Get tokens from login use case
    const data = await this.loginUseCase.execute({ email, password });
    console.log('✅ Login successful, setting tokens in cookies');
    
    // Create response with user data (excluding tokens)
    const response = this.httpSuccess.success_200({
      user: data.user,
      collection: data.collection
    });

    // Set both tokens as cookies
    response.cookies = [
      {
        name: 'refresh_token',
        value: data.refreshToken,
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }
      },
      {
        name: 'access_token',
        value: data.accessToken,
        options: {
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 3 * 60 * 60 * 1000 // 3 hours
        }
      }
    ];

    console.log('🔐 Tokens set in cookies with durations:');
    console.log('   Access Token: 3 hours');
    console.log('   Refresh Token: 7 days');

    return response;
  }

  async refreshToken(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    console.log('👉 Token refresh attempt');
    
    // Get refresh token from httpOnly cookie
    const refreshToken = httpRequest.cookies?.refresh_token;
    
    if (!refreshToken) {
      console.log('❌ No refresh token found in cookies');
      return this.httpErrors.error_401("No refresh token provided");
    }

    console.log('✅ Refresh token found in cookies, validating...');
    
    // Get new access token only
    const data = await this.refreshTokenUseCase.execute({ refreshToken });
    
    // Create response
    const response = this.httpSuccess.success_200({
      user: data.user,
      collection: data.collection
    });

    console.log('✅ Token refresh successful, setting new access token');

    // Set new access token cookie only
    response.cookies = [
      {
        name: 'access_token',
        value: data.accessToken,
        options: {
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 3 * 60 * 60 * 1000 // 3 hours
        }
      }
    ];

    console.log('🔐 New access token set with duration:');
    console.log('   Access Token: 3 hours');

    return response;
  }

  async logout(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    console.log('👉 Logout attempt');
    
    // Clear both token cookies
    const response = this.httpSuccess.success_200({ message: "Logged out successfully" });
    response.cookies = [
      {
        name: 'refresh_token',
        value: '',
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 0
        }
      },
      {
        name: 'access_token',
        value: '',
        options: {
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 0
        }
      }
    ];

    console.log('✅ All tokens cleared from cookies');
    return response;
  }

  async registerFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    console.log('=== CONTROLLER: FACULTY REGISTRATION START ===');
    console.log('Request body:', httpRequest.body);
    console.log('Request files:', httpRequest.files);

    const { fullName, email, phone, department, qualification, experience, aboutMe } = httpRequest.body;

    if (!fullName || !email || !phone || !department || !qualification || !experience || !aboutMe) {
      console.log('ERROR: Missing required fields');
      return this.httpErrors.error_400("All required fields must be provided!");
    }

    const files = httpRequest.files as Express.Multer.File[];
    let cvUrl: string | undefined;
    let certificatesUrl: string[] = [];

    console.log('Files structure:', files);
    console.log('Files type:', typeof files);
    console.log('Files is array:', Array.isArray(files));

    if (Array.isArray(files)) {
      for (const file of files) {
        if (file.fieldname === 'cv') {
          cvUrl = file.path;
          console.log('CV file found:', file.path);
        } else if (file.fieldname === 'certificates') {
          certificatesUrl.push(file.path);
          console.log('Certificate file found:', file.path);
        }
      }
    } else {
      console.log('No files uploaded or invalid file structure');
    }

    console.log('Processed data:', {
      fullName,
      email,
      phone,
      department,
      qualification,
      experience,
      aboutMe,
      cvUrl,
      certificatesUrl
    });

    try {
      const data = await this.registerFacultyUseCase.execute({
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
      console.log('=== CONTROLLER: FACULTY REGISTRATION SUCCESS ===');
      return this.httpSuccess.success_201(data);
    } catch (err) {
      console.error('=== CONTROLLER: FACULTY REGISTRATION ERROR ===', err);
      throw err;
    }
  }

  async sendEmailOtp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { email } = httpRequest.body;
    if (!email) {
      return this.httpErrors.error_400("Email is required");
    }
    // Direct call, Use Case will throw error on failure
    const data = await this.sendEmailOtpUseCase.execute({ email });
    return this.httpSuccess.success_200(data);
  }

  async verifyEmailOtp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { email, otp } = httpRequest.body;
    if (!email || !otp) {
      return this.httpErrors.error_400("Email and OTP are required");
    }
    // Direct call, Use Case will throw error on failure
    const data = await this.verifyEmailOtpUseCase.execute({ email, otp });
    return this.httpSuccess.success_200(data);
  }

  async resetPassword(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { resetToken, newPassword } = httpRequest.body;
    if (!resetToken || !newPassword) {
      return this.httpErrors.error_400("Reset token and new password are required");
    }
    // Direct call, Use Case will throw error on failure
    const data = await this.resetPasswordUseCase.execute({ resetToken, newPassword });
    return this.httpSuccess.success_200(data);
  }

  async confirmRegistration(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const token = httpRequest.body.token || httpRequest.query.token;
    if (!token) {
      return this.httpErrors.error_400("Confirmation token is required");
    }
    // Direct call, Use Case will throw error on failure
    const data = await this.confirmRegistrationUseCase.execute(token);
    return this.httpSuccess.success_200(data);
  }
}