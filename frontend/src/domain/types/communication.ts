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
  }
  
  export interface MessageApiResponse {
    data: Message[];
    total: number;
  }

  export interface Admin {
    _id: string;
    name: string;
    email: string;
    role: string;
  }