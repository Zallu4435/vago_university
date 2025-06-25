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
  ConfirmRegistrationUseCase,
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
    private resetPasswordUseCase: ResetPasswordUseCase,
    private confirmRegistrationUseCase: ConfirmRegistrationUseCase
  ) {
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async register(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { firstName, lastName, email, password } = httpRequest.body;
      if (!firstName || !lastName || !email || !password) {
        return this.httpErrors.error_400("All required fields must be provided!");
      }
      const response = await this.registerUseCase.execute({ firstName, lastName, email, password });
      if (!response.success) {
        return this.httpErrors.error_400((response.data as any)?.error || "Registration failed");
      }
      return this.httpSuccess.success_201(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500(error.message, error.stack);
    }
  }

  async login(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      if (!email || !password) {
        return this.httpErrors.error_400("Email and password are required");
      }
      const response = await this.loginUseCase.execute({ email, password });
      if (!response.success) {
        return this.httpErrors.error_400((response.data as any)?.error || "Login failed");
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500(error.message, error.stack);
    }
  }

  async refreshToken(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { token } = httpRequest.body;
      if (!token) {
        return this.httpErrors.error_400("Token is required");
      }
      const response = await this.refreshTokenUseCase.execute({ token });
      if (!response.success) {
        return this.httpErrors.error_400((response.data as any)?.error || "Invalid token");
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500(error.message, error.stack);
    }
  }

  async logout(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const response = await this.logoutUseCase.execute({});
      if (!response.success) {
        return this.httpErrors.error_400((response.data as any)?.error || "Logout failed");
      }
      return this.httpSuccess.success_200(response.data);
    } catch (error: any) {
      return this.httpErrors.error_500(error.message, error.stack);
    }
  }

  async registerFaculty(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('=== FACULTY REGISTRATION START ===');
      console.log('Request body:', httpRequest.body);
      console.log('Request files:', httpRequest.files);
      
      const { fullName, email, phone, department, qualification, experience, aboutMe } = httpRequest.body;
      
      if (!fullName || !email || !phone || !department || !qualification || !experience || !aboutMe) {
        console.log('ERROR: Missing required fields');
        return this.httpErrors.error_400("All required fields must be provided!");
      }
      
      const files = httpRequest.files as Express.Multer.File[];
      let cvUrl: string | undefined;
      let certificatesUrl: string[] | undefined;
      
      console.log('Files structure:', files);
      console.log('Files type:', typeof files);
      console.log('Files is array:', Array.isArray(files));
      
      if (files && Array.isArray(files)) {
        // Handle CV file upload
        const cvFile = files.find(file => file.fieldname === 'cv');
        if (cvFile) {
          console.log('CV file uploaded:', {
            originalname: cvFile.originalname,
            mimetype: cvFile.mimetype,
            size: cvFile.size,
            path: cvFile.path
          });
          cvUrl = cvFile.path; // This is the Cloudinary URL
        } else {
          console.log('No CV file found');
        }
        
        // Handle certificates files upload
        const certificateFiles = files.filter(file => file.fieldname === 'certificates');
        if (certificateFiles.length > 0) {
          console.log('Certificates uploaded:', certificateFiles.length, 'files');
          certificatesUrl = certificateFiles.map((file, index) => {
            console.log(`Certificate ${index + 1}:`, {
              originalname: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              path: file.path
            });
            return file.path; // This is the Cloudinary URL
          });
        } else {
          console.log('No certificates found');
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
        console.log('ERROR: Use case failed');
        return this.httpErrors.error_400((response.data as any)?.error || "Faculty registration failed");
      }
      
      console.log('=== FACULTY REGISTRATION SUCCESS ===');
      return this.httpSuccess.success_201(response.data);
    } catch (error: any) {
      console.log('=== FACULTY REGISTRATION ERROR ===');
      console.error('Controller error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return this.httpErrors.error_500(error.message, error.stack);
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

  async confirmRegistration(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const token = httpRequest.body.token || httpRequest.query.token;
      if (!token) {
        return this.httpErrors.error_400();
      }
      const result = await this.confirmRegistrationUseCase.execute(token);
      return this.httpSuccess.success_200(result);
    } catch (error: any) {
      return this.httpErrors.error_400();
    }
  }
}