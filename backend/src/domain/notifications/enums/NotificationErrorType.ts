export enum NotificationErrorType {
    MissingRequiredFields = "All required fields must be provided!",
    InvalidRecipientType = "Invalid recipient type!",
    InvalidRecipientId = "Valid recipientId is required for individual notifications!",
    InvalidNotificationId = "Invalid notification ID!",
    NotificationNotFound = "Notification not found!",
    UnauthorizedAccess = "Unauthorized access to notification!",
    UserNotAuthenticated = "User authentication required!",
    NoFCMTokensFound = "No FCM tokens found for the specified recipient type!",
    InvalidStatus = "Invalid notification status!",
}