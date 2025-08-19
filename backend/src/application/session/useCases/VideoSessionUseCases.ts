import { ISessionRepository } from '../repositories/ISessionRepository';
import { CreateVideoSessionRequestDTO, JoinVideoSessionRequestDTO, UpdateVideoSessionRequestDTO, DeleteVideoSessionRequestDTO } from '../../../domain/session/dtos/VideoSessionRequestDTOs';
import { CreateVideoSessionResponseDTO, JoinVideoSessionResponseDTO, VideoSessionResponseDTO, UpdateVideoSessionResponseDTO, UpdateVideoSessionStatusResponseDTO, DeleteVideoSessionResponseDTO, UserSessionResponseDTO, SessionListResponseDTO } from '../../../domain/session/dtos/VideoSessionResponseDTOs';
import { VideoSession } from '../../../domain/session/entities/VideoSession';
import { VideoSessionStatus } from '../../../domain/session/enums/VideoSessionStatus';
import { config } from '../../../config/config';

export interface ICreateVideoSessionUseCase {
    execute(params: CreateVideoSessionRequestDTO): Promise<CreateVideoSessionResponseDTO>;
}

export interface IJoinVideoSessionUseCase {
    execute(params: JoinVideoSessionRequestDTO): Promise<JoinVideoSessionResponseDTO>;
}

export interface IGetVideoSessionUseCase {
    execute(sessionId: string): Promise<VideoSessionResponseDTO | null>;
}

export interface IUpdateVideoSessionUseCase {
    execute(params: UpdateVideoSessionRequestDTO): Promise<UpdateVideoSessionResponseDTO | null>;
}

export interface IDeleteVideoSessionUseCase {
    execute(params: DeleteVideoSessionRequestDTO): Promise<DeleteVideoSessionResponseDTO>;
}

export interface IGetAllVideoSessionsUseCase {
    execute(params: { search?: string; status?: string; instructor?: string; course?: string }): Promise<SessionListResponseDTO[]>;
}

export interface IGetUserSessionsUseCase {
    execute(params: { search?: string; status?: string; instructor?: string; course?: string; userId?: string }): Promise<{ sessions: SessionListResponseDTO[], watchedCount: number }>;
}

export interface IUpdateVideoSessionStatusUseCase {
    execute(sessionId: string, status: VideoSessionStatus): Promise<UpdateVideoSessionStatusResponseDTO | null>;
}

export interface IGetSessionAttendanceUseCase {
    execute(sessionId: string, filters);
}

export interface IUpdateAttendanceStatusUseCase {
    execute(sessionId: string, userId: string, status: string, name: string): Promise<void>;
}

export interface IRecordAttendanceJoinUseCase {
    execute(sessionId: string, userId: string): Promise<void>;
}

export interface IRecordAttendanceLeaveUseCase {
    execute(sessionId: string, userId: string): Promise<void>;
}

export class CreateVideoSessionUseCase implements ICreateVideoSessionUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(params: CreateVideoSessionRequestDTO): Promise<CreateVideoSessionResponseDTO> {
        let startTime: Date;
        if (params.date && params.time) {
            startTime = new Date(`${params.date}T${params.time}:00.000Z`);
        } else if (params.startTime) {
            startTime = new Date(params.startTime);
        } else {
            throw new Error('startTime or (date and time) must be provided');
        }

        if (!params.hostId) {
            throw new Error('hostId is required');
        }

        const sessionData = {
            title: params.title,
            hostId: params.hostId,
            participants: [params.hostId],
            startTime: startTime,
            endTime: null,
            status: VideoSessionStatus.Scheduled,
            description: params.description,
            instructor: params.instructor,
            course: params.course,
            duration: params.duration,
            maxAttendees: params.maxAttendees,
            tags: params.tags,
            difficulty: params.difficulty,
            isLive: params.isLive,
            hasRecording: params.hasRecording,
            recordingUrl: params.recordingUrl,
            attendees: params.attendees,
            attendeeList: params.attendeeList
        };

        const created = await this.sessionRepository.create(sessionData);
        return { session: created as VideoSessionResponseDTO };
    }
}

export class JoinVideoSessionUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(params: JoinVideoSessionRequestDTO): Promise<JoinVideoSessionResponseDTO> {
        const session = await this.sessionRepository.getById(params.sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        
        if (session.status === VideoSessionStatus.Ended || session.status === VideoSessionStatus.Cancelled) {
            throw new Error('Cannot join session: Session has ended or been cancelled');
        }
        
        if (session.status !== VideoSessionStatus.Ongoing) {
            throw new Error('Cannot join session: Session is not live');
        }
        
        const joinedSession = await this.sessionRepository.join(params.sessionId, params.participantId);
        return { session: joinedSession as VideoSessionResponseDTO };
    }
}

export class GetVideoSessionUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(sessionId: string): Promise<VideoSessionResponseDTO | null> {
        const session = await this.sessionRepository.getById(sessionId);
        return session ? (session as VideoSessionResponseDTO) : null;
    }
}

export class UpdateVideoSessionUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(params: UpdateVideoSessionRequestDTO): Promise<UpdateVideoSessionResponseDTO | null> {
        let updateData = { ...params.data };
        if (updateData.status && typeof updateData.status === 'string') {
            if (Object.values(VideoSessionStatus).includes(updateData.status as VideoSessionStatus)) {
                updateData.status = updateData.status as VideoSessionStatus;
            } else {
                updateData.status = VideoSessionStatus[updateData.status] || undefined;
            }
        }
        if (updateData.date && updateData.time) {
            updateData.startTime = new Date(`${updateData.date}T${updateData.time}:00.000Z`);
            delete updateData.date;
            delete updateData.time;
        } else if (updateData.startTime && typeof updateData.startTime === 'string') {
            updateData.startTime = new Date(updateData.startTime);
        }
        if (updateData.endTime && typeof updateData.endTime === 'string') {
            updateData.endTime = new Date(updateData.endTime);
        }
        const session = await this.sessionRepository.update(params.sessionId, updateData as Partial<VideoSession>);
        return session ? { session: session as VideoSessionResponseDTO } : null;
    }
}

export class DeleteVideoSessionUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(params: DeleteVideoSessionRequestDTO): Promise<DeleteVideoSessionResponseDTO> {
        await this.sessionRepository.delete(params.sessionId);
        return { message: 'Session deleted successfully' };
    }
}

export class GetAllVideoSessionsUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(params: { search?: string; status?: string; instructor?: string; course?: string } = {}): Promise<SessionListResponseDTO[]> {
        const sessions = await this.sessionRepository.getAll(params);
        
        return sessions.map(session => ({
            id: session._id || session.id,
            title: session.title,
            instructor: session.instructor,
            course: session.course,
            status: session.status,
            attendees: session.attendees,
            maxAttendees: session.maxAttendees,
            startTime: session.startTime
        })) as SessionListResponseDTO[];
    }
}

export class GetUserSessionsUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(params: { search?: string; status?: string; instructor?: string; course?: string; userId?: string } = {}): Promise<{ sessions: SessionListResponseDTO[], watchedCount: number }> {
        const sessions = await this.sessionRepository.getUserSessions(params);
        const userId = params.userId;

        const watchedCount = sessions.filter(session =>
            (Array.isArray(session.participants) && session.participants.includes(userId)) ||
            (Array.isArray(session.attendance) && session.attendance.some(a => a.userId === userId))
        ).length;

        const sessionList = sessions.map(session => ({
            id: session._id || session.id,
            title: session.title,
            instructor: session.instructor,
            course: session.course,
            status: session.status,
            attendees: session.attendees,
            maxAttendees: session.maxAttendees,
            startTime: session.startTime,
            ...(session.status === 'Ongoing' && session.joinUrl ? { joinUrl: session.joinUrl } : {})
        })) as SessionListResponseDTO[];

        return { sessions: sessionList, watchedCount };
    }
}

export class UpdateVideoSessionStatusUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(sessionId: string, status: VideoSessionStatus): Promise<UpdateVideoSessionStatusResponseDTO | null> {
        const session = await this.sessionRepository.update(sessionId, { status });
        
        if (!session) {
            return null;
        }
        
        if (status === VideoSessionStatus.Ongoing && !session.joinUrl) {
            let sessionIdStr = session.id;
            if (!sessionIdStr && session._id) {
                sessionIdStr = session._id.toString();
            }
            if (sessionIdStr) {
                const joinUrl = `${config.frontendUrl}/faculty/video-conference/${sessionIdStr}`;
                session.joinUrl = joinUrl;
                await this.sessionRepository.update(sessionIdStr, { joinUrl });
            }
        }
        
        if (status === VideoSessionStatus.Ended && session.joinUrl) {
            session.joinUrl = undefined;
            await this.sessionRepository.update(sessionId, { joinUrl: undefined });
        }
        
        let message = '';
        switch (status) {
            case VideoSessionStatus.Ongoing:
                message = 'Session started successfully';
                break;
            case VideoSessionStatus.Ended:
                message = 'Session ended successfully';
                break;
            case VideoSessionStatus.Scheduled:
                message = 'Session scheduled successfully';
                break;
            case VideoSessionStatus.Cancelled:
                message = 'Session cancelled successfully';
                break;
            default:
                message = 'Session status updated successfully';
        }
        
        return {
            success: true,
            message,
            session: session as VideoSessionResponseDTO
        };
    }
}

export class GetSessionAttendanceUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(sessionId: string, filters = {}) {
        return this.sessionRepository.getSessionAttendance(sessionId, filters);
    }
}

export class UpdateAttendanceStatusUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(sessionId: string, userId: string, status: string, name: string): Promise<void> {
        await this.sessionRepository.updateAttendanceStatus(sessionId, userId, status, name);
    }
}

export class RecordAttendanceJoinUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(sessionId: string, userId: string): Promise<void> {
        await this.sessionRepository.recordAttendanceJoin(sessionId, userId);
    }
}

export class RecordAttendanceLeaveUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(sessionId: string, userId: string): Promise<void> {
        await this.sessionRepository.recordAttendanceLeave(sessionId, userId);
    }
} 