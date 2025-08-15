export class GetEnrollmentsRequest {
    constructor(
        public readonly page: number,
        public readonly limit: number,
        public readonly status?: string,
        public readonly specialization?: string,
        public readonly faculty?: string,
        public readonly term?: string,
        public readonly search?: string
    ) {
        if (page < 1) throw new Error('Page must be greater than 0');
        if (limit < 1) throw new Error('Limit must be greater than 0');
    }

    static create(params: {
        page: number;
        limit: number;
        status?: string;
        specialization?: string;
        faculty?: string;
        term?: string;
        search?: string;
    }): GetEnrollmentsRequest {
        return new GetEnrollmentsRequest(
            params.page,
            params.limit,
            params.status,
            params.specialization,
            params.faculty,
            params.term,
            params.search
        );
    }
}

export class ApproveEnrollmentRequest {
    constructor(
        public readonly enrollmentId: string
    ) {
        if (!enrollmentId) throw new Error('Enrollment ID is required');
    }

    static create(params: { enrollmentId: string }): ApproveEnrollmentRequest {
        return new ApproveEnrollmentRequest(params.enrollmentId);
    }
}

export class RejectEnrollmentRequest {
    constructor(
        public readonly enrollmentId: string
    ) {
        if (!enrollmentId) throw new Error('Enrollment ID is required');
    }

    static create(params: { enrollmentId: string }): RejectEnrollmentRequest {
        return new RejectEnrollmentRequest(params.enrollmentId);
    }
}

export class GetCourseRequestDetailsRequest {
    constructor(
        public readonly id: string
    ) {
        if (!id) throw new Error('Request ID is required');
    }

    static create(params: { id: string }): GetCourseRequestDetailsRequest {
        return new GetCourseRequestDetailsRequest(params.id);
    }
} 