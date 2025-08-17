export interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  firstName?: string;
  lastName?: string;
  isOnline?: boolean;
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'audio' | 'video' | 'file';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  createdAt: string;
  count: number;
}

export interface ReplyTo {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  type: 'text' | 'document' | 'image' | 'audio' | 'video' | 'file';
  createdAt: string;
}

export interface ForwardedFrom {
  id: string;
  chatId: string;
  chatName: string;
}

export interface Message {
  id: string;
  _id?: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  replyToId?: string;
  replyTo?: ReplyTo;
  forwardedFrom?: ForwardedFrom;
  reactions: Reaction[];
  status: 'sending' | 'delivered' | 'read' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedFor?: string[];
  isDeleted?: boolean;
  deletedForEveryone?: boolean;
  time?: string;
  attachments?: {
    id: string;
    type: 'image' | 'document' | 'audio' | 'video' | 'file';
    url: string;
    name: string;
    size: number;
    mimeType: string;
  }[];
}

export interface LastMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  type: 'text' | 'document' | 'image' | 'audio' | 'video' | 'file';
  status: 'sending' | 'delivered' | 'read' | 'failed';
  createdAt: string;
}

export interface GroupInfo {
  description?: string;
  rules?: string;
  joinLink?: string;
  settings: {
    onlyAdminsCanPost: boolean;
    onlyAdminsCanAddMembers: boolean;
    onlyAdminsCanChangeInfo: boolean;
  };
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  name?: string;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar?: string;
  description?: string;
  participants: Participant[];
  admins: string[];
  isAdmin: boolean;
  lastMessage?: {
    id: string;
    content: string;
    type: string;
    senderId: string;
    status: string;
    createdAt: Date;
  };
  settings: {
    onlyAdminsCanPost: boolean;
    onlyAdminsCanAddMembers: boolean;
    onlyAdminsCanChangeInfo: boolean;
    onlyAdminsCanPinMessages: boolean;
    onlyAdminsCanSendMedia: boolean;
    onlyAdminsCanSendLinks: boolean;
  };
  unreadCount: number;
  updatedAt: Date;
  blockedUsers?: { blocker: string; blocked: string }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  messages?: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  items?: T[];
}

export interface Styles {
  background: (isDarkMode: boolean) => string;
  backgroundSecondary: (isDarkMode: boolean) => string;
  card: {
    background: (isDarkMode: boolean) => string;
    hover: (isDarkMode: boolean) => string;
  };
  text: {
    primary: (isDarkMode: boolean) => string;
    secondary: (isDarkMode: boolean) => string;
    muted: (isDarkMode: boolean) => string;
  };
  border: (isDarkMode: boolean) => string;
  borderSecondary: (isDarkMode: boolean) => string;
  input: {
    background: (isDarkMode: boolean) => string;
    border: (isDarkMode: boolean) => string;
    focus: (isDarkMode: boolean) => string;
  };
  button: {
    primary: (isDarkMode: boolean) => string;
    secondary: (isDarkMode: boolean) => string;
  };
  message: {
    sent: (isDarkMode: boolean) => string;
    received: (isDarkMode: boolean) => string;
  };
  accent: (isDarkMode: boolean) => string;
} 