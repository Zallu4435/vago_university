// src/domain/auth/errors/AuthErrors.ts

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

// Specific Domain Errors
export class UserAlreadyExistsError extends DomainError {
    constructor(email: string) {
        super(`User with email "${email}" already exists.`, "UserAlreadyExistsError");
    }
}

export class InvalidCredentialsError extends DomainError {
    constructor() {
        super("Invalid email or password.", "InvalidCredentialsError");
    }
}

export class EmailNotConfirmedError extends DomainError {
    constructor() {
        super("Your email has not been confirmed. Please check your inbox.", "EmailNotConfirmedError");
    }
}

export class AdmissionExistsError extends DomainError {
    constructor() {
        super("User has already made an admission and cannot log in from register.", "AdmissionExistsError");
    }
}

export class EmailNotFoundError extends DomainError {
    constructor(email?: string) {
        super(email ? `Email "${email}" not found.` : "Email not found.", "EmailNotFoundError");
    }
}

export class InvalidOtpError extends DomainError {
    constructor() {
        super("Invalid or expired OTP.", "InvalidOtpError");
    }
}

export class InvalidTokenError extends DomainError {
    constructor(message: string = "Invalid or expired token.") {
        super(message, "InvalidTokenError");
    }
}

export class FacultyAlreadyExistsError extends DomainError {
    constructor(email: string) {
        super(`Faculty with email "${email}" already exists.`, "FacultyAlreadyExistsError");
    }
}

export class UserNotFoundError extends DomainError {
    constructor(message: string = "User not found.") {
        super(message, "UserNotFoundError");
    }
}

export class AlreadyConfirmedError extends DomainError {
    constructor(message: string = "Account is already confirmed.") {
        super(message, "AlreadyConfirmedError");
    }
}