export enum SubmissionStatus {
  Pending = 'pending',
  Reviewed = 'reviewed',
  NeedsCorrection = 'needs_correction'
}

export class Submission {
  constructor(
    public readonly _id: string,
    public readonly assignmentId: string,
    public readonly studentId: string,
    public readonly studentName: string,
    public readonly submittedDate: Date,
    public readonly status: SubmissionStatus,
    public readonly isLate: boolean,
    public readonly files: string[],
    public readonly marks?: number,
    public readonly feedback?: string
  ) {}

  static create(props: {
    _id: string;
    assignmentId: string;
    studentId: string;
    studentName: string;
    submittedDate: Date;
    status: SubmissionStatus;
    isLate: boolean;
    files: string[];
    marks?: number;
    feedback?: string;
  }): Submission {
    return new Submission(
      props._id,
      props.assignmentId,
      props.studentId,
      props.studentName,
      props.submittedDate,
      props.status,
      props.isLate,
      props.files,
      props.marks,
      props.feedback
    );
  }
} 