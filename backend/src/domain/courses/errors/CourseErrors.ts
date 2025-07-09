// src/domain/courses/errors/CourseErrors.ts

// A base class for all domain-specific errors
export class DomainError extends Error {
    constructor(message: string, public readonly name: string = "DomainError") {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
    }
}

// Specific Course Domain Errors
export class CourseNotFoundError extends DomainError {
    constructor(id?: string) {
        super(id ? `Course with ID "${id}" not found.` : "Course not found.", "CourseNotFoundError");
    }
}

export class EnrollmentNotFoundError extends DomainError {
    constructor(id?: string) {
        super(id ? `Enrollment with ID "${id}" not found.` : "Enrollment not found.", "EnrollmentNotFoundError");
    }
}

export class InvalidCourseIdError extends DomainError {
    constructor() {
        super("Invalid course ID.", "InvalidCourseIdError");
    }
}

export class InvalidEnrollmentIdError extends DomainError {
    constructor() {
        super("Invalid enrollment ID.", "InvalidEnrollmentIdError");
    }
}

export class CourseFullError extends DomainError {
    constructor() {
        super("Course has reached maximum enrollment.", "CourseFullError");
    }
}

export class EnrollmentNotPendingError extends DomainError {
    constructor() {
        super("Enrollment is not in pending status.", "EnrollmentNotPendingError");
    }
} 