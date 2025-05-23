// src/domain/types/communication.ts

export interface Message {
    id: string;
    from?: string;
    email?: string;
    to?: string;
    subject: string;
    date: string;
    time: string;
    status: 'unread' | 'read' | 'delivered' | 'opened';
    content: string;
    thread?: {
      id: string;
      from: string;
      content: string;
      date: string;
      time: string;
    }[];
    recipients?: number;
  }
  
  export interface MessageForm {
    to: { value: string; label: string }[];
    subject: string;
    message: string;
    attachments: File[];
  }
  
  export interface MessageApiResponse {
    data: Message[];
    total: number;
  }