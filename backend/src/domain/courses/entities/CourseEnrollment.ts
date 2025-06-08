import { CourseErrorType } from "../enums/CourseErrorType";

export enum EnrollmentStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

interface EnrollmentProps {
  id?: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  requestedAt?: Date;
  reason?: string;
}

export class Enrollment {
  private id?: string;
  private studentId: string;
  private courseId: string;
  private status: EnrollmentStatus;
  private requestedAt: Date;
  private reason: string;

  constructor(props: EnrollmentProps) {
    this.id = props.id;
    this.studentId = props.studentId;
    this.courseId = props.courseId;
    this.status = props.status;
    this.requestedAt = props.requestedAt || new Date();
    this.reason = props.reason || "";
  }

  static create(props: EnrollmentProps): Enrollment {
    if (!props.studentId) {
      throw new Error(CourseErrorType.InvalidStudentId);
    }
    if (!props.courseId) {
      throw new Error(CourseErrorType.InvalidCourseId);
    }
    return new Enrollment(props);
  }

  get id(): string | undefined { return this.id; }
  get studentId(): string { return this.studentId; }
  get courseId(): string { return this.courseId; }
  get status(): EnrollmentStatus { return this.status; }
  get requestedAt(): Date { return this.requestedAt; }
  get reason(): string { return this.reason; }
}