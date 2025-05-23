// src/domain/types/club.ts
export interface Club {
    id: string;
    name: string;
    category: string;
    createdBy: string;
    createdDate: string;
    members: number;
    status: string;
    description?: string;
  }
  
  export interface ClubRequest {
    id: string;
    clubName: string;
    requestedBy: string;
    category: string;
    reason: string;
    requestedAt: string;
    status: string;
  }
  
  export interface MemberRequest {
    id: string;
    studentName: string;
    studentId: string;
    clubName: string;
    requestedAt: string;
    status: string;
  }
  
  export interface ClubApiResponse {
    clubs: (Club | ClubRequest | MemberRequest)[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
  }