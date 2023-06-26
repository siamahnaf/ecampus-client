import { Success, Meta } from "../success.types";

//Add Group
export interface AddClassData {
    addClass: Success;
}

//Class Data
export interface ClassData {
    id: string;
    name: string;
    section: {
        id: string;
        name: string;
    }[];
    group: {
        id: string;
        name: string;
    }[];
    shift: {
        id: string;
        name: string;
    }[];
    createdBy: {
        name: string;
        phone: string;
    };
}

//Get Class list data
export interface GetClassListData {
    getClasses: {
        results: ClassData[];
        meta: Meta
    }
}

//Get All Class data
export interface GetAllClassData {
    getAllClass: ClassData[];
}

//Delete class data
export interface DeleteClassData {
    deleteClass: Success;
}

//Update class data
export interface UpdateClassData {
    updateClass: Success;
}