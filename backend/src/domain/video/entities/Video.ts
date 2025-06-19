import { VideoStatus } from '../enums/VideoStatus';

interface DiplomaInfo {
    id: string;
    title: string;
    category: string;
}

export class Video {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly duration: string,
        public readonly uploadedAt: Date,
        public readonly module: number,
        public readonly status: VideoStatus,
        public readonly diplomaId: string,
        public readonly description: string,
        public readonly videoUrl: string,
        public readonly diploma?: DiplomaInfo
    ) {}

    static create(params: {
        title: string;
        duration: string;
        module: number;
        status: VideoStatus;
        diplomaId: string;
        description: string;
    }): Video {
        return new Video(
            new Date().getTime().toString(),
            params.title,
            params.duration,
            new Date(),
            params.module,
            params.status,
            params.diplomaId,
            params.description,
            ''
        );
    }
} 