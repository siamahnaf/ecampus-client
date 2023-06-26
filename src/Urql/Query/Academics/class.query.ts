import { gql } from "urql";

export const ADD_CLASS = gql`
mutation addClass($classInput: ClassInput!) {
    addClass(classInput: $classInput) {
      success
      message
    }
}
`;

export const GET_CLASS_LIST = gql`
query getClasses($searchInput: SearchInput!) {
    getClasses(searchInput: $searchInput) {
      results {
        id
        name
        section {
          id
          name
        }
        group {
          id
          name
        }
        shift {
          id
          name
        }
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

export const GET_ALL_CLASS = gql`
query getAllClass {
    getAllClass {
      id
      name
      section {
        id
        name
      }
      group {
        id
        name
      }
      shift {
        id
        name
      }
      createdBy {
        name
        phone
      }
    }
}  
`;

export const DELETE_CLASS = gql`
mutation deleteClass($deleteClassId: String!) {
  deleteClass(id: $deleteClassId) {
    success
    message
  }
}
`;

export const UPDATE_CLASS = gql`
mutation updateClass($classInput: ClassInput!, $updateClassId: String!) {
    updateClass(classInput: $classInput, id: $updateClassId) {
      success
      message
    }
}
`;