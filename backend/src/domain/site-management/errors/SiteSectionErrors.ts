// src/domain/site-management/errors/SiteSectionErrors.ts

export class DomainError extends Error {
    constructor(message: string, public readonly name: string = "DomainError") {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
    }
}

export class InvalidSectionKeyError extends DomainError {
    constructor() {
        super("Section key is required!", "InvalidSectionKeyError");
    }
}

export class InvalidHighlightError extends DomainError {
    constructor() {
        super("Highlight must have a title and description!", "InvalidHighlightError");
    }
}

export class InvalidVagoNowError extends DomainError {
    constructor() {
        super("VAGO Now must have a title and content!", "InvalidVagoNowError");
    }
}

export class InvalidLeadershipError extends DomainError {
    constructor() {
        super("Leadership must have a name and position!", "InvalidLeadershipError");
    }
} 