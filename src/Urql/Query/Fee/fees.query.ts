import { gql } from "urql";

export const ADD_FEES = gql`
mutation addFees($feeInput: FeeInput!) {
    addFees(feeInput: $feeInput) {
      success
      message
    }
}
`;

export const GET_FEES_LIST = gql`
query getFees($searchInput: SearchInput!) {
    getFees(searchInput: $searchInput) {
      id
      name
      class {
        name
        id
      }
      shift {
        id
        name
      }
      section {
        id
        name
      }
      group {
        id
        name
      }
      frequency
      amount
      createdBy {
        phone
        name
      }
    }
}
`;

export const DELETE_FEE = gql`
mutation deleteFees($deleteFeesId: String!) {
  deleteFees(id: $deleteFeesId) {
    success
    message
  }
}
`;

export const UPDATE_FEE = gql`
mutation updateFee($feeInput: FeeInput!, $updateFeesId: String!) {
  updateFees(feeInput: $feeInput, id: $updateFeesId) {
    success
    message
  }
}
`;

export const GET_FEES_BY_CLASS = gql`
query getFeeByClass($feeByClassInput: FeeByClassInput!) {
  getFeeByClass(feeByClassInput: $feeByClassInput) {
    id
    name
  }
}
`;