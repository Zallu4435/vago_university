// src/domain/materials/errors/MaterialErrors.ts

// A base class for all domain-specific errors
export class DomainError extends Error {
    constructor(message: string, public readonly name: string = "DomainError") {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
    }
}

// Specific Material Domain Errors
export class MaterialNotFoundError extends DomainError {
    constructor(id: string) {
        super(`Material with ID "${id}" not found.`, "MaterialNotFoundError");
    }
}

export class MaterialValidationError extends DomainError {
    constructor(message: string) {
        super(`Material validation error: ${message}`, "MaterialValidationError");
    }
}

export class MaterialAlreadyExistsError extends DomainError {
    constructor(title: string) {
        super(`Material with title "${title}" already exists.`, "MaterialAlreadyExistsError");
    }
}

export class MaterialPermissionError extends DomainError {
    constructor(message: string = 'You do not have permission to perform this action on the material.') {
        super(message, "MaterialPermissionError");
    }
} 