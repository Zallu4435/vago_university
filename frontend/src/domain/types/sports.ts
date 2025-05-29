export interface Team {
    _id: string;
    title: string;
    type: string;
    headCoach: string;
    playerCount: number;
    status: string;
    createdAt: string;
    logo: string;
    category: string;
    organizer: string;
    organizerType: string;
    icon: string;
    color: string;
    division: string;
    homeGames: number;
    record: string;
    upcomingGames: { date: string; description: string }[];
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
    _id: string;
    teamName: string;
    requestedBy: string;
    type: string;
    requestedDate: string;
    status: string;
  }
  
  export interface SportsApiResponse {
    teams: Team[];
    events?: Event[];
    teamRequests?: TeamRequest[];
    playerRequests?: PlayerRequest[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
  }