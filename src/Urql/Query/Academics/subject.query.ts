import { gql } from "urql";

export const ADD_SUBJECT = gql`
mutation addSubject($subjectInput: SubjectInput!) {
    addSubject(subjectInput: $subjectInput) {
      success
      message
    }
}
`;

export const GET_SUBJECT_LIST = gql`
query getSubject($searchInput: SearchInput!) {
    getSubjects(searchInput: $searchInput) {
      results {
        id
        name
        code
        type
        priority
        createdBy {
          name
          phone
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

export const GET_ALL_SUBJECTS = gql`
query getAllSubject {
    getAllSubject {
      id
      name
      type
      code
      priority
      createdBy {
        name
        phone
      }
    }
}  
`;

export const DELETE_SUBJECT = gql`
mutation deleteSubject($deleteSubjectId: String!) {
  deleteSubject(id: $deleteSubjectId) {
    success
    message
  }
}
`;

export const UPDATE_SUBJECT = gql`
mutation updateSubject($subjectInput: SubjectInput!, $updateSubjectId: String!) {
    updateSubject(subjectInput: $subjectInput, id: $updateSubjectId) {
      success
      message
    }
}
`;