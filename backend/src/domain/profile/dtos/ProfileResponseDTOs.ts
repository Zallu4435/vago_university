export interface ProfileResponseDTO {
    firstName: string;
    lastName?: string;
    phone?: string;
    email: string;
    profilePicture?: string;
    studentId?: string;
    facultyId?: string;
    passwordChangedAt?: string;
  }
  
  export interface UpdateProfileResponseDTO {
    firstName: string;
    lastName?: string;
    phone?: string;
    email: string;
  }
  
  export interface ChangePasswordResponseDTO {
    message: string;
  }
  
  export interface UpdateProfilePictureResponseDTO {
    profilePicture: string;
  }