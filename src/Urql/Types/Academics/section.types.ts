import { Success, Meta } from "../success.types";

//Add Section
export interface AddSectionData {
    addSection: Success
}

//Section
export interface SectionData {
    id: string;
    name: string;
    createdBy: {
        name: string;
        phone: string;
    }
}

//Get Section
export interface GetSectionListData {
    getSections: {
        results: SectionData[];
        meta: Meta
    }
}

//Get All Section
export interface GetAllSectionData {
    getAllSections: SectionData[];
}

//Delete Section
export interface DeleteSectionData {
    deleteSection: Success
}

//Update Section
export interface UpdateSectionData {
    updateSection: Success
}
