import { gql } from "urql";

export const ADD_TEACHER = gql`
mutation addTeacher($teacherInput: TeacherInput!) {
    addTeacher(teacherInput: $teacherInput) {
      success
      message
    }
}  
`;

export const GET_TEACHER_LIST = gql`
query getTeachers($searchInput: SearchInput!) {
    getTeachers(searchInput: $searchInput) {
      results {
        id
        name
        image
        phone
        email
        dob
        gender
        nid
        education
        emergencyPhone
        appointment
        salary
        createdBy {
            name
            phone
        }
        address
        document
      }
      meta {
        itemCount
        totalItems
        itemsPerPage
        totalPages
        currentPage
      }
    }
}  
`;

export const GET_ALL_TEACHER = gql`
query getAllTeacher {
    getAllTeacher {
      id
      name
      phone
      email
      gender
      createdBy {
        name
        phone
      }
    }
}
`;


export const DELETE_TEACHER = gql`
mutation deleteTeacher($deleteTeacherId: String!) {
  deleteTeacher(id: $deleteTeacherId) {
    success
    message
  }
}
`;

export const UPDATE_TEACHER = gql`
mutation updateTeacher($teacherInput: TeacherInput!, $updateTeacherId: String!) {
    updateTeacher(teacherInput: $teacherInput, id: $updateTeacherId) {
      success
      message
    }
}
`;