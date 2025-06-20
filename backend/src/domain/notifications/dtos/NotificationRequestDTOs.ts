export interface CreateNotificationRequestDTO {
    title: string;
    message: string;
    recipientType: "individual" | "all_students" | "all_faculty" | "all" | "all_students_and_faculty";
    recipientId?: string;
    recipientName?: string;
    createdBy: string;
}

export interface GetAllNotificationsRequestDTO {
    userId: string;
    collection: "register" | "admin" | "user" | "faculty";
    page: number;
    limit: number;
    recipientType?: string;
    status?: string;
    dateRange?: string;
}

export interface GetIndividualNotificationRequestDTO {
    notificationId: string;
}

export interface DeleteNotificationRequestDTO {
    notificationId: string;
    authenticatedUserId: string;
    collection: "register" | "admin" | "user" | "faculty";
}