import { VideoErrorType } from '../enums/VideoErrorType';

export class DomainError extends Error {
    constructor(message: string, public readonly name: string = "DomainError") {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
    }
}

export class InvalidVideoIdError extends DomainError {
    constructor() {
        super(VideoErrorType.InvalidVideoId, 'InvalidVideoIdError');
    }
}

export class VideoNotFoundError extends DomainError {
    constructor() {
        super(VideoErrorType.VideoNotFound, 'VideoNotFoundError');
    }
}

export class InvalidModuleNumberError extends DomainError {
    constructor() {
        super(VideoErrorType.InvalidModuleNumber, 'InvalidModuleNumberError');
    }
}

export class InvalidStatusError extends DomainError {
    constructor() {
        super(VideoErrorType.InvalidStatus, 'InvalidStatusError');
    }
}

export class InvalidDurationError extends DomainError {
    constructor() {
        super(VideoErrorType.InvalidDuration, 'InvalidDurationError');
    }
}

export class InvalidDiplomaIdError extends DomainError {
    constructor() {
        super(VideoErrorType.InvalidDiplomaId, 'InvalidDiplomaIdError');
    }
} 