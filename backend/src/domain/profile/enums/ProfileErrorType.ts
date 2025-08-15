export enum ProfileErrorType {
    MissingRequiredFields = "All required fields must be provided!",
    UserNotFound = "User not found!",
    EmailAlreadyInUse = "Email already in use!",
    IncorrectCurrentPassword = "Current password is incorrect!",
    PasswordsDoNotMatch = "New password and confirmation do not match!",
    ProfilePictureRequired = "Profile picture file is required!",
    UserNotAuthenticated = "User not authenticated!",
  }