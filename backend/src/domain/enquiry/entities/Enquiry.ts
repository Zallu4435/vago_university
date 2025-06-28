import mongoose from "mongoose";

export enum EnquiryStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export interface EnquiryProps {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Enquiry {
  private id: string;
  private name: string;
  private email: string;
  private subject: string;
  private message: string;
  private status: EnquiryStatus;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: EnquiryProps) {
    this.id = props.id || new mongoose.Types.ObjectId().toString();
    this.name = props.name;
    this.email = props.email;
    this.subject = props.subject;
    this.message = props.message;
    this.status = props.status;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static create(props: EnquiryProps): Enquiry {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Name is required");
    }
    if (!props.email || props.email.trim().length === 0) {
      throw new Error("Email is required");
    }
    if (!props.subject || props.subject.trim().length === 0) {
      throw new Error("Subject is required");
    }
    if (!props.message || props.message.trim().length === 0) {
      throw new Error("Message is required");
    }

    return new Enquiry({
      ...props,
      status: props.status || EnquiryStatus.PENDING,
    });
  }

  // Getters
  getId(): string { return this.id; }
  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
  getSubject(): string { return this.subject; }
  getMessage(): string { return this.message; }
  getStatus(): EnquiryStatus { return this.status; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  // Methods
  updateStatus(status: EnquiryStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
} 