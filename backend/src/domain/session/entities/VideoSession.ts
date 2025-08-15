import { VideoSessionStatus } from '../enums/VideoSessionStatus';

export interface Attendee {
    id: string;
    name: string;
}

export class VideoSession {
    _id?: string;
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly hostId: string,
        public readonly participants: string[],
        public readonly startTime: Date,
        public readonly endTime: Date | null,
        public readonly status: VideoSessionStatus,
        public readonly description?: string,
        public readonly instructor?: string,
        public readonly course?: string,
        public readonly duration?: number,
        public readonly maxAttendees?: number,
        public readonly tags?: string[],
        public readonly difficulty?: 'beginner' | 'intermediate' | 'advanced',
        public readonly isLive?: boolean,
        public readonly hasRecording?: boolean,
        public readonly recordingUrl?: string,
        public readonly attendees?: number,
        public readonly attendeeList?: Attendee[],
        public joinUrl?: string
    ) { }
}

export interface VideoSessionFilter {
    search?: string;
    decision?: string;
    attendanceLevel?: string;
    startDate?: string | Date;
    endDate?: string | Date;
}

export interface PaymentFilter {
    userId?: string;
    status?: string;
    paymentMethod?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    minAmount?: number;
    maxAmount?: number;
    search?: string;
    currency?: string;
    instructor?: string;
    course?: string;
    $or?: Array<{
        title?: { $regex: string; $options: string };
        instructor?: { $regex: string; $options: string };
        course?: { $regex: string; $options: string };
    }>;
    [key: string]: unknown;
}
