export enum UserRole {
  Admin = 'admin',
  Student = 'student',
  Faculty = 'faculty',
  Staff = 'staff'
}

export enum MessageStatus {
  Unread = 'unread',
  Read = 'read',
  Delivered = 'delivered',
  Opened = 'opened'
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: MessageStatus;
}

export interface Attachment {
  filename: string;
  path: string;
  contentType: string;
  size: number;
}

export class Message {
  constructor(
    public readonly _id: string,
    public readonly subject: string,
    public readonly content: string,
    public readonly sender: UserInfo,
    public readonly recipients: UserInfo[],
    public readonly isBroadcast: boolean,
    public readonly attachments: Attachment[],
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  static create(
    subject: string,
    content: string,
    sender: UserInfo,
    recipients: UserInfo[],
    isBroadcast: boolean,
    attachments: Attachment[] = []
  ): Message {
    const now = new Date().toISOString();
    return new Message(
      crypto.randomUUID(),
      subject,
      content,
      sender,
      recipients,
      isBroadcast,
      attachments,
      now,
      now
    );
  }

  markAsRead(userId: string): void {
    const recipient = this.recipients.find(r => r._id === userId);
    if (recipient) {
      recipient.status = MessageStatus.Read;
    }
  }

  isRecipient(userId: string): boolean {
    return this.recipients.some(r => r._id === userId);
  }

  isSender(userId: string): boolean {
    return this.sender._id === userId;
  }

  canAccess(userId: string): boolean {
    return this.isSender(userId) || this.isRecipient(userId);
  }
}