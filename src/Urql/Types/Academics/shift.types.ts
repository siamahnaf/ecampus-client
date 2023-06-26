import { Success, Meta } from "../success.types";

//Add Shift
export interface AddShiftData {
    addShift: Success
}

//Shift
export interface ShiftData {
    id: string;
    name: string;
    createdBy: {
        name: string;
        phone: string;
    }
}

//Get Shift
export interface GetShiftListData {
    getShifts: {
        results: Shift[];
        meta: Meta;
    }
}

//Get All Shift
export interface GetAllShiftData {
    getAllShifts: Shift[];
}

//Delete Shift
export interface DeleteShiftData {
    deleteShift: Success
}

//Update Shift
export interface UpdateShiftData {
    updateShift: Success
}
