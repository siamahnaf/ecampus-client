import { Success, Meta } from "../success.types";

//Add Subject
export interface AddSubjectData {
    addSubject: Success
}

//Subject Data
export interface SubjectData {
    id: string;
    name: string;
    type: string;
    priority: string;
    code: string;
    createdBy: {
        name: string;
        phone: string;
    }
}

//Get Subject Data
export interface GetSubjectListData {
    getSubjects: {
        results: SubjectData[];
        meta: Meta;
    }
}

//Get All Subject Data
export interface GetAllSubjectData {
    getAllSubject: SubjectData[];
}

//Delete Subject
export interface DeleteSubjectData {
    deleteSubject: Success
}

//Update Subject
export interface UpdateSubjectData {
    updateSubject: Success
}