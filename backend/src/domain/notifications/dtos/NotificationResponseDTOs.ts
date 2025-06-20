export interface NotificationResponseDTO {
    _id: string;
    title: string;
    message: string;
    recipientType: "individual" | "all_students" | "all_faculty" | "all" | "all_students_and_faculty";
    recipientId?: string;
    recipientName?: string;
    createdBy: string;
    createdAt: string;
    status: "sent" | "failed";
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