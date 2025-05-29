// src/domain/types/event.ts
export interface Event {
    id: string;
    name: string;
    organizer: string;
    organizerType: string;
    type: string;
    date: string;
    time: string;
    venue: string;
    status: string;
    description: string;
    maxParticipants: number;
    registrationRequired: boolean;
    participants: number;
    createdAt: string;
  }
  
  export interface EventRequest {
    id: string;
    eventName: string;
    requestedBy: string;
    requesterType: string;
    type: string;
    proposedDate: string;
    proposedVenue: string;
    status: string;
    requestedAt: string;
    description: string;
    expectedParticipants: number;
  }
  
  
  export interface EventApiResponse {
    events: Event[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
  }