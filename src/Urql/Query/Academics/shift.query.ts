import { gql } from "urql";

export const ADD_SHIFT = gql`
mutation addShift($shiftInput: ShiftInput!) {
    addShift(shiftInput: $shiftInput) {
      success
      message
    }
}
`;

export const GET_SHIFT_LIST = gql`
query getShifts($searchInput: SearchInput!) {
    getShifts(searchInput: $searchInput) {
      results {
        id
        name
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

export const GET_ALL_SHIFT = gql`
query getAllShift {
    getAllShifts {
      id
      name
      createdBy {
        name
        phone
      }
    }
}
`;

export const DELETE_SHIFT = gql`
mutation deleteShift($deleteShiftId: String!) {
    deleteShift(id: $deleteShiftId) {
      success
      message
    }
}
`;

export const UPDATE_SHIFT = gql`
mutation updateShift($shiftInput: ShiftInput!, $updateShiftId: String!) {
    updateShift(shiftInput: $shiftInput, id: $updateShiftId) {
      success
      message
    }
}
`;