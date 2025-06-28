export enum EnquiryErrorType {
  EnquiryNotFound = "Enquiry not found",
  InvalidEnquiryId = "Invalid enquiry ID",
  InvalidStatus = "Invalid status",
  EnquiryCreationFailed = "Failed to create enquiry",
  EnquiryUpdateFailed = "Failed to update enquiry",
  EnquiryDeletionFailed = "Failed to delete enquiry",
  InvalidEmail = "Invalid email format",
  NameRequired = "Name is required",
  EmailRequired = "Email is required",
  SubjectRequired = "Subject is required",
  MessageRequired = "Message is required",
  ReplyFailed = "Failed to send reply",
} 