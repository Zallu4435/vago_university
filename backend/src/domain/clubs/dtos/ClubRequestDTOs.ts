export interface GetClubsRequestDTO {
    page: number;
    limit: number;
    category?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }
  
  export interface GetClubByIdRequestDTO {
    id: string;
  }
  
  export interface CreateClubRequestDTO {
    name: string;
    type: string;
    createdBy: string;
    status?: string;
    description?: string;
    members?: string[];
    color?: string;
    icon?: string;
    nextMeeting?: string;
    about?: string;
    enteredMembers?: number;
    upcomingEvents?: { date: string; description: string }[];
  }
  
  export interface UpdateClubRequestDTO {
    id: string;
    name?: string;
    type?: string;
    createdBy?: string;
    status?: string;
    description?: string;
    members?: string[];
    color?: string;
    icon?: string;
    nextMeeting?: string;
    about?: string;
    enteredMembers?: number;
    upcomingEvents?: { date: string; description: string }[];
  }
  
  export interface DeleteClubRequestDTO {
    id: string;
  }