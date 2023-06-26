import { Success, Meta } from "../success.types";

export interface AddExpenseData {
    addExpense: Success
}

export interface UpdateExpenseData {
    updateExpense: Success
}

export interface DeleteExpenseData {
    deleteExpense: Success
}

export interface ExpenseData {
    id: string;
    head: {
        id: string;
        title: string;
    }
    name: string;
    amount: string;
    invoice: string;
    date: string;
    file: string;
    description: string;
    createdBy: {
        phone: string;
        name: string;
    }
}

export interface GetExpenseListData {
    getExpenses: {
        results: ExpenseData[];
        meta: Meta;
    }
}

export interface GetAllExpense {
    getAllExpense: ExpenseData[]
}