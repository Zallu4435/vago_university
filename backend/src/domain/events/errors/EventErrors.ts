// src/domain/events/errors/EventErrors.ts

// A base class for all domain-specific errors
export class DomainError extends Error {
    constructor(message: string, public readonly name: string = "DomainError") {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
    }
}

// Event-specific errors
export class InvalidEventIdError extends DomainError {
    constructor(id?: string) {
        super(id ? `Invalid event ID: ${id}` : "Invalid event ID.", "InvalidEventIdError");
    }
}

export class EventNotFoundError extends DomainError {
    constructor(id?: string) {
        super(id ? `Event with ID ${id} not found.` : "Event not found.", "EventNotFoundError");
    }
}

// Event Request-specific errors
export class InvalidEventRequestIdError extends DomainError {
    constructor(id?: string) {
        super(id ? `Invalid event request ID: ${id}` : "Invalid event request ID.", "InvalidEventRequestIdError");
    }
}

export class EventRequestNotFoundError extends DomainError {
    constructor(id?: string) {
        super(id ? `Event request with ID ${id} not found.` : "Event request not found.", "EventRequestNotFoundError");
    }
}

export class InvalidEventStatusError extends DomainError {
    constructor(status?: string) {
        super(status ? `Invalid event status: ${status}` : "Invalid event status.", "InvalidEventStatusError");
    }
}

export class AssociatedEventNotFoundError extends DomainError {
    constructor() {
        super("Associated event not found.", "AssociatedEventNotFoundError");
    }
} 