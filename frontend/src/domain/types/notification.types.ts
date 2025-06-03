export interface Notification {
    _id: string;
    title: string;
    message: string;
    recipientType: 'individual' | 'all_students' | 'all_faculty' | 'all';
    recipientId?: string;
    recipientName?: string;
    createdBy: string;
    createdAt: string;
    status: 'sent' | 'failed';
  }
  
  export interface NotificationApiResponse {
    notifications: Notification[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
  }