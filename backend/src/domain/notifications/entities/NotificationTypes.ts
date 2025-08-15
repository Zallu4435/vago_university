export enum NotificationStatus {
  SENT = "sent",
  FAILED = "failed",
  PENDING = "pending"
}

export enum NotificationRecipientType {
  INDIVIDUAL = "individual",
  ALL_STUDENTS = "all_students",
  ALL_FACULTY = "all_faculty",
  ALL = "all",
  ALL_STUDENTS_AND_FACULTY = "all_students_and_faculty",
}

export interface NotificationProps {
  id?: string;
  title: string;
  message: string;
  recipientType: NotificationRecipientType;
  recipientId?: string;
  recipientName?: string;
  createdBy: string;
  createdAt?: Date; 
  status: NotificationStatus;
  readBy?: string[]; 
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  recipientType: NotificationRecipientType;
  recipientId?: string;
  recipientName?: string;
  createdBy: string;
  createdAt: Date;
  status: NotificationStatus;
  readBy: string[]; 
}

export type CreateNotificationProps = Omit<NotificationProps, 'id' | 'createdAt'>;
export type UpdateNotificationProps = Partial<Omit<NotificationProps, 'createdAt'>> & { id: string }; 

export interface NotificationFilter {
  $or?: Array<{
    recipientId?: string;
    recipientType?: NotificationRecipientType | { $in: string[] };
  }>;
  readBy?: string | { $ne: string };
  recipientType?: NotificationRecipientType | string | { $in: string[] };
  status?: string;
  createdAt?: { $gte?: Date; $lte?: Date };
  search?: string;
  [key: string]: unknown; 
}
