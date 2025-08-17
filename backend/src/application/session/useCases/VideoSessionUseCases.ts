import { ISessionRepository } from '../repositories/ISessionRepository';
import { CreateVideoSessionRequestDTO, JoinVideoSessionRequestDTO, UpdateVideoSessionRequestDTO, DeleteVideoSessionRequestDTO } from '../../../domain/session/dtos/VideoSessionRequestDTOs';
import { CreateVideoSessionResponseDTO, JoinVideoSessionResponseDTO, VideoSessionResponseDTO, UpdateVideoSessionResponseDTO, DeleteVideoSessionResponseDTO, UserSessionResponseDTO } from '../../../domain/session/dtos/VideoSessionResponseDTOs';
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
    execute(params: { search?: string; status?: string; instructor?: string; course?: string }): Promise<VideoSessionResponseDTO[]>;
}

export interface IGetUserSessionsUseCase {
    execute(params: { search?: string; status?: string; instructor?: string; course?: string; userId?: string }): Promise<UserSessionResponseDTO[]>;
}

export interface IUpdateVideoSessionStatusUseCase {
    execute(sessionId: string, status: VideoSessionStatus): Promise<UpdateVideoSessionResponseDTO | null>;
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

        const session = new VideoSession(
            '',
            params.title,
            params.hostId,
            [params.hostId],
            startTime,
            null,
            VideoSessionStatus.Scheduled,
            params.description,
            params.instructor,
            params.course,
            params.duration,
            params.maxAttendees,
            params.tags,
            params.difficulty,
            params.isLive,
            params.hasRecording,
            params.recordingUrl,
            params.attendees,
            params.attendeeList
        );
        const created = await this.sessionRepository.create(session);
        if (created && created.id) {
            const joinUrl = `${config.backendUrl}/api/video-sessions/${created.id}/join`;
            created.joinUrl = joinUrl;
        }
        return { session: created as VideoSessionResponseDTO };
    }
}

export class JoinVideoSessionUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(params: JoinVideoSessionRequestDTO): Promise<JoinVideoSessionResponseDTO> {
        const session = await this.sessionRepository.join(params.sessionId, params.participantId);
        return { session: session as VideoSessionResponseDTO };
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

        if (session && !session.joinUrl) {
            let sessionId = session.id;
            if (!sessionId && session._id) {
                sessionId = session._id.toString();
            }
            if (sessionId) {
                const joinUrl = `${config.backendUrl}/api/video-sessions/${sessionId}/join`;
                session.joinUrl = joinUrl;
                await this.sessionRepository.update(sessionId, { joinUrl });
            } else {
                console.log('Session is missing both id and _id:', session);
            }
        } else {
            console.log('Session already has joinUrl:', session?.joinUrl);
        }
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
    async execute(params: { search?: string; status?: string; instructor?: string; course?: string } = {}): Promise<VideoSessionResponseDTO[]> {

        console.log(params," sodsohdsd")
        const sessions = await this.sessionRepository.getAll(params);
        return sessions as VideoSessionResponseDTO[];
    }
}

export class GetUserSessionsUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(params: { search?: string; status?: string; instructor?: string; course?: string; userId?: string } = {}): Promise<UserSessionResponseDTO[]> {
        const sessions = await this.sessionRepository.getUserSessions(params);
        
        // Map to lightweight user DTO with enrollment status
        return sessions.map(session => {
            const isEnrolled = params.userId ? session.participants.includes(params.userId) : false;
            const userAttendance = params.userId ? session.attendance?.find(a => a.userId === params.userId) : null;
            
            return {
                id: session._id || session.id,
                title: session.title,
                status: session.status,
                description: session.description,
                instructor: session.instructor,
                course: session.course,
                duration: session.duration,
                tags: session.tags,
                difficulty: session.difficulty,
                hasRecording: session.hasRecording,
                startTime: session.startTime,
                joinUrl: session.joinUrl,
                isLive: session.isLive,
                isEnrolled,
                userAttendanceStatus: userAttendance?.status || 'not-attended'
            };
        }) as UserSessionResponseDTO[];
    }
}

export class UpdateVideoSessionStatusUseCase {
    constructor(private sessionRepository: ISessionRepository) {}
    async execute(sessionId: string, status: VideoSessionStatus): Promise<UpdateVideoSessionResponseDTO | null> {
        const session = await this.sessionRepository.update(sessionId, { status });
        return session ? { session: session as VideoSessionResponseDTO } : null;
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