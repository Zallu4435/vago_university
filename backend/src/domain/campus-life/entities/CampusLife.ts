export enum EventStatus {
    Upcoming = 'upcoming',
    Past = 'past',
  }
  
  export enum SportType {
    Varsity = 'VARSITY SPORTS',
    Intramural = 'INTRAMURAL SPORTS',
  }
  
  export enum ClubStatus {
    Active = 'active',
    Inactive = 'inactive',
  }
  
  export enum RequestStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
  }
  
  export class CampusEvent {
    constructor(
      public id: string,
      public title: string,
      public date: string,
      public time: string,
      public location: string,
      public organizer: string,
      public timeframe: string,
      public icon: string,
      public color: string,
      public description: string,
      public fullTime: string,
      public additionalInfo: string,
      public requirements: string,
      public createdAt: string,
      public updatedAt: string
    ) {}
  }
  
  export class Sport {
    constructor(
      public id: string,
      public title: string,
      public type: SportType,
      public teams: string[],
      public icon: string,
      public color: string,
      public division: string,
      public headCoach: string,
      public homeGames: string[],
      public record: string,
      public upcomingGames: string[],
      public createdAt: string,
      public updatedAt: string
    ) {}
  }
  
  export class Club {
    constructor(
      public id: string,
      public name: string,
      public type: string,
      public members: number,
      public icon: string,
      public color: string,
      public status: ClubStatus,
      public role: string,
      public nextMeeting: string,
      public about: string,
      public upcomingEvents: string[],
      public createdAt: string,
      public updatedAt: string
    ) {}
  }
  
  export class JoinRequest {
    constructor(
      public id: string,
      public userId: string,
      public status: RequestStatus,
      public whyJoin: string,
      public additionalInfo: string,
      public createdAt: string,
      public updatedAt: string
    ) {}
  }