import { UserProps, FacultyProps } from "./AuthTypes";

export class User {
  private _id?: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _password: string;
  private _profilePicture?: string;
  private _blocked?: boolean;

  constructor(props: UserProps) {
    this._id = props.id;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._password = props.password;
    this._profilePicture = props.profilePicture;
    this._blocked = props.blocked;
  }

  static create(props: UserProps): User {
    if (!props.firstName || !props.lastName || !props.email || !props.password) {
      throw new Error('Missing required fields');
    }
    return new User(props);
  }

  get id(): string | undefined { return this._id; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get email(): string { return this._email; }
  get password(): string { return this._password; }
  get profilePicture(): string | undefined { return this._profilePicture; }
  get blocked(): boolean | undefined { return this._blocked; }
  set blocked(value: boolean | undefined) { this._blocked = value; }
}

export class Faculty {
  private _id?: string;
  private _fullName: string;
  private _email: string;
  private _phone: string;
  private _department: string;
  private _qualification: string;
  private _experience: string;
  private _aboutMe: string;
  private _cvUrl?: string;
  private _certificatesUrl?: string[];

  constructor(props: FacultyProps) {
    this._id = props.id;
    this._fullName = props.fullName;
    this._email = props.email;
    this._phone = props.phone;
    this._department = props.department;
    this._qualification = props.qualification;
    this._experience = props.experience;
    this._aboutMe = props.aboutMe;
    this._cvUrl = props.cvUrl;
    this._certificatesUrl = props.certificatesUrl;
  }

  static create(props: FacultyProps): Faculty {
    if (!props.fullName || !props.email || !props.phone || !props.department || !props.qualification || !props.experience || !props.aboutMe) {
      throw new Error('Missing required fields');
    }
    return new Faculty(props);
  }

  get id(): string | undefined { return this._id; }
  get fullName(): string { return this._fullName; }
  get email(): string { return this._email; }
  get phone(): string { return this._phone; }
  get department(): string { return this._department; }
  get qualification(): string { return this._qualification; }
  get experience(): string { return this._experience; }
  get aboutMe(): string { return this._aboutMe; }
  get cvUrl(): string | undefined { return this._cvUrl; }
  get certificatesUrl(): string[] | undefined { return this._certificatesUrl; }
}

export interface RegisterRequestProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class RegisterRequest {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _password: string;

  constructor(props: RegisterRequestProps) {
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._password = props.password;
  }

  static create(props: RegisterRequestProps): RegisterRequest {
    if (!props.firstName || !props.lastName || !props.email || !props.password) {
      throw new Error('Missing required fields for registration');
    }
    return new RegisterRequest(props);
  }

  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get email(): string { return this._email; }
  get password(): string { return this._password; }
}

export interface RegisterFacultyRequestProps {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  qualification: string;
  experience: string;
  aboutMe: string;
  cvUrl?: string;
  certificatesUrl?: string[];
}

export class RegisterFacultyRequest {
  private _fullName: string;
  private _email: string;
  private _phone: string;
  private _department: string;
  private _qualification: string;
  private _experience: string;
  private _aboutMe: string;
  private _cvUrl?: string;
  private _certificatesUrl?: string[];

  constructor(props: RegisterFacultyRequestProps) {
    this._fullName = props.fullName;
    this._email = props.email;
    this._phone = props.phone;
    this._department = props.department;
    this._qualification = props.qualification;
    this._experience = props.experience;
    this._aboutMe = props.aboutMe;
    this._cvUrl = props.cvUrl;
    this._certificatesUrl = props.certificatesUrl;
  }

  static create(props: RegisterFacultyRequestProps): RegisterFacultyRequest {
    if (!props.fullName || !props.email || !props.phone || !props.department || !props.qualification || !props.experience || !props.aboutMe) {
      throw new Error('Missing required fields for faculty registration');
    }
    return new RegisterFacultyRequest(props);
  }

  get fullName(): string { return this._fullName; }
  get email(): string { return this._email; }
  get phone(): string { return this._phone; }
  get department(): string { return this._department; }
  get qualification(): string { return this._qualification; }
  get experience(): string { return this._experience; }
  get aboutMe(): string { return this._aboutMe; }
  get cvUrl(): string | undefined { return this._cvUrl; }
  get certificatesUrl(): string[] | undefined { return this._certificatesUrl; }
}