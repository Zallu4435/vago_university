export enum AuthErrorType {
  MissingRequiredFields = "All required fields must be provided!",
  UserAlreadyExists = "User with this email already exists!",
  InvalidCredentials = "Invalid email or password!",
  InvalidToken = "Invalid or expired token!",
  EmailNotFound = "Email not found!",
  InvalidOtp = "Invalid or expired OTP!",
  FacultyAlreadyExists = "Email already registered in faculty collection!",
  AdmissionExists = "User has already made an admission and cannot log in from register!",
}