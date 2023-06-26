import { Success, Meta } from "../success.types";

export interface AddIncomeHead {
    addIncomeHead: Success
}

export interface IncomeHeadData {
    id: string;
    title: string;
    description: string;
    createdBy: {
        name: string;
        phone: string;
    };
}

export interface GetIncomeHeadData {
    getIncomeHeads: {
        results: IncomeHeadData[];
        meta: Meta;
    }
}

export interface GetAllIncomeHeadData {
    getAllIncomeHead: IncomeHeadData[];
}

export interface DeleteIncomeHeadData {
    deleteIncomeHead: Success
}

export interface UpdateIncomeHeadData {
    updateIncomeHead: Success
}
