// Notification Management Types

export interface Notification {
  _id: string;
  title: string;
  message: string;
  recipientType: string;
  recipientName?: string;
  createdBy: string;
  createdAt: string;
  status: string;
  [key: string]: any;
}

export interface NotificationFilters {
  recipientType: string;
  status: string;
  dateRange?: string;
  search?: string;
}

export interface NotificationFormData {
  title: string;
  message: string;
  recipientType: string;
  recipientId: string;
  recipientName: string;
  createdBy: string;
}

export interface NotificationDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
  isLoading: boolean;
}

export interface AddNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Notification, '_id' | 'createdAt' | 'status'>) => void;
  recipientTypes: string[];
}

export interface NotificationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
}

export interface StatusBadgeProps {
  status: string;
}

export interface InfoCardProps {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: string;
} 