import { Success, Meta } from "../success.types";

//Add Period
export interface AddPeriodData {
    addPeriod: Success;
}

//Period
export interface PeriodData {
    id: string;
    name: string;
    start: string;
    shift: {
        name: string;
        id: string;
    }
    end: string;
    is_break: boolean;
    createdBy: {
        name: string;
        phone: string;
    }
}

//Get Period
export interface GetPeriodListData {
    getPeriods: {
        results: PeriodData[];
        meta: Meta;
    }
}

//Get All Period
export interface GetAllPeriod {
    getAllPeriod: PeriodData[];
}

//Delete Period
export interface DeletePeriodData {
    deletePeriod: Success;
}

//Update Period
export interface UpdatePeriodData {
    updatePeriod: Success;
}