import { Success, Meta } from "../success.types";

//Complain Data
export interface ComplainData {
    id: string;
    title: string;
    description: string;
    complainBy: {
        name: string;
        phone: string;
        studentId: string;
    }
    status: string;
    created_at: Date;
    anonymous: boolean;
}

//Get complain list
export interface GetComplainData {
    getComplains: {
        results: ComplainData[];
        meta: Meta;
    }
}

export interface GetAllComplain {
    getAllComplain: ComplainData[];
}

//Update complain status 
export interface UpdateComplainStatus {
    updateComplainStatus: Success
}

