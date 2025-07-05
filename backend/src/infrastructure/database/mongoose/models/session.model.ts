import mongoose, { Schema, Document } from 'mongoose';
import { VideoSessionStatus } from '../../../../domain/session/enums/VideoSessionStatus';

export interface Attendee {
    id: string;
    name: string;
}

export interface AttendanceInterval {
    joinedAt: Date;
    leftAt?: Date;
}

export interface AttendanceRecord {
    userId: string;
    intervals: AttendanceInterval[];
    status?: string;
}

export interface IVideoSession extends Document {
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
    attendeeList?: Attendee[];
    joinUrl?: string;
    attendance?: AttendanceRecord[];
    createdAt: Date;
    updatedAt: Date;
}

const AttendeeSchema = new Schema<Attendee>({
    id: { type: String, required: true },
    name: { type: String, required: true }
}, { _id: false });

const AttendanceIntervalSchema = new Schema<AttendanceInterval>({
    joinedAt: { type: Date, required: true },
    leftAt: { type: Date }
}, { _id: false });

const AttendanceRecordSchema = new Schema<AttendanceRecord>({
    userId: { type: String, required: true },
    intervals: { type: [AttendanceIntervalSchema], default: [] },
    status: { type: String },
}, { _id: false });

const VideoSessionSchema = new Schema<IVideoSession>({
    title: { type: String, required: true, trim: true },
    hostId: { type: String, },
    participants: { type: [String], default: [] },
    startTime: { type: Date, required: true },
    endTime: { type: Date, default: null },
    status: { type: String, enum: Object.values(VideoSessionStatus), default: VideoSessionStatus.Scheduled },
    description: { type: String, trim: true },
    instructor: { type: String, trim: true },
    course: { type: String, trim: true },
    duration: { type: Number },
    maxAttendees: { type: Number },
    tags: { type: [String], default: [] },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    isLive: { type: Boolean, default: false },
    hasRecording: { type: Boolean, default: false },
    recordingUrl: { type: String, trim: true },
    attendees: { type: Number, default: 0 },
    attendeeList: { type: [AttendeeSchema], default: [] },
    joinUrl: { type: String, trim: true },
    attendance: { type: [AttendanceRecordSchema], default: [] },
}, { timestamps: true });

export const VideoSessionModel = mongoose.model<IVideoSession>('VideoSession', VideoSessionSchema); 