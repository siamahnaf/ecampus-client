import { Meta, Success } from "../success.types";


export interface AddConfData {
    addConf: Success
}

export interface ConfData {
    id: string;
    classId: {
        id: string;
        name: string;
    }
    examId: {
        id: string;
        name: string;
    }[];
    subjects: {
        totalMarks: string;
        subjectId: {
            name: string;
            id: string;
        }
    }[];
    createdBy: {
        name: string;
        phone: string;
    }
}

export interface GetConfData {
    getConfs: {
        results: ConfData[];
        meta: Meta;
    }
}

export interface GetAllConfData {
    getAllConfs: ConfData[];
}

export interface DeleteConfData {
    deleteConf: Success
}