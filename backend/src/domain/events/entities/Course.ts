export interface CourseProps {
  title: string;
  code: string;
  description: string;
  credits: number;
  capacity: number;
  facultyId: string;
  semester: string;
  academicYear: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export class Course {
  private props: CourseProps;
  private id?: string;

  private constructor(props: CourseProps, id?: string) {
    this.props = props;
    this.id = id;
  }

  public static create(props: CourseProps, id?: string): Course {
    return new Course(props, id);
  }

  get title(): string {
    return this.props.title;
  }

  get code(): string {
    return this.props.code;
  }

  get description(): string {
    return this.props.description;
  }

  get credits(): number {
    return this.props.credits;
  }

  get capacity(): number {
    return this.props.capacity;
  }

  get facultyId(): string {
    return this.props.facultyId;
  }

  get semester(): string {
    return this.props.semester;
  }

  get academicYear(): string {
    return this.props.academicYear;
  }

  get status(): 'ACTIVE' | 'INACTIVE' {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public update(props: Partial<CourseProps>): void {
    this.props = {
      ...this.props,
      ...props,
      updatedAt: new Date()
    };
  }
} 