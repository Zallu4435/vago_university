export interface MessageForm {
    to: Array<{ value: string; label: string }>;
    subject: string;
    message: string;
    isAdmin?: boolean;
}

export interface Admin {
    _id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
}

export interface Message {
    id: string;
    _id?: string;
    subject: string;
    content: string;
    sender: {
        id: string;
        _id?: string;
        name: string;
        email: string;
        role: string;
    };
    recipients: Array<{
        id: string;
        _id?: string;
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

export interface MessageApiResponse {
    data: Message[];
    total: number;
}

export interface ComposeMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (form: MessageForm) => void;
    initialForm?: MessageForm;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }