import { Success, Meta } from "../success.types";

//Add Student
export interface AddStudentData {
    addStudent: Success
}

//Student List Data
export interface StudentListData {
    id: string;
    studentId: string;
    roll: string;
    name: string;
    class: {
        name: string;
    }
    section: {
        name: string;
    }
    shift: {
        name: string;
    }
    group: {
        name: string;
    }
    session: string;
}

//Get Student List data
export interface GetStudentListData {
    getStudents: {
        results: StudentListData[];
        meta: Meta;
    }
}

//Delete Student
export interface DeleteStudentData {
    deleteStudent: Success;
}

//Get Single Student
export interface GetSingleStudentData {
    getStudent: {
        id: string;
        studentId: string;
        image: string;
        class: {
            name: string;
            id: string;
        }
        section: {
            name: string;
            id: string;
        }
        group: {
            name: string;
            id: string;
        }
        shift: {
            name: string;
            id: string;
        }
        name: string;
        fee_start: string;
        gender: string;
        dob: string;
        blood: string;
        roll: string;
        session: string;
        religion: string;
        number: string;
        email: string;
        admissionDate: string;
        birthCertificate: string;
        fatherName: string;
        fatherNidNumber: string;
        fatherPhone: string;
        motherName: string;
        motherNidNumber: string;
        motherPhone: string;
        guardianName: string;
        guardianNidNumber: string;
        guardianPhone: string;
        address: string;
        school: string;
    }
};

//Get All Student
export interface GetAllStudentData {
    getAllStudent: StudentListData[];
}

//Update student
export interface UpdateStudentData {
    updateStudent: Success
}

//Promote student
export interface PromoteStudentData {
    promoteStudent: Success
}