import { Success, Meta } from "../success.types";

export interface AddIncomeData {
    addIncome: Success
}

export interface IncomeData {
    id: string;
    head: {
        title: string;
        id: string;
    };
    name: string;
    amount: string;
    invoice: string;
    date: string;
    file: string;
    description: string;
    createdBy: {
        name: string;
        phone: string;
    };
}

export interface GetIncomeListData {
    getIncomes: {
        results: IncomeData[];
        meta: Meta;
    }
}

export interface GetAllIncomeData {
    getAllIncome: IncomeData[];
}

export interface DeleteIncomeData {
    deleteIncome: Success
}

export interface UpdateIncomeData {
    updateIncome: Success
}
