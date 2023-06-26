import { Success, Meta } from "../success.types";

export interface AddNoticeData {
    addNotice: Success
}

export interface NoticeData {
    id: string;
    title: string;
    description: string;
    pdf: string;
    createdBy: {
        name: string;
        phone: string;
    }
    created_at: Date;
}

export interface GetNoticeData {
    getNotices: {
        results: NoticeData[];
        meta: Meta;
    }
}

export interface GetAllNoticeData {
    getAllNotice: NoticeData[];
}

export interface DeleteNoticeData {
    deleteNotice: Success
}

export interface UpdateNoticeData {
    updateNotice: Success
}