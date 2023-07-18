import { gql } from "urql";

export const ADD_EXAM = gql`
mutation addExam($examInput: ExamInput!) {
    addExam(examInput: $examInput) {
      success
      message
    }
}
`;

export const GET_EXAM_LIST = gql`
query getExams($searchInput: SearchInput!) {
    getExams(searchInput: $searchInput) {
      results {
        id
        name
        type {
          name
          id
        }
        description
        createdBy {
          phone
          name
        }
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

export const GET_ALL_EXAM = gql`
query getAllExam {
    getAllExam {
      id
      name
      type {
        name
        id
      }
      description
      createdBy {
        phone
        name
      }
    }
}  
`;

export const DELETE_EXAM = gql`
mutation deleteExam($deleteExamId: String!) {
    deleteExam(id: $deleteExamId) {
      success
      message
    }
}
`;

export const UPDATE_EXAM = gql`
mutation updateExam($examInput: ExamInput!, $updateExamId: String!) {
    updateExam(examInput: $examInput, id: $updateExamId) {
      success
      message
    }
}
`;