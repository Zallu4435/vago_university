export interface ProfileData {
    // Common fields for both user and faculty
    firstName?: string;
    lastName?: string;
    fullName?: string; // For faculty
    phone: string;
    email: string;
    profilePicture?: string;
    passwordChangedAt?: string;
    
    // ID fields
    studentId?: string;
    facultyId?: string;
    
    // Faculty-specific fields
    department?: string;
    qualification?: string;
    experience?: string;
    aboutMe?: string;
    cvUrl?: string;
    certificatesUrl?: string[];
}
  
export interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword?: string; // Optional, depending on backend requirements
}