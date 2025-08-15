import { CourseErrorType } from "../enums/CourseErrorType";
import { EnrollmentProps, EnrollmentStatus } from "./coursetypes";

export class Enrollment {
  private idValue?: string;
  private studentIdValue: string;
  private courseIdValue: string;
  private statusValue: EnrollmentStatus;
  private requestedAtValue: Date;
  private reasonValue: string;

  constructor(props: EnrollmentProps) {
    this.idValue = props.id;
    this.studentIdValue = props.studentId;
    this.courseIdValue = props.courseId;
    this.statusValue = props.status;
    this.requestedAtValue = props.requestedAt || new Date();
    this.reasonValue = props.reason || "";
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

  get id(): string | undefined { return this.idValue; }
  get studentId(): string { return this.studentIdValue; }
  get courseId(): string { return this.courseIdValue; }
  get status(): EnrollmentStatus { return this.statusValue; }
  get requestedAt(): Date { return this.requestedAtValue; }
  get reason(): string { return this.reasonValue; }
}