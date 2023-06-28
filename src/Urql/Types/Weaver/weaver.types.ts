import { Success } from "../success.types";

export interface Student {
    id: string;
    studentId: string;
    name: string;
    class: {
        id: string;
        name: string
    };
    shift: {
        id: string;
        name: string
    };
    section: {
        id: string;
        name: string
    };
    group: {
        id: string;
        name: string
    };
    image: string;
    motherName: string;
    fatherName: string;
}

export interface Weaver {
    id: string;
    fee: {
        id: string;
        name: string
    };
    discount: string;
    discountUnit: string;
    frequency: string;
    createdBy: {
        name: string;
        phone: string;
    };
}

export interface GetWeaverData {
    getWeavers: {
        student: Student;
        weavers: Weaver[]
    }
}

export interface AddWeaverData {
    addWeaver: Success
}

export interface DeleteWeaverData {
    deleteWeaver: Success
}

export interface UpdateWeaverData {
    updateWeaver: Success
}