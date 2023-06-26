import { Success, Meta } from "../success.types";

//Add teacher
export interface AddTeacherData {
    addTeacher: Success;
}

//Teacher data
export interface TeacherData {
    id: string;
    name: string;
    image: string;
    phone: string;
    email: string;
    dob: string;
    gender: string;
    nid: string;
    education?: string;
    emergencyPhone?: string;
    appointment: string;
    createdBy: {
        name: string;
        phone: string;
    };
    document: string;
    salary: string;
    address: string;
}

//Get teacher data
export interface GetTeachersData {
    getTeachers: {
        results: TeacherData[];
        meta: Meta;
    }
}

//Get All Teacher
export interface GetAllTeacher {
    getAllTeacher: TeacherData[];
}

//Delete Teacher
export interface DeleteTeacherData {
    deleteTeacher: Success;
}

//Update Teacher
export interface UpdateTeacherData {
    updateTeacher: Success;
}