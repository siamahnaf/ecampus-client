import { Success, Meta } from "../success.types";

export interface AddExpenseHeadData {
    addExpenseHead: Success
}

export interface UpdateExpenseHeadData {
    updateExpenseHead: Success
}

export interface DeleteExpenseHeadData {
    deleteExpenseHead: Success
}

export interface ExpenseHeadData {
    id: string;
    title: string;
    description: string;
    createdBy: {
        phone: string;
        name: string;
    }
}

export interface GetExpenseHeadData {
    getExpenseHeads: {
        results: ExpenseHeadData[];
        meta: Meta;
    }
}


export interface GetAllExpenseHead {
    getAllExpenseHead: ExpenseHeadData[];
}
