import { VideoSessionStatus } from '../enums/VideoSessionStatus';

export interface VideoSessionResponseDTO {
    id: string;
    title: string;
    hostId: string;
    participants: string[];
    startTime: Date;
    endTime: Date | null;
    status: VideoSessionStatus;
    description?: string;
    instructor?: string;
    course?: string;
    duration?: number;
    maxAttendees?: number;
    tags?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    isLive?: boolean;
    hasRecording?: boolean;
    recordingUrl?: string;
    attendees?: number;
    attendeeList?: { id: string; name: string }[];
    joinUrl?: string;
}

// New DTO for user-facing session data (lightweight)
export interface UserSessionResponseDTO {
    id: string;
    title: string;
    status: VideoSessionStatus;
    description?: string;
    instructor?: string;
    course?: string;
    duration?: number;
    tags?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    hasRecording?: boolean;
    startTime: Date;
    joinUrl?: string;
    isLive?: boolean;
    isEnrolled?: boolean;
    userAttendanceStatus?: string;
}

export interface CreateVideoSessionResponseDTO {
    session: VideoSessionResponseDTO;
}

export interface JoinVideoSessionResponseDTO {
    session: VideoSessionResponseDTO;
}

export interface UpdateVideoSessionResponseDTO {
    session: VideoSessionResponseDTO;
}

export interface DeleteVideoSessionResponseDTO {
    message: string;
} 