import { Meta, Success } from "../success.types";

//Add Group
export interface AddGroupData {
    createGroup: Success;
}

//Group
export interface GroupData {
    id: string;
    name: string;
    createdBy: {
        name: string;
        phone: string;
    }
}

//Get Group
export interface GetGroupListData {
    getGroups: {
        results: GroupData[];
        meta: Meta
    }
}

// Get All Group
export interface GetAllGroupData {
    getAllGroups: GroupData[];
}

export interface DeleteGroupData {
    deleteGroup: Success;
}

//Update Section
export interface UpdateGroupData {
    updateGroup: Success;
}