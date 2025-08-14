// src/domain/types/club.ts
export interface Club {
    _id?: string;
    id?: string;
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
    _id?: string;
    requestedId?:string; 
    name: string;
    type: string;
    members: string;
    icon: string;
    color: string;
    role: string;
    nextMeeting: string;
    about: string;
    requestedBy: string;
    createdBy?: string;
    createdAt: string;
    status: string;
    rejectionReason: string;
    upcomingEvents: { date: string; description: string }[];
}

export interface ClubApiResponse {
    data: {
        clubs: Club[];
        clubRequests: ClubRequest[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    };
}

export interface ClubRequestsResponse {
    data: ClubRequest[];
    clubs: Club[];
    clubRequests: ClubRequest[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}

export interface ClubResponse {
    data: {
        club: Club;
    };
}

export interface ClubRequestsData {
    data: {
        club: ClubResponse;
    }
}

export interface ClubRequestResponse {
    data: {
        clubRequest: ClubRequest;
    };
}