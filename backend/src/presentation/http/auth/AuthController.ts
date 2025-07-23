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
  LogoutAllUseCase,
} from "../../../application/auth/useCases/AuthUseCases";
import { AuthRepository } from '../../../infrastructure/repositories/auth/AuthRepository';
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
    private confirmRegistrationUseCase: IConfirmRegistrationUseCase,
    private logoutAllUseCase: LogoutAllUseCase,
    private authRepository: AuthRepository, // Add repository to controller
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

    // Get user-agent and IP address
    const userAgent = (httpRequest.headers && httpRequest.headers['user-agent']) ? String(httpRequest.headers['user-agent']) : '';
    // Get IP address from httpRequest.ip (set by ExpressAdapter)
    const ipAddress = httpRequest.ip || '';
    console.log('Login IP Address:', ipAddress);

    // Get tokens from login use case
    console.log('Login User Agent:', httpRequest.headers);
    console.log('Login IP Address:', ipAddress);
    const data = await this.loginUseCase.execute({ email, password, userAgent, ipAddress });
    console.log('✅ Login successful, setting access and refresh tokens in httpOnly cookies');
    
    // Create response with user data and sessionId
    const response = this.httpSuccess.success_200({
      user: data.user,
      collection: data.collection,
      sessionId: data.sessionId,
    });

    // Set only the access token as httpOnly cookie (do NOT set refresh token)
    response.cookies = [
      {
        name: 'access_token',
        value: data.accessToken,
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 10 * 60 * 1000 // 10 minutes
        }
      }
    ];

    console.log('🔐 Access and Refresh Tokens set in httpOnly cookies');

    return response;
  }

  async refreshToken(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    console.log('👉 Token refresh attempt');
    // Get userId from request body
    const userId = httpRequest.body?.userId;
    console.log('refreshToken endpoint received userId:', userId);
    // Log all userIds with sessions in the database
    const allSessions = await this.authRepository.getAllSessions();
    console.log('All session userIds in DB:', allSessions.map(s => s.userId));
    if (!userId) {
      return this.httpErrors.error_400('No userId provided');
    }
    // Find the latest refresh session for this user
    const session = await this.authRepository.findLatestSessionByUserId(userId);
    if (!session) {
      return this.httpErrors.error_401('No valid refresh session found');
    }
    // Validate the refresh token in the session
    const data = await this.refreshTokenUseCase.execute({ refreshToken: session.refreshToken });
    // Create response
    const response = this.httpSuccess.success_200({
      user: data.user,
      collection: data.collection,
    });
    // Set only the access token as httpOnly cookie
    response.cookies = [
      {
        name: 'access_token',
        value: data.accessToken,
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 10 * 60 * 1000 // 10 minutes
        }
      }
    ];
    console.log('🔄 New access token set in cookies');
    return response;
  }

  async logout(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    console.log('👉 Logout attempt');
    const accessToken = httpRequest.cookies?.access_token;
    // Always clear cookies
    const response = this.httpSuccess.success_200({ message: 'Logged out successfully' });
    response.cookies = [
      { name: 'access_token', value: '', options: { httpOnly: true, path: '/', maxAge: 0 } }
    ];
    if (!accessToken) {
      // No access token, just return success
      return response;
    }
    // Decode access token to get userId
    let decoded: any;
    try {
      decoded = this.loginUseCase['jwtService'].verifyToken(accessToken);
    } catch (err) {
      // Invalid token, treat as already logged out
      return response;
    }
    const userId = decoded.userId;
    // Delete all refresh sessions for this user
    await this.authRepository.deleteAllSessionsByUserId(userId);
    return response;
  }

  async logoutAll(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    // Get access token from cookies
    const accessToken = httpRequest.cookies?.access_token;
    if (!accessToken) {
      return this.httpErrors.error_401('No access token provided');
    }
    // Decode access token to get userId
    let decoded: any;
    try {
      decoded = this.loginUseCase['jwtService'].verifyToken(accessToken);
    } catch (err) {
      return this.httpErrors.error_401('Invalid access token');
    }
    const userId = decoded.userId;
    await this.logoutAllUseCase.execute({ userId });
    // Clear cookies
    const response = this.httpSuccess.success_200({ message: 'Logged out from all devices' });
    response.cookies = [
      { name: 'access_token', value: '', options: { httpOnly: true, path: '/', maxAge: 0 } }
    ];
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

  async me(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.user) {
      return this.httpErrors.error_401('Not authenticated');
    }
      // Return user info and collection as a flat response
    return this.httpSuccess.success_200_flat({
      user: httpRequest.user,
      collection: httpRequest.user.collection,
    });
  }
}