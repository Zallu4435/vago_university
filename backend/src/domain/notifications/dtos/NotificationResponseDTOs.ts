export interface NotificationResponseDTO {
    _id: string;
    title: string;
    message: string;
    recipientType: "individual" | "all_students" | "all_faculty" | "all" | "all_students_and_faculty";
    recipientId?: string;
    recipientName?: string;
    createdBy: string;
    createdAt: string; // Will be converted to ISO string
    status: "sent" | "failed";
    isRead: boolean; // Calculated based on whether current user is in readBy array
    readBy: string[]; // Array of user IDs who have read this notification
}

export interface CreateNotificationResponseDTO {
    notificationId: string;
}

export interface GetAllNotificationsResponseDTO {
    notifications: NotificationResponseDTO[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}

export interface GetIndividualNotificationResponseDTO {
    notification: NotificationResponseDTO;
}

export interface DeleteNotificationResponseDTO {
    message: string;
}

export interface MarkNotificationAsReadResponseDTO {
    success: boolean;
    message: string;
}

export interface MarkAllNotificationsAsReadResponseDTO {
    success: boolean;
    message: string;
    updatedCount: number;
}