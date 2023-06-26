import { gql } from "urql";

export const ADD_STUDENT = gql`
mutation addStudent($studentInput: StudentInput!) {
    addStudent(studentInput: $studentInput) {
      success
      message
    }
}
`;

export const GET_STUDENT_LIST = gql`
query getStudents($studentPaginationInput: StudentPaginationInput!) {
    getStudents(studentPaginationInput: $studentPaginationInput) {
      results {
        id
        studentId
        roll
        name
        class {
          name
        }
        section {
          name
        }
        shift {
          name
        }
        group {
          name
        }
        session
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

export const DELETE_STUDENT = gql`
mutation deleteStudent($deleteStudentId: String!) {
  deleteStudent(id: $deleteStudentId) {
    success
    message
  }
}
`;

export const GET_SINGLE_STUDENT = gql`
query getStudent($getStudentId: String!) {
    getStudent(id: $getStudentId) {
      id
      studentId
      image
      class {
        name
        id
      }
      section {
        id
        name
      }
      shift {
        id
        name
      }
      group {
        id
        name
      }
      name
      fee_start
      gender
      dob
      blood
      religion
      number
      roll
      session
      email
      admissionDate
      birthCertificate
      fatherName
      fatherNidNumber
      fatherPhone
      motherName
      motherNidNumber
      motherPhone
      guardianName
      guardianNidNumber
      guardianPhone
      address
      school
    }
}  
`;

export const GET_ALL_STUDENT = gql`
query getAllStudent($studentPramsInput: StudentPramsInput!) {
    getAllStudent(StudentPramsInput: $studentPramsInput) {
      id
      studentId
      roll
      name
      class {
        name
      }
      section {
        name
      }
      shift {
        name
      }
      group {
        name
      }
      session
    }
}
`;

export const UPDATE_STUDENT = gql`
mutation updateStudent($studentInput: StudentInput!, $updateStudentId: String!) {
  updateStudent(studentInput: $studentInput, id: $updateStudentId) {
    success
    message
  }
}
`;

export const PROMOTE_STUDENT = gql`
mutation promoteStudent($promoteInput: PromoteInput!) {
  promoteStudent(promoteInput: $promoteInput) {
    success
    message
  }
}
`;