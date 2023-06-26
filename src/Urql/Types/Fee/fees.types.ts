import { Success } from "../success.types";

//Add Fees
export interface AddFeesData {
    addFees: Success
}

//Fees Data
export interface FeesData {
    id: string;
    name: string;
    class: {
        id: string;
        name: string;
    };
    shift: {
        id: string;
        name: string;
    };
    section: {
        id: string;
        name: string;
    };
    group: {
        id: string;
        name: string;
    };
    late_fee: string;
    payed_in: string;
    frequency: string;
    amount: string;
    createdBy: {
        phone: string;
        name: string;
    }
}

//Get Fees Data 
export interface GetFeesData {
    getFees: FeesData[];
}


//Delete fees data
export interface DeleteFeesData {
    deleteFees: Success
}

//Update fees data
export interface UpdateFeeData {
    updateFees: Success
}

export interface FeeByClass {
    id: string;
    name: string;
}

export interface GetFeeByClass {
    getFeeByClass: FeeByClass[];
}