// src/domain/types/communication.ts

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
  }
  
  export interface MessageForm {
    to: Array<{ value: string; label: string }>;
    subject: string;
    message: string;
    attachments: File[];
    isAdmin?: boolean;
  }
  
  export interface MessageApiResponse {
    data: Message[];
    total: number;
  }

  export interface Admin {
    id: string;
    name: string;
    email: string;
    role: string;
  }