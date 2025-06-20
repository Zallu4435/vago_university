export interface RegisterRequestDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  
  export interface LoginRequestDTO {
    email: string;
    password: string;
  }
  
  export interface RefreshTokenRequestDTO {
    token: string;
  }
  
  export interface LogoutRequestDTO {
    // No params needed
  }
  
  export interface RegisterFacultyRequestDTO {
    fullName: string;
    email: string;
    phone: string;
    department: string;
    qualification: string;
    experience: string;
    aboutMe: string;
    cvUrl?: string;
    certificatesUrl?: string[];
  }
  
  export interface SendEmailOtpRequestDTO {
    email: string;
  }
  
  export interface VerifyEmailOtpRequestDTO {
    email: string;
    otp: string;
  }
  
  export interface ResetPasswordRequestDTO {
    resetToken: string;
    newPassword: string;
  }