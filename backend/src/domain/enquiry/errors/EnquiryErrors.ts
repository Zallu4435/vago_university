// src/domain/enquiry/errors/EnquiryErrors.ts

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

// Specific Enquiry Domain Errors
export class EnquiryNotFoundError extends DomainError {
    constructor(id?: string) {
        super(id ? `Enquiry with ID "${id}" not found.` : "Enquiry not found.", "EnquiryNotFoundError");
    }
}

export class InvalidEnquiryIdError extends DomainError {
    constructor(id?: string) {
        super(id ? `Invalid enquiry ID: "${id}".` : "Invalid enquiry ID.", "InvalidEnquiryIdError");
    }
}

export class InvalidEnquiryStatusError extends DomainError {
    constructor(status?: string) {
        super(status ? `Invalid enquiry status: "${status}".` : "Invalid enquiry status.", "InvalidEnquiryStatusError");
    }
}

export class EnquiryCreationFailedError extends DomainError {
    constructor(message: string = "Failed to create enquiry.") {
        super(message, "EnquiryCreationFailedError");
    }
}

export class EnquiryUpdateFailedError extends DomainError {
    constructor(message: string = "Failed to update enquiry.") {
        super(message, "EnquiryUpdateFailedError");
    }
}

export class EnquiryDeletionFailedError extends DomainError {
    constructor(message: string = "Failed to delete enquiry.") {
        super(message, "EnquiryDeletionFailedError");
    }
}

export class InvalidEmailError extends DomainError {
    constructor(email?: string) {
        super(email ? `Invalid email format: "${email}".` : "Invalid email format.", "InvalidEmailError");
    }
}

export class EnquiryValidationError extends DomainError {
    constructor(field: string, message: string) {
        super(`Validation error for ${field}: ${message}`, "EnquiryValidationError");
    }
}

export class EnquiryReplyFailedError extends DomainError {
    constructor(message: string = "Failed to send enquiry reply.") {
        super(message, "EnquiryReplyFailedError");
    }
}

export class EnquirySearchFailedError extends DomainError {
    constructor(message: string = "Failed to search enquiries.") {
        super(message, "EnquirySearchFailedError");
    }
}

export class EnquiryPermissionError extends DomainError {
    constructor(message: string = "You don't have permission to perform this action on this enquiry.") {
        super(message, "EnquiryPermissionError");
    }
}

export class EnquiryLimitExceededError extends DomainError {
    constructor(limit: number) {
        super(`Enquiry limit exceeded. Maximum allowed: ${limit}`, "EnquiryLimitExceededError");
    }
} 