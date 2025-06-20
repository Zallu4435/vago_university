export enum AdmissionErrorType {
    MissingRequiredFields = "All required fields must be provided!",
    AdmissionNotFound = "Admission not found!",
    AdmissionAlreadyProcessed = "Admission already processed!",
    InvalidStatus = "Invalid admission status!",
    InvalidToken = "Invalid confirmation token!",
    TokenExpired = "Confirmation token has expired!",
    InvalidAction = "Invalid action!",
    RegisterUserNotFound = "Register user not found for this admission!",
  }