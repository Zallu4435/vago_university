export enum EnrollmentStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
  }
  
  export enum DeliveryMethod {
    Electronic = 'electronic',
    Mail = 'mail',
  }
  
  export enum PreferredTime {
    Morning = 'morning',
    Afternoon = 'afternoon',
  }
  
  export class Student {
    constructor(
      public id: string,
      public firstName: string,
      public lastName: string,
      public email: string,
      public major: string,
      public catalogYear: string,
      public academicStanding: string,
      public advisor: string,
      public pendingCredits: number,
      public credits: number,
      public phone?: string,
      public profilePicture?: string
    ) {}
  }
  
  export class Grade {
    constructor(
      public id: string,
      public userId: string,
      public courseId: string,
      public cumulativeGPA: string,
      public termGPA: string,
      public course: string,
      public termName: string,
      public description: string,
      public creditsEarned: string,
      public creditsInProgress: string,
      public createdAt: string
    ) {}
  }
  
  export class Course {
    constructor(
      public id: string,
      public title: string,
      public specialization: string,
      public faculty: string,
      public credits: number,
      public term: string,
      public maxEnrollment: number,
      public currentEnrollment: number,
      public createdAt: string
    ) {}
  }
  
  export class AcademicHistory {
    constructor(
      public id: number,
      public userId: string,
      public term: string,
      public credits: string,
      public gpa: string,
      public courseId: string
    ) {}
  }
  
  export class Program {
    constructor(
      public id: string,
      public userId: string,
      public degree: string,
      public catalogYear: string,
      public createdAt: string
    ) {}
  }
  
  export class Progress {
    constructor(
      public id: string,
      public userId: string,
      public overallProgress: number,
      public totalCredits: number,
      public completedCredits: number,
      public remainingCredits: number,
      public estimatedGraduation: string,
      public createdAt: string
    ) {}
  }
  
  export class Requirement {
    constructor(
      public id: string,
      public userId: string,
      public core: { percentage: number; completed: number; total: number },
      public elective: { percentage: number; completed: number; total: number },
      public general: { percentage: number; completed: number; total: number },
      public createdAt: string
    ) {}
  }
  
  export class Enrollment {
    constructor(
      public id: string,
      public studentId: string,
      public courseId: string,
      public status: EnrollmentStatus,
      public requestedAt: string,
      public reason?: string
    ) {}
  }
  
  export class TranscriptRequest {
    constructor(
      public id: string,
      public userId: string,
      public deliveryMethod: string,
      public requestedAt: string,
      public estimatedDelivery: string,
      public address?: string,
      public email?: string
    ) {}
  }
  
  export class Meeting {
    constructor(
      public id: string,
      public userId: string,
      public date: string,
      public reason: string,
      public preferredTime?: string,
      public notes?: string,
      public meetingTime: string,
      public location: string,
      public createdAt: string
    ) {}
  }