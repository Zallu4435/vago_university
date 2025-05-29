// src/domain/types/club.ts
export interface Club {
    _id: string;
    name: string;
    type: string;
    members: string;
    icon: string;
    color: string;
    status: string;
    role: string;
    nextMeeting: string;
    about: string;
    createdBy: string;
    createdAt: string;
    upcomingEvents: { date: string; description: string }[];
}

export interface ClubRequest {
    _id: string;
    name: string;
    type: string;
    members: string;
    icon: string;
    color: string;
    role: string;
    nextMeeting: string;
    about: string;
    requestedBy: string;
    createdAt: string;
    status: string;
    rejectionReason: string;
    upcomingEvents: { date: string; description: string }[];
}

export interface ClubApiResponse {
    clubs: Club[];
    clubRequests: ClubRequest[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}