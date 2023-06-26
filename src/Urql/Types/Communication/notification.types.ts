import { Meta, Success } from "../success.types";

export interface NotificationData {
    id: string;
    title: string;
    details: string;
    path: {
        id: string;
        type: string;
    };
    image: string;
    read: boolean;
    created_at: Date;
}

export interface NotifyData {
    notifyEvent: NotificationData;
}

export interface GetNotificationData {
    getNotifications: NotificationData[];
}

export interface UserData {
    id: string;
    name: string;
    role: string;
}

export interface SearchUserData {
    searchProfile: UserData;
}

export interface AddNotificationData {
    addNotification: Success;
}

export interface ReceiversData {
    to: string;
}
export interface ALlNotificationData {
    id: string;
    title: string;
    details: string;
    image: string;
    type: string;
    receivers: ReceiversData[];
    created_at: Date;
    senderId: {
        name: string;
        phone: string;
    };
}

export interface GetAllNotifyData {
    getAllNotifications: {
        results: ALlNotificationData[];
        meta: Meta;
    };
}

export interface GetExportNotifyData {
    getAllNotificationsWithoutPagination: ALlNotificationData[]
}

export interface MarkAsReadData {
    markAsReadNotification: Success;
}