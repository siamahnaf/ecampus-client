import { Success } from "../success.types";

export interface SubjectResultData {
    studentId: {
        studentId: string;
        roll: string;
        name: string;
    };
    marks: {
        id: string;
        cq: number | null
        mcq: number | null
        practical: number | null
        ca: number | null
        fullMarks: number;
        totalMarks: number | null
        grade: string | null
    }[];
    gradeId: {
        grades: {
            name: string;
            grade_point: string;
            percent_upto: string;
            percent_from: string;
        }[];
    };
}

export interface GetSubjectResultData {
    getSubjectResult: SubjectResultData[];
}

export interface UpdateMarksData {
    updateMarks: Success
}


export interface ResultData {
    id: string;
    studentId: {
        roll: string;
        studentId: string;
        name: string;
    }
    gradeId: {
        grades: {
            name: string;
            grade_point: string;
        }[];
    };
    marks: {
        subjectId: {
            name: string;
        };
        fullMarks: string;
        cq: string;
        mcq: string;
        practical: string;
        ca: string;
        totalMarks: string;
        grade: string;
        grade_point: string;
    }[];
}

export interface GetResultsData {
    getResults: ResultData[];
}