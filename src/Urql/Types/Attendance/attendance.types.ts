import { Success } from "../success.types";

export interface StudentAttendanceList {
    id: string;
    present: string;
    student: {
        id: string;
        roll: string;
        name: string;
        studentId: string;
        session: string;
        class: {
            name: string;
        }
    }
}

export interface AddAttendanceData {
    createAttendanceSheet: StudentAttendanceList[];
}

export interface AddPresentData {
    addPresent: Success
}