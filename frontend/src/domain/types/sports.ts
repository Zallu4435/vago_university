export interface Team {
    id: string;
    name: string;
    sportType: string;
    coach: string;
    playerCount: number;
    status: string;
    formedOn: string;
    logo: string;
  }
  
  export interface Event {
    id: string;
    title: string;
    sportType: string;
    teams: string[];
    dateTime: string;
    venue: string;
    status: string;
  }
  
  export interface TeamRequest {
    id: string;
    teamName: string;
    sportType: string;
    requestedBy: string;
    reason: string;
    requestedAt: string;
    status: string;
  }
  
  export interface PlayerRequest {
    id: string;
    studentName: string;
    studentId: string;
    team: string;
    sport: string;
    reason: string;
    requestedAt: string;
    status: string;
  }
  
  export interface SportsApiResponse {
    teams?: Team[];
    events?: Event[];
    teamRequests?: TeamRequest[];
    playerRequests?: PlayerRequest[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
  }