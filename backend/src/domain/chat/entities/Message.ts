export interface MessageProps {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  reactions: MessageReaction[];
  createdAt: Date;
  updatedAt: Date;
  attachments?: MessageAttachment[];
}

export enum MessageType {
  Text = "text",
  Image = "image",
  File = "file",
  System = "system"
}

export enum MessageStatus {
  Sent = "sent",
  Delivered = "delivered",
  Read = "read",
  Failed = "failed"
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface MessageAttachment {
  type: MessageType;
  url: string;
  name: string;
  size: number;
}

export class Message {
  private props: MessageProps;

  constructor(props: MessageProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get chatId(): string {
    return this.props.chatId;
  }

  get senderId(): string {
    return this.props.senderId;
  }

  get content(): string {
    return this.props.content;
  }

  get type(): MessageType {
    return this.props.type;
  }

  get status(): MessageStatus {
    return this.props.status;
  }

  get reactions(): MessageReaction[] {
    return this.props.reactions;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get attachments(): MessageAttachment[] | undefined {
    return this.props.attachments;
  }

  updateStatus(status: MessageStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  addReaction(userId: string, emoji: string): void {
    const existingReaction = this.props.reactions.find(r => r.userId === userId);
    if (existingReaction) {
      existingReaction.emoji = emoji;
      existingReaction.createdAt = new Date();
    } else {
      this.props.reactions.push({
        userId,
        emoji,
        createdAt: new Date()
      });
    }
    this.props.updatedAt = new Date();
  }

  removeReaction(userId: string): void {
    this.props.reactions = this.props.reactions.filter(r => r.userId !== userId);
    this.props.updatedAt = new Date();
  }
} 