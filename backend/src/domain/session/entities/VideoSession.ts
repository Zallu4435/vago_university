import { VideoSessionStatus } from '../enums/VideoSessionStatus';

export interface Attendee {
    id: string;
    name: string;
}

export class VideoSession {
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
        public readonly joinUrl?: string
    ) {}
} 