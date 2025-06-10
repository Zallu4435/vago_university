import { IconType } from 'react-icons';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  type?: 'user' | 'faculty';
  isOnline?: boolean;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'video';
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
  type: 'text' | 'file' | 'image' | 'audio' | 'video';
  createdAt: string;
}

export interface ForwardedFrom {
  id: string;
  chatId: string;
  chatName: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'audio' | 'video';
  status: 'sending' | 'delivered' | 'read' | 'failed';
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
  replyTo?: string;
  forwardedFrom?: ForwardedFrom;
  reactions?: Reaction[];
  isDeleted?: boolean;
  deletedForEveryone?: boolean;
}

export interface LastMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  type: 'text' | 'file' | 'image' | 'audio' | 'video';
  status: 'sending' | 'delivered' | 'read' | 'failed';
  createdAt: string;
}

export interface GroupSettings {
  onlyAdminsCanPost: boolean;
  onlyAdminsCanAddMembers: boolean;
  onlyAdminsCanChangeInfo: boolean;
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  type: string;
}

export interface Chat {
  id: string;
  type: string;
  name: string;
  avatar?: string;
  description?: string;
  lastMessage?: {
    id: string;
    content: string;
    type: string;
    senderId: string;
    status: string;
    createdAt: Date;
  };
  participants: Participant[];
  admins?: string[];
  unreadCount: number;
  updatedAt: Date;
  settings?: {
    onlyAdminsCanPost: boolean;
    onlyAdminsCanAddMembers: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
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