// src/domain/notifications/errors/NotificationErrors.ts

// A base class for all domain-specific errors
export class DomainError extends Error {
    constructor(message: string, public readonly name: string = "DomainError") {
        super(message);
        // This line is needed to correctly restore the prototype chain.
        // It is specific to TypeScript/ES6 and how it extends built-in classes.
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name; // Set the name property for better error identification
    }
}

// Specific Notification Domain Errors
export class NotificationNotFoundError extends DomainError {
    constructor(notificationId: string) {
        super(`Notification with ID "${notificationId}" not found.`, "NotificationNotFoundError");
    }
}

export class InvalidNotificationIdError extends DomainError {
    constructor() {
        super("Invalid notification ID provided.", "InvalidNotificationIdError");
    }
}

export class InvalidRecipientIdError extends DomainError {
    constructor(recipientId: string) {
        super(`Invalid recipient ID "${recipientId}" provided.`, "InvalidRecipientIdError");
    }
}

export class NotificationCreationFailedError extends DomainError {
    constructor(message: string = "Failed to create notification.") {
        super(message, "NotificationCreationFailedError");
    }
}

export class NotificationUpdateFailedError extends DomainError {
    constructor(notificationId: string) {
        super(`Failed to update notification with ID "${notificationId}".`, "NotificationUpdateFailedError");
    }
}

export class NotificationDeleteFailedError extends DomainError {
    constructor(notificationId: string) {
        super(`Failed to delete notification with ID "${notificationId}".`, "NotificationDeleteFailedError");
    }
}

export class NotificationReplyFailedError extends DomainError {
    constructor(message: string = "Failed to reply to notification.") {
        super(message, "NotificationReplyFailedError");
    }
}

export class InvalidRecipientTypeError extends DomainError {
    constructor(recipientType: string) {
        super(`Invalid recipient type "${recipientType}" provided.`, "InvalidRecipientTypeError");
    }
}

export class FCMNotificationFailedError extends DomainError {
    constructor(message: string = "Failed to send FCM notification.") {
        super(message, "FCMNotificationFailedError");
    }
}

export class UnauthorizedNotificationAccessError extends DomainError {
    constructor(notificationId: string, userId: string) {
        super(`User "${userId}" is not authorized to access notification "${notificationId}".`, "UnauthorizedNotificationAccessError");
    }
} 