import { Success, Meta } from "../success.types";

export interface AddExamData {
    addExam: Success
}

export interface ExamData {
    id: string;
    name: string;
    type: {
        name: string;
        id: string;
    };
    description: string;
    createdBy: {
        phone: string;
        name: string;
    };
}

export interface GetExamsData {
    getExams: {
        results: ExamData[];
        meta: Meta;
    }
}

export interface GetAllExamsData {
    getAllExam: ExamData[];
}

export interface DeleteExamData {
    deleteExam: Success
}

export interface UpdateExamData {
    updateExam: Success;
}