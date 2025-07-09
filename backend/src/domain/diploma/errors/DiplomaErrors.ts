// src/domain/diploma/errors/DiplomaErrors.ts

// A base class for all domain-specific errors
export class DomainError extends Error {
    constructor(message: string, public readonly name: string = "DomainError") {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
    }
}

// Specific Diploma Domain Errors
export class DiplomaNotFoundError extends DomainError {
    constructor(id?: string) {
        super(id ? `Diploma with ID "${id}" not found.` : "Diploma not found.", "DiplomaNotFoundError");
    }
}

export class DiplomaAlreadyExistsError extends DomainError {
    constructor(title: string) {
        super(`Diploma with title "${title}" already exists.`, "DiplomaAlreadyExistsError");
    }
}

export class InvalidDiplomaStatusError extends DomainError {
    constructor(status: string) {
        super(`Invalid diploma status: ${status}.`, "InvalidDiplomaStatusError");
    }
}

export class DiplomaEnrollmentError extends DomainError {
    constructor(message: string = "Error enrolling student in diploma.") {
        super(message, "DiplomaEnrollmentError");
    }
}

export class DiplomaUnenrollmentError extends DomainError {
    constructor(message: string = "Error unenrolling student from diploma.") {
        super(message, "DiplomaUnenrollmentError");
    }
} 