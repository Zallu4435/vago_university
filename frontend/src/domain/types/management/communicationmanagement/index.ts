export interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  recipients: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'read' | 'unread';
  }>;
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  isBroadcast: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'read' | 'unread' | 'delivered' | 'opened';
  recipientsCount: number;
  date?: string;
  time?: string;
}

export interface MessageDetailsModalProps {
  message: Message;
  onReply: () => void;
  onArchive: () => void;
  onDelete: () => void;
  isOpen: boolean;
  onClose: () => void;
  messageType: 'inbox' | 'sent';
}

export type MessageStatus = 'read' | 'unread' | 'delivered' | 'opened';
export type MessageTab = 'inbox' | 'sent' | 'compose';

export interface UserGroup {
  value: string;
  label: string;
}

export interface MessageAction {
  icon: React.ReactNode;
  label: string;
  onClick: (message: Message) => void;
  color: 'blue' | 'green' | 'gray' | 'red';
}

export interface MessageColumn {
  header: string;
  key: string;
  render: (message: Message) => React.ReactNode;
  width?: string;
}

// Communication management types

export type RecipientType = '' | 'all_students' | 'all_faculty' | 'all_users' | 'individual_students' | 'individual_faculty';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ComposeMessageForm {
  to: { value: string; label: string }[];
  subject: string;
  message: string;
  attachments: File[];
  isAdmin?: boolean;
}

export interface ComposeMessageModalProps {
  initialForm: ComposeMessageForm;
  onSend: (form: ComposeMessageForm) => void;
  onCancel: () => void;
  isOpen: boolean;
  userGroups: UserGroup[];
  fetchUsers: (type: RecipientType, search?: string) => Promise<User[]>;
}

// Utility type for compatibility with code expecting fetchedUsers?.users
export type UserArrayWithUsers = User[] & { users?: User[] }; 