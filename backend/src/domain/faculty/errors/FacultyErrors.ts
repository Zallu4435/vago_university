// src/domain/faculty/errors/FacultyErrors.ts
import { FacultyErrorType } from '../enums/FacultyErrorType';

export class DomainError extends Error {
    constructor(message: string, public readonly name: string = "DomainError") {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
    }
}

export class FacultyNotFoundError extends DomainError {
    constructor() {
        super(FacultyErrorType.FacultyNotFound, "FacultyNotFoundError");
    }
}

export class FacultyAlreadyProcessedError extends DomainError {
    constructor() {
        super(FacultyErrorType.FacultyAlreadyProcessed, "FacultyAlreadyProcessedError");
    }
}

export class InvalidFacultyIdError extends DomainError {
    constructor() {
        super(FacultyErrorType.InvalidFacultyId, "InvalidFacultyIdError");
    }
}

export class InvalidTokenError extends DomainError {
    constructor() {
        super(FacultyErrorType.InvalidToken, "InvalidTokenError");
    }
}

export class TokenExpiredError extends DomainError {
    constructor() {
        super(FacultyErrorType.TokenExpired, "TokenExpiredError");
    }
}

export class InvalidActionError extends DomainError {
    constructor() {
        super(FacultyErrorType.InvalidAction, "InvalidActionError");
    }
}

export class MissingRequiredFieldsError extends DomainError {
    constructor() {
        super(FacultyErrorType.MissingRequiredFields, "MissingRequiredFieldsError");
    }
}

export class InvalidCertificateUrlError extends DomainError {
    constructor() {
        super(FacultyErrorType.InvalidCertificateUrl, "InvalidCertificateUrlError");
    }
}

export class CertificateNotFoundError extends DomainError {
    constructor() {
        super(FacultyErrorType.CertificateNotFound, "CertificateNotFoundError");
    }
}

export class UnauthorizedAccessError extends DomainError {
    constructor() {
        super(FacultyErrorType.UnauthorizedAccess, "UnauthorizedAccessError");
    }
}

export class AuthenticationRequiredError extends DomainError {
    constructor() {
        super(FacultyErrorType.AuthenticationRequired, "AuthenticationRequiredError");
    }
}

export class InvalidDocumentTypeError extends DomainError {
    constructor() {
        super(FacultyErrorType.InvalidDocumentType, "InvalidDocumentTypeError");
    }
} 