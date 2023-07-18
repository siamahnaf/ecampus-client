import { gql } from "urql";

export const ADD_GRADE_SYSTEM = gql`
mutation addGrade($gradeInput: GradeInput!){
    addGrade(gradeInput: $gradeInput) {
      success
      message
    }
}
`;

export const GET_GRADE_SYSTEM = gql`
query getGrade($searchInput: SearchInput!) {
    getGrades(searchInput: $searchInput) {
      id
      name
      grades {
        name
        percent_upto
        percent_from
        grade_point
      }
      createdBy {
        phone
        name
      }
    }
}
`;


export const UPDATE_GRADE_SYSTEM = gql`
mutation updateGrade($gradeInput: GradeInput!, $updateGradeId: String!) {
    updateGrade(gradeInput: $gradeInput, id: $updateGradeId) {
      success
      message
    }
}
`;

export const DELETE_GRADE_SYSTEM = gql`
mutation deleteGrade($deleteGradeId: String!) {
    deleteGrade(id: $deleteGradeId) {
      success
      message
    }
}
`;