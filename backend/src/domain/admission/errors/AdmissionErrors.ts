// src/domain/admission/errors/AdmissionErrors.ts

import { DomainError } from '../../auth/errors/AuthErrors'; // Assuming your base DomainError is here

export class ApplicationNotFoundException extends DomainError {
    constructor(message: string = "Application not found.") {
        super(message, "ApplicationNotFoundException");
    }
}

export class InvalidApplicationIdException extends DomainError {
    constructor(message: string = "Invalid application ID.") {
        super(message, "InvalidApplicationIdException");
    }
}

export class InvalidUserIdException extends DomainError {
    constructor(message: string = "Invalid user ID.") {
        super(message, "InvalidUserIdException");
    }
}

export class InvalidSectionException extends DomainError {
    constructor(message: string = "Invalid application section provided.") {
        super(message, "InvalidSectionException");
    }
}

export class PaymentProcessingFailedException extends DomainError {
    constructor(message: string = "Payment processing failed.") {
        super(message, "PaymentProcessingFailedException");
    }
}

export class PaymentNotFoundException extends DomainError {
    constructor(message: string = "Payment record not found.") {
        super(message, "PaymentNotFoundException");
    }
}

export class PaymentMismatchException extends DomainError {
    constructor(message: string = "Payment does not match the application user.") {
        super(message, "PaymentMismatchException");
    }
}

export class DocumentUploadFailedException extends DomainError {
    constructor(message: string = "Document upload failed.") {
        super(message, "DocumentUploadFailedException");
    }
}

export class AdmissionFinalizationFailedException extends DomainError {
    constructor(message: string = "Admission finalization failed.") {
        super(message, "AdmissionFinalizationFailedException");
    }
}

export class DocumentNotFoundException extends DomainError { // Added for serveDocument
    constructor(message: string = "Document not found.") {
        super(message, "DocumentNotFoundException");
    }
}

export class UnauthorizedDocumentAccessException extends DomainError { // Added for serveDocument
    constructor(message: string = "Unauthorized access to document.") {
        super(message, "UnauthorizedDocumentAccessException");
    }
}