import { DomainError } from '../../auth/errors/AuthErrors';

export class AdminAdmissionNotFoundError extends DomainError {
    constructor(message: string = "Admin admission not found.") {
        super(message, "AdminAdmissionNotFoundError");
    }
}

export class AdminAdmissionAlreadyProcessedError extends DomainError {
    constructor(message: string = "Admin admission already processed.") {
        super(message, "AdminAdmissionAlreadyProcessedError");
    }
}

export class AdminInvalidTokenError extends DomainError {
    constructor(message: string = "Invalid or expired token.") {
        super(message, "AdminInvalidTokenError");
    }
}

export class AdminTokenExpiredError extends DomainError {
    constructor(message: string = "Token has expired.") {
        super(message, "AdminTokenExpiredError");
    }
}

export class AdminRegisterUserNotFoundError extends DomainError {
    constructor(message: string = "Register user not found for admission.") {
        super(message, "AdminRegisterUserNotFoundError");
    }
}

export class AdminInvalidActionError extends DomainError {
    constructor(message: string = "Invalid action for admission confirmation.") {
        super(message, "AdminInvalidActionError");
    }
} 