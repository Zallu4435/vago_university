import { Message } from "./Message";

export interface ChatProps {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
  type: ChatType;
  name?: string;
  avatar?: string;
}

export enum ChatType {
  Direct = "direct",
  Group = "group"
}

export class Chat {
  private props: ChatProps;

  constructor(props: ChatProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get participants(): string[] {
    return this.props.participants;
  }

  get lastMessage(): Message | undefined {
    return this.props.lastMessage;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get type(): ChatType {
    return this.props.type;
  }

  get name(): string | undefined {
    return this.props.name;
  }

  get avatar(): string | undefined {
    return this.props.avatar;
  }

  updateLastMessage(message: Message): void {
    this.props.lastMessage = message;
    this.props.updatedAt = new Date();
  }
} 