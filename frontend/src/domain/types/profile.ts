export interface ProfileData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    profilePicture?: string;
  }
  
  export interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword?: string; // Optional, depending on backend requirements
  }