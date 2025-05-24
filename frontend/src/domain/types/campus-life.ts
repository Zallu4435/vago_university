// src/domain/types/campus-life.ts
export interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    organizer: string;
    timeframe: string;
    icon: string;
    color: string;
    description?: string;
    fullTime?: string;
    additionalInfo?: string;
    requirements?: string;
  }
  
  export interface Sport {
    id: string;
    title: string;
    type: 'VARSITY SPORTS' | 'INTRAMURAL SPORTS';
    teams: string;
    icon: string;
    color: string;
    division?: string;
    headCoach?: string;
    homeGames?: string;
    record?: string;
    upcomingGames?: {
      date: string;
      description: string;
    }[];
  }
  
  export interface Club {
    id: string;
    name: string;
    type: string;
    members: string;
    icon: string;
    color: string;
    status?: string;
    role: string;
    nextMeeting: string;
    about?: string;
    upcomingEvents?: {
      date: string;
      description: string;
    }[];
  }
  
  export interface CampusLifeResponse {
    events: Event[];
    sports: Sport[];
    clubs: Club[];
  }