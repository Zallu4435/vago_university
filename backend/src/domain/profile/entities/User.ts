import mongoose from "mongoose";
import { ProfileErrorType } from "../enums/ProfileErrorType";

export interface UserProps {
  _id?: mongoose.Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password?: string;
  profilePicture?: string;
}

export class User {
  private _id?: mongoose.Types.ObjectId;
  private _firstName: string;
  private _lastName?: string;
  private _email: string;
  private _phone?: string;
  private _password?: string;
  private _profilePicture?: string;

  constructor(props: UserProps) {
    this._id = props._id;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._phone = props.phone;
    this._password = props.password;
    this._profilePicture = props.profilePicture;
  }

  static create(props: UserProps): User {
    if (!props.firstName || !props.email) {
      throw new Error(ProfileErrorType.MissingRequiredFields);
    }
    return new User(props);
  }

  get id(): mongoose.Types.ObjectId | undefined { return this._id; }
  get firstName(): string { return this._firstName; }
  get lastName(): string | undefined { return this._lastName; }
  get email(): string { return this._email; }
  get phone(): string | undefined { return this._phone; }
  get password(): string | undefined { return this._password; }
  get profilePicture(): string | undefined { return this._profilePicture; }

  updateProfile(firstName: string, lastName?: string, phone?: string, email?: string): void {
    if (!firstName || !email) {
      throw new Error(ProfileErrorType.MissingRequiredFields);
    }
    this._firstName = firstName;
    this._lastName = lastName;
    this._phone = phone;
    this._email = email;
  }

  updatePassword(password: string): void {
    if (!password) {
      throw new Error(ProfileErrorType.MissingRequiredFields);
    }
    this._password = password;
  }

  updateProfilePicture(profilePicture: string): void {
    this._profilePicture = profilePicture;
  }
}

export type ProfileUser = {
  _id: unknown;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  passwordChangedAt?: Date;
} | null;

export type GetProfileResult = {
  user: ProfileUser;
  isFaculty: boolean;
};

export type SaveableProfileUser = ({
  _id: unknown;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  passwordChangedAt?: Date;
  password?: string;
  save: () => Promise<SaveableProfileUser>;
} | null);