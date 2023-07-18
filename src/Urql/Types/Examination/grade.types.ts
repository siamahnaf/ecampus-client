import { Success } from "../success.types";

export interface AddGradeData {
    addGrade: Success
}

export interface GradeArray {
    name: string;
    percent_upto: string;
    percent_from: string;
    grade_point: string;
}

export interface GradeData {
    id: string;
    name: string;
    grades: GradeArray[];
    createdBy: {
        phone: string;
        name: string;
    };
}

export interface GetGradesData {
    getGrades: GradeData[];
}

export interface DeleteGradeData {
    deleteGrade: Success
}

export interface UpdateGradeData {
    updateGrade: Success
}