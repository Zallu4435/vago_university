import { AssignmentFile } from '../assignmenttypes';

export class Assignment {
  constructor(
    public readonly _id: string,
    public readonly title: string,
    public readonly subject: string,
    public readonly dueDate: Date,
    public readonly maxMarks: number,
    public readonly description: string,
    public readonly files: AssignmentFile[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly status: 'draft' | 'published' | 'closed',
    public readonly totalSubmissions: number,
    public readonly averageMarks?: number
  ) {}

  static create(props: {
    _id: string;
    title: string;
    subject: string;
    dueDate: Date;
    maxMarks: number;
    description: string;
    files: AssignmentFile[];
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'published' | 'closed';
    totalSubmissions: number;
    averageMarks?: number;
  }): Assignment {
    return new Assignment(
      props._id,
      props.title,
      props.subject,
      props.dueDate,
      props.maxMarks,
      props.description,
      props.files,
      props.createdAt,
      props.updatedAt,
      props.status,
      props.totalSubmissions,
      props.averageMarks
    );
  }
} 